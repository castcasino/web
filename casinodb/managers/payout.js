/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { Sha256 } from '@aws-crypto/sha256-js'

/* Import blockchain clients. */
import baseClient from '../clients/baseInfura.js'
import degenClient from '../clients/degen.js'
import ethClient from '../clients/eth.js'

/* Import blockchain accounts. */
import baseAccount from '../accounts/base.js'

/* Import contract ABI. */
import castPokerAbi from '../abi/CastPoker.js'

/* Import deck manager (utils). */
import {
    fullDeck,
    idxLookup,
    dealCards,
} from '../libs/dealer.js'

/* Initialize databases. */
const blocksBaseDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/blocks_base`)
const pokerTablesDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/poker_tables`)
const systemDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/system`)

/* Initialize constants. */
const CAST_POKER_ADDRESS = '0xD54f3183bB58fAe987F2D1752FFc37BaB4DBaA95'
const MIN_SHOWDOWN_BLOCKS = 50

export default async () => {
console.log('MANAGING PAYOUT')
    /* Initialize locals. */
    let tableInfo

//     const blk = await systemDb
//         .get('blk_table_created')
//         .catch(err => console.error(err))
// // console.log('BLOCK', blk)
//
//     if (typeof blk === 'undefined') {
//         throw new Error('ERROR: System database failed!')
//     }
//
//     const logs = await baseClient.getContractEvents({
//         address: '0xD54f3183bB58fAe987F2D1752FFc37BaB4DBaA95',
//         abi: castPokerAbi,
//         eventName: 'TableCreated',
//         fromBlock: BigInt(blk.height),
//     })
// console.log('CONTRACT EVENTS', logs)

// FIXME RUN THIS IN A LOOP
const tableid = 3

    tableInfo = await baseClient.readContract({
        address: CAST_POKER_ADDRESS,
        abi: castPokerAbi,
        functionName: 'tables',
        args: [tableid]
    })
console.log('TABLE INFO', tableInfo)

    /* Package table info. */
    tableInfo = {
        state: tableInfo[0],
        token: tableInfo[1],
        host: tableInfo[2],
        seed: tableInfo[3].toString(),
        buyin: tableInfo[4].toString(),
        tts: tableInfo[5].toString(),
        pot: tableInfo[6].toString(),
        paid: tableInfo[7].toString(),
        seats: tableInfo[8],
        fomo: tableInfo[9],
        theme: tableInfo[10],
        community: tableInfo[11],
    }
console.log('TABLE INFO (packaged)', tableInfo)

return

    response = await pokerTablesDb
        .query('api/hasCommunity', {
            include_docs: true,
        }).catch(err => console.error(err))
// console.log('RESPONSE (unseated tables)', response)

    /* Validate response. */
    if (!response || response.total_rows === 0) {
        return console.log('  All tables are seated!')
    }

    /* Set (open) tables. */
    // tables = response.rows.map((_unset) => {
    //     return _unset.doc
    // })

    /* Initialize tables. */
    tables = {}

    /* Remodel tables data (to object). */
    response.rows.forEach(_table => {
        /* Set id. */
        const id = _table.id

        /* Set table. */
        tables[id] = _table.doc

        /* Sanitize. */
        delete tables[id]._id
        delete tables[id]._rev
    })
console.log('OPEN TABLES', tables)

    blockIdx = tables[tableid]?.community?.flop1?.blockIdx
console.log('BLOCK INDEX', blockIdx)

    response = await blocksBaseDb
        .get(blockIdx.toString(), { include_docs: true })
        .catch(err => console.error(err))
console.log('RESPONSE (time blocks)', response)

    if (typeof response !== 'undefined') {
        timestamp = response.timestamp
    }

    if (typeof timestamp === 'undefined') {
        throw new Error('ERROR: Invalid timestamp in blocks database.')
    }
console.log('TIMESTAMP', timestamp)

    /* Set time to sit. */
    tts = tables[tableid]?.tts
console.log('TIME TO SIT', tts)

    /* Set showdown timestamp. */
    showdownAt = timestamp + Number(tts)
console.log('SHOWDOWN AT', showdownAt)

    response = await blocksBaseDb
        .query('api/byTimestamp', {
            startkey: showdownAt,
            limit: MIN_SHOWDOWN_BLOCKS,
            include_docs: true,
        }).catch(err => console.error(err))
// console.log('RESPONSE (time blocks)', response)

    /* Set (time) blocks. */
    blocks = response.rows.map((_unset) => {
        return _unset.doc
    })
console.log('SHOWDOWN BLOCKS', blocks.length, blocks[0])


    activeDeck = fullDeck()
    // console.log('(FULL) DECK', activeDeck.length, activeDeck)

console.log('ACTIVE DECK', activeDeck.length, activeDeck)
    dealCards(
        activeDeck, tables[tableid].community.flop1.blockHash.slice(2), 1)
// console.log('ACTIVE DECK', activeDeck.length)
    dealCards(
        activeDeck, tables[tableid].community.flop2.blockHash.slice(2), 1)
// console.log('ACTIVE DECK', activeDeck.length)
    dealCards(
        activeDeck, tables[tableid].community.flop3.blockHash.slice(2), 1)
// console.log('ACTIVE DECK', activeDeck.length)
    dealCards(
        activeDeck, tables[tableid].community.turn.blockHash.slice(2), 1)
// console.log('ACTIVE DECK', activeDeck.length)
    dealCards(
        activeDeck, tables[tableid].community.river.blockHash.slice(2), 1)
// console.log('ACTIVE DECK', activeDeck.length)

    /* Initialize selected handler. */
    selected = []

    selected.push(dealCards(
        activeDeck, blocks[0].hash.slice(2), 2))
// console.log('ACTIVE DECK', activeDeck.length)
    selected.push(dealCards(
        activeDeck, blocks[1].hash.slice(2), 2))
// console.log('ACTIVE DECK', activeDeck.length)

console.log('SELECTED', selected)
console.log('ACTIVE DECK', activeDeck.length, activeDeck)

    /* Initialize seated handler. */
    seated = []

    seat = {
        address: tables[tableid].seated[0],
        hole1: selected[0][0],
        hole1Idx: idxLookup(selected[0][0]),
        hole2: selected[0][1],
        hole2Idx: idxLookup(selected[0][1]),
        blockIdx: blocks[0]._id,
        blockHash: blocks[0].hash,
    }
    seated.push(seat)
console.log('SEAT-1', seat)

    seat = {
        address: tables[tableid].seated[1],
        hole1: selected[1][0],
        hole1Idx: idxLookup(selected[1][0]),
        hole2: selected[1][1],
        hole2Idx: idxLookup(selected[1][1]),
        blockIdx: blocks[1]._id,
        blockHash: blocks[1].hash,
    }
    seated.push(seat)
console.log('SEAT-2', seat)

    /* Set seat index. */
    seatIdx = 1

    params = {
        address: CAST_POKER_ADDRESS,
        abi: castPokerAbi,
        functionName: 'dealCards',
        args: [
            BigInt(tableid),
            seated[seatIdx].address,
            seated[seatIdx].hole1Idx,
            seated[seatIdx].hole2Idx,
        ],
        account: baseAccount().account,
    }
// console.log('CONTRACT PARAMS (deal cards)', params)

    /* Validate hostess. */
//     response = await baseClient
//         .simulateContract(params)
//         .catch(err => {
//             // console.error(err)
//             console.error('ERROR MSG:', err.message)
//         })
// console.log('RESPONSE (simulate deal cards)', response)

return

//     if (typeof response !== 'undefined' && response.request) {
//         response = await baseAccount()
//             .writeContract(response.request)
//             .catch(err => console.error(err))
// console.log('RESPONSE (write deal cards)', response)
//     }

    params = {
        address: CAST_POKER_ADDRESS,
        abi: castPokerAbi,
        functionName: 'showdown',
        args: [ BigInt(tableid) ],
        account: baseAccount().account,
    }
// console.log('CONTRACT PARAMS (showdown)', params)

    /* Validate hostess. */
    response = await baseClient
        .simulateContract(params)
        .catch(err => {
            // console.error(err)
            console.error(err.message)
        })
console.log('RESPONSE (simulate showdown)', response)

    if (typeof response !== 'undefined' && response.request) {
        response = await baseAccount()
            .writeContract(response.request)
            .catch(err => console.error(err))
console.log('RESPONSE (write showdown)', response)
    }


    // const hash = new Sha256();
    // hash.update('some data');
    // const result = await hash.digest()
}
