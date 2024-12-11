/* Import modules. */
import moment from 'moment'
import { parseAbiItem } from 'viem'

/* Import blockchain clients. */
import { baseClient } from '../clients/base.js'
import { degenClient } from '../clients/degen.js'
import { ethClient } from '../clients/eth.js'

/* Import contract ABI. */
import { castPokerAbi } from '../abi/CastPoker.js'

const CAST_POKER_ADDRESS = '0x6a529bE3545ED46fF4eEAD60eA32105D8300a564'

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

    tableInfo = JSON.stringify(tableInfo, (key, value) =>
        typeof value === 'bigint' ? value.toString() + 'n' : value
    )
console.log('TABLE INFO (sanitized)', tableInfo)

    if (logs) {
        return res.json(tableInfo)
    } else {
        return res.json([])
    }
}
