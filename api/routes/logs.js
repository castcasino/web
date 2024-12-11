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
    let bytecode
    let data
    let filter
    let logs

    filter = await baseClient.createContractEventFilter({
        abi: castPokerAbi,
    })
// console.log('FILTER', filter)

    data = await baseClient.readContract({
        address: CAST_POKER_ADDRESS,
        abi: castPokerAbi,
        functionName: 'getTotalTables',
    })
console.log('DATA', data)

    // logs = await baseClient.getLogs({
    logs = await baseClient.getContractEvents({
        abi: castPokerAbi,
        address: CAST_POKER_ADDRESS,
        // address: [
        //     CAST_POKER_ADDRESS,
        // ],
        // event: parseAbiItem('event TableCreated(uint indexed tableid, Table table)'),
        // event: 'TableCreated',
        // args: {
        //     from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
        //     to: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac'
        // },
        // fromBlock: 16330000n,
        // toBlock: 16330050n
    }).catch(err => console.error(err))
console.log('LOGS', logs)

    if (logs) {
        return res.json(logs)
    } else {
        return res.json([])
    }
}
