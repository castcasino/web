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
const pokerTablesDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/poker_tables`)
const systemDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/system`)

/* Initialize constants. */
const CAST_POKER_ADDRESS = '0xD54f3183bB58fAe987F2D1752FFc37BaB4DBaA95'

export default async () => {
console.log('MANAGING SHOWDOWN')
    /* Initialize locals. */
    let hostess
    let response
    let seated
    let unseated

//     const blk = await systemDb
//         .get('blk_table_created')
//         .catch(err => console.error(err))
// console.log('BLOCK', blk)

    const logs = await baseClient.getContractEvents({
        address: '0xD54f3183bB58fAe987F2D1752FFc37BaB4DBaA95',
        abi: castPokerAbi,
        eventName: 'TableCreated',
        fromBlock: 0n,
    //  fromBlock: 23802731n,
    //    toBlock: 23992520n
    })
console.log('CONTRACT EVENTS', logs)
return


    response = await pokerTablesDb
        .query('api/unseated', {
            include_docs: true,
        })
        .catch(err => console.error(err))
// console.log('RESPONSE (unseated tables)', response)

    /* Validate response. */
    if (!response || response.total_rows === 0) {
        return console.log('  All tables are seated!')
    }

    /* Set unseated. */
    unseated = response.rows.map((_unset) => {
        return _unset.doc
    })
// console.log('UNSEATED', unseated)

    /* Assign hostess. */
    hostess = unseated[0]

    /* Validate hostess. */
    if (hostess) {
        seated = await baseClient.readContract({
            address: CAST_POKER_ADDRESS,
            abi: castPokerAbi,
            functionName: 'getSeated',
            args: [BigInt(hostess._id)]
        })
// console.log('SEATED', seated)

    }

}
