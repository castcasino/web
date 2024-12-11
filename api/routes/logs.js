/* Import modules. */
import moment from 'moment'
import { parseAbiItem } from 'viem'

/* Import blockchain clients. */
import { baseClient } from '../clients/base.js'
import { degenClient } from '../clients/degen.js'
import { ethClient } from '../clients/eth.js'

/* Import contract ABI. */
import { castPokerAbi } from '../abi/CastPoker.json'
console.log('ABI', castPokerAbi)

const CAST_POKER_ADDRESS = '0x04a3736810D878AED77f5A7aC30B323BAe5b8105'

/**
 * Logs Module
 */
export default async (req, res) => {
    console.log('BODY', req.body)

    /* Initialize locals. */
    let bytecode
    let filter
    let logs

    bytecode = await baseClient.getCode({
        address: CAST_POKER_ADDRESS,
    })
console.log('BYTECODE', bytecode)

    filter = await baseClient.createContractEventFilter({
        abi: castPokerAbi,
    })
console.log('FILTER', filter)

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
