/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { parseAbiItem } from 'viem'

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

// const MIN_PLAY_SATOSHIS = 1000000 // 10,000.00 NEX (~$0.10 as of 2023.5.25)
// NOTE: We add 5% to account for variance in spot price calculation.
// const MAX_PLAY_SATOSHIS = 105000000 // 1,050,000.00 NEX (~$10.50 as of 2023.5.25)

/**
 * Handle (Plays) Queue
 *
 * Process the pending queue of open transactions.
 *
 * NOTE: We handle payment processing in a SINGLE thread,
 *       to mitigate the possibility of a "double send".
 */
export default async () => {
    /* Initialize locals. */
    let idx
    let response
    let totalTables

    /* Request total tables. */
    totalTables = await baseClient.readContract({
        address: CAST_POKER_ADDRESS,
        abi: castPokerAbi,
        functionName: 'getTotalTables',
    })
console.log('TOTAL TABLES (contract)', totalTables)

    idx = await systemDb.get('total_tables')
        .catch(err => console.error(err))
console.log('TOTAL TABLES (db)', idx)

    idx.height = totalTables
    idx.updatedAt = moment().unix()
    // console.log('NEW IDX', idx)

    systemDb
        .put(idx)
        .catch(err => {
            if (err.message !== 'Document update conflict.') {
                console.error(err)
            }
        })

}
