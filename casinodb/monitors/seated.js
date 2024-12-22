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
const FREE_API_DELAY = 3000

const sleep = ms => new Promise(r => setTimeout(r, ms))

export default async () => {
// console.log('MANAGING UNSEATED')

    /* Initialize locals. */
    let hostess
    let response
    let seated
    let unseated

    response = await pokerTablesDb
        .query('api/seated', {
            include_docs: true,
        }).catch(err => console.error(err))
// console.log('RESPONSE (seated players)', response)

    /* Validate response. */
    if (!response || response.total_rows === 0) {
        return console.log('  All tables are seated!')
    }

    /* Set unseated. */
    unseated = response.rows.map((_unset) => {
        return _unset.doc
    })
// console.log('UNSEATED', unseated)

    for (let i = 0; i < unseated.length; i++) {
        /* Assign hostess. */
        hostess = unseated[i]
// console.log('HOSTESS', hostess)

        /* Pause before reading from "FREE" API. */
        sleep(FREE_API_DELAY)

        seated = await baseClient.readContract({
            address: CAST_POKER_ADDRESS,
            abi: castPokerAbi,
            functionName: 'getSeated',
            args: [BigInt(hostess._id)]
        }).catch(err => console.error(err))
// console.log('SEATED', seated)

        if (seated.length > hostess.seated.length) {
// console.log('\n  ***HOSTESS! WE GOTTA UPDATE***\n')

            /* Update hostess. */
            hostess.seated = seated
            hostess.updatedAt = moment().unix()

            /* Save hostess. */
            pokerTablesDb
                .put(hostess)
                .catch(err => console.error(err))

            /* Send (Admin) notification. */
            fetch('https://cast.casino/v1/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    method: 'notify',
                    pkg: hostess,
                }),
            })
        }
    }
}
