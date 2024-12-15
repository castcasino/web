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

/* Initialize constants. */
const CAST_POKER_ADDRESS = '0xD54f3183bB58fAe987F2D1752FFc37BaB4DBaA95'

export default async () => {
// console.log('MANAGING UNSEATED')

    /* Initialize locals. */
    let response

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
console.log('UNSEATED', unseated)

}
