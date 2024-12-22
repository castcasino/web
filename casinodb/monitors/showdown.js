/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'

/* Import blockchain clients. */
import { baseClient } from '../clients/base.js'
import { degenClient } from '../clients/degen.js'
import { ethClient } from '../clients/eth.js'

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
console.log('MANAGING SHOWDOWN')
    /* Initialize locals. */
    let activeDeck
    let blocks
    let blockIdx
    let playerHashes
    let response
    let selected
    let showdownAt
    let tables
    let timestamp
    let tts

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
    tables = response.rows.map((_unset) => {
        return _unset.doc
    })
console.log('OPEN TABLES', tables)

const tableid = 0

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
console.log('ACTIVE DECK', activeDeck.length)
    dealCards(
        activeDeck, tables[tableid].community.flop2.blockHash.slice(2), 1)
console.log('ACTIVE DECK', activeDeck.length)
    dealCards(
        activeDeck, tables[tableid].community.flop3.blockHash.slice(2), 1)
console.log('ACTIVE DECK', activeDeck.length)
    dealCards(
        activeDeck, tables[tableid].community.turn.blockHash.slice(2), 1)
console.log('ACTIVE DECK', activeDeck.length)
    dealCards(
        activeDeck, tables[tableid].community.river.blockHash.slice(2), 1)
console.log('ACTIVE DECK', activeDeck.length)

    /* Initialize selected handler. */
    selected = []

    selected.push(dealCards(
        activeDeck, blocks[0].hash.slice(2), 2))
console.log('ACTIVE DECK', activeDeck.length)
    selected.push(dealCards(
        activeDeck, blocks[1].hash.slice(2), 2))
console.log('ACTIVE DECK', activeDeck.length)
    selected.push(dealCards(
        activeDeck, blocks[2].hash.slice(2), 2))
console.log('ACTIVE DECK', activeDeck.length)
    selected.push(dealCards(
        activeDeck, blocks[3].hash.slice(2), 2))
console.log('ACTIVE DECK', activeDeck.length)
    selected.push(dealCards(
        activeDeck, blocks[4].hash.slice(2), 2))
console.log('ACTIVE DECK', activeDeck.length)

console.log('SELECTED', selected)
console.log('ACTIVE DECK', activeDeck.length, activeDeck)

return

    /* Validate hostess. */
    if (hostess) {
        seated = await baseClient.readContract({
            address: CAST_POKER_ADDRESS,
            abi: castPokerAbi,
            functionName: 'getSeated',
            args: [BigInt(hostess._id)]
        }).catch(err => console.error(err))
// console.log('SEATED', seated)

    }

}
