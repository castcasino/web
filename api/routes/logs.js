/* Import modules. */
import moment from 'moment'

/* Import blockchain clients. */
import { baseClient } from '../clients/base.js'
import { degenClient } from '../clients/degen.js'
import { ethClient } from '../clients/eth.js'

/**
 * Logs Module
 */
export default async (req, res) => {
    console.log('BODY', req.body)

    const logs = await ethClient.getLogs({
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        event: 'Transfer',
        args: {
            from: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
            to: '0xa5cc3c03994db5b0d9a5eedd10cabab0813678ac'
        },
        fromBlock: 16330000n,
        toBlock: 16330050n
    })
console.log('LOGS', logs)

    return res.json(logs)
}
