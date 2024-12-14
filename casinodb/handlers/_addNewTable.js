/* Import blockchain clients. */
import { baseClient } from '../clients/base.js'
import { degenClient } from '../clients/degen.js'
import { ethClient } from '../clients/eth.js'

/* Import contract ABI. */
import castPokerAbi from '../abi/CastPoker.js'

/* Initialize constants. */
const CAST_POKER_ADDRESS = '0xD54f3183bB58fAe987F2D1752FFc37BaB4DBaA95'

export default async (_tableid) => {
console.log('ADDING NEW TABLE', _tableid)

    /* Initialize locals. */
    let tableInfo

    tableInfo = await baseClient.readContract({
        address: CAST_POKER_ADDRESS,
        abi: castPokerAbi,
        functionName: 'tables',
        args: [_tableid]
    })
console.log('TABLE INFO', tableInfo)

    return true
}
