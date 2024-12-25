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
const CAST_POKER_ADDRESS = '0x3Dabb4d559C176ee7A149222404Af0deB7f8e889'
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
//         address: CAST_POKER_ADDRESS,
//         abi: castPokerAbi,
//         eventName: 'TableCreated',
//         fromBlock: BigInt(blk.height),
//     })
// console.log('CONTRACT EVENTS', logs)

// FIXME RUN THIS IN A LOOP
const tableid = 5

    tableInfo = await baseClient.readContract({
        address: CAST_POKER_ADDRESS,
        abi: castPokerAbi,
        functionName: 'getTable',
        args: [tableid]
    }).catch(err => console.error(err))
console.log('TABLE INFO', tableInfo)

    /* Package table info. */
    tableInfo = {
        state: tableInfo.state,
        token: tableInfo.token,
        host: tableInfo.host,
        seed: tableInfo.seed.toString(),
        buyin: tableInfo.buyin.toString(),
        tts: tableInfo.tts.toString(),
        pot: tableInfo.pot.toString(),
        paid: tableInfo.paid.toString(),
        seats: tableInfo.seats,
        fomo: tableInfo.fomo,
        theme: tableInfo.theme,
        community: tableInfo.community,
    }
console.log('TABLE INFO (packaged)', tableInfo)

return

    params = {
        address: CAST_POKER_ADDRESS,
        abi: castPokerAbi,
        functionName: 'payout',
        args: [
            BigInt(tableid),
            process.env.TREASURY_ADDRESS,
            1000000000000n,
            // '0xC8013A8C09774eb2a008FdCbeDB5f640d1dbec00',
            // 9500000000000n,
        ],
        account: baseAccount().account,
    }
// console.log('CONTRACT PARAMS (payout)', params)

    /* Validate cashier. */
    response = await baseClient
        .simulateContract(params)
        .catch(err => {
            // console.error(err)
            console.error('ERROR MSG:', err.message)
        })
console.log('RESPONSE (simulate payout)', response)

    if (typeof response !== 'undefined' && response.request) {
        response = await baseAccount()
            .writeContract(response.request)
            .catch(err => console.error(err))
console.log('RESPONSE (execute payout)', response)
    }

    params = {
        address: CAST_POKER_ADDRESS,
        abi: castPokerAbi,
        functionName: 'closeTable',
        args: [ BigInt(tableid) ],
        account: baseAccount().account,
    }
// console.log('CONTRACT PARAMS (close)', params)

    /* Validate dealer. */
    response = await baseClient
        .simulateContract(params)
        .catch(err => {
            // console.error(err)
            console.error(err.message)
        })
console.log('RESPONSE (simulate close)', response)

    if (typeof response !== 'undefined' && response.request) {
        response = await baseAccount()
            .writeContract(response.request)
            .catch(err => console.error(err))
console.log('RESPONSE (execute close)', response)
    }

}
