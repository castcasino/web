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
    let params
    let response
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

// return

    params = {
        address: CAST_POKER_ADDRESS,
        abi: castPokerAbi,
        functionName: 'payout',
        args: [
            BigInt(tableid),
            '0x27a9b30DBe015842098F4CD31f0301a1cEE74bfe',
            9500000000000n,
        ],
        account: baseAccount().account,
    }
console.log('CONTRACT PARAMS (payout)', params)

    /* Validate hostess. */
//     response = await baseClient
//         .simulateContract(params)
//         .catch(err => {
//             // console.error(err)
//             console.error('ERROR MSG:', err.message)
//         })
// console.log('RESPONSE (simulate deal cards)', response)

}
