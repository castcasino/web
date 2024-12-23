/* Import modules. */
import moment from 'moment'

/* Import blockchain clients. */
import baseClient from '../clients/baseInfura.js'
import degenClient from '../clients/degen.js'
import ethClient from '../clients/eth.js'

/* Import contract ABI. */
import { castPokerAbi } from '../abi/CastPoker.js'

/* Initialize constants. */
const CAST_POKER_ADDRESS = '0xD54f3183bB58fAe987F2D1752FFc37BaB4DBaA95'

/**
 * Logs Module
 */
export default async (req, res) => {
console.log('BODY', req.body)

    /* Initialize locals. */
    let body
    let bytecode
    let filter
    let logs
    let seated
    let tableid
    let tableInfo
    let totalTables
    let unwatch

    /* Validate body. */
    if (req.body) {
        body = req.body
    }

    /* Validate table id. */
    if (typeof body.tableid !== 'undefined') {
        tableid = body.tableid
    }
console.log('TABLE ID', tableid)

    totalTables = await baseClient.readContract({
        address: CAST_POKER_ADDRESS,
        abi: castPokerAbi,
        functionName: 'getTotalTables',
    })
console.log('TOTAL TABLES', totalTables)

    seated = await baseClient.readContract({
        address: CAST_POKER_ADDRESS,
        abi: castPokerAbi,
        functionName: 'getSeated',
        args: [BigInt(tableid)]
    })
console.log('SEATED', seated)

    // unwatch = baseClient.watchContractEvent({
    //     address: CAST_POKER_ADDRESS,
    //     abi: castPokerAbi,
    //     onLogs: logs => console.log('WATCHED', logs),
    //     fromBlock: 1n
    // })

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
        seated,
    }
console.log('TABLE INFO (packaged)', tableInfo)

    if (tableInfo) {
        return res.json(tableInfo)
    } else {
        return res.json([])
    }
}
