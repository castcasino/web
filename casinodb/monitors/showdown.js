/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'

/* Import blockchain clients. */
import { baseClient } from '../clients/base.js'
import { degenClient } from '../clients/degen.js'
import { ethClient } from '../clients/eth.js'

/* Import contract ABI. */
import castPokerAbi from '../abi/CastPoker.js'

/* Initialize databases. */
const blocksBaseDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/blocks_base`)
const pokerTablesDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/poker_tables`)
const systemDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/system`)

/* Initialize constants. */
const CAST_POKER_ADDRESS = '0xD54f3183bB58fAe987F2D1752FFc37BaB4DBaA95'

export default async () => {
console.log('MANAGING SHOWDOWN')
    /* Initialize locals. */
    let blocks
    let blockIdx
    let response
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

    blockIdx = tables[0]?.community?.flop1?.blockIdx
console.log('BLOCK INDEX', blockIdx)

    tts = tables[0]?.tts
console.log('TIME TO SIT', tts)

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

    showdownAt = timestamp + Number(tts)
console.log('SHOWDOWN AT', showdownAt)

    response = await blocksBaseDb
        .query('api/byTimestamp', {
            startkey: showdownAt,
            limit: 10,
            include_docs: true,
        }).catch(err => console.error(err))
// console.log('RESPONSE (time blocks)', response)

    /* Set (time) blocks. */
    blocks = response.rows.map((_unset) => {
        return _unset.doc
    })
console.log('SHOWDOWN BLOCKS', blocks)

return

    /* Assign hostess. */
    hostess = unseated[0]

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
