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
    let pitBoss
    let pot
    let registered // i.e. on-chain table
    let response
    let tables

    response = await pokerTablesDb
        .query('api/byState', {
            key: 2, // Community (betting is allowed)
            include_docs: true,
        })
        .catch(err => console.error(err))
console.log('RESPONSE (community)', response)

    /* Validate response. */
    if (!response || response.total_rows === 0) {
        return console.log('  NO tables are ACTIVE in the community!')
    }

    /* Set tables. */
    tables = response.rows.map((_unset) => {
        return _unset.doc
    })
console.log('TABLES', tables)

    for (let i = 0; i < tables.length; i++) {
        /* Assign pit boss. */
        pitBoss = tables[i]
console.log('PIT BOSS', pitBoss)

        /* Pause before reading from "FREE" API. */
        sleep(FREE_API_DELAY)

        registered = await baseClient.readContract({
            address: CAST_POKER_ADDRESS,
            abi: castPokerAbi,
            functionName: 'tables',
            args: [BigInt(pitBoss._id)]
        })
console.log('REGISTERED', registered)

        /* Set pot. */
        pot = registered[6]
console.log('POT', pot)

        if (pot > BigInt(pitBoss.pot)) {
console.log('\n  ***PIT BOSS! WE GOTTA UPDATE***\n')

            /* Update pit boss. */
            pitBoss.pot = registered.pot.toString()
            pitBoss.updatedAt = moment().unix()

            /* Save pit boss. */
            pokerTablesDb
                .put(pitBoss)
                .catch(err => console.error(err))

            /* Send (Admin) notification. */
            fetch('https://cast.casino/v1/admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    method: 'notify',
                    pkg: pitBoss,
                }),
            })
        }
    }
}
