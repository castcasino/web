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
    let seated
    let tableInfo

    seated = []

    tableInfo = await baseClient.readContract({
        address: CAST_POKER_ADDRESS,
        abi: castPokerAbi,
        functionName: 'tables',
        args: [_tableid]
    })
console.log('TABLE INFO (raw)', tableInfo)

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
console.log('TABLE INFO (parsed)', tableInfo)

    return true
}
