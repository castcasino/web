/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'

/* Import blockchain clients. */
import { baseClient } from '../clients/baseInfura.js'
import { degenClient } from '../clients/degen.js'
import { ethClient } from '../clients/eth.js'

/* Import contract ABI. */
import castPokerAbi from '../abi/CastPoker.js'

import _addNewTable from './_addNewTable.js'

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
    let idxCommunity
    let idxTables
    let response
    let totalTables

// TODO
    // const currentBlkHeight = ...

    const blk = await systemDb
        .get('blk_table_created')
        .catch(err => console.error(err))
// console.log('BLOCK', blk)

    if (typeof blk === 'undefined') {
        throw new Error('ERROR: System database failed!')
    }

    const tableLogs = await baseClient.getContractEvents({
        address: '0xD54f3183bB58fAe987F2D1752FFc37BaB4DBaA95',
        abi: castPokerAbi,
        eventName: 'TableCreated',
        fromBlock: BigInt(blk.height),
        // toBlock: BigInt(currentBlkHeight),
    }).catch(err => console.error(err))
// console.log('TABLE LOGS', tableLogs)


    /* Request total tables. */
    totalTables = await baseClient.readContract({
        address: CAST_POKER_ADDRESS,
        abi: castPokerAbi,
        functionName: 'getTotalTables',
    }).catch(err => console.error(err))
// console.log('TOTAL TABLES (contract)', totalTables)

    idxTables = await systemDb.get('idx_tables')
        .catch(err => console.error(err))
// console.log('INDEX TABLES (db)', idxTables)

    /* Validate height. */
    if (idxTables.height === Number(totalTables)) {
        console.log('  Tables index is already up-to-date.')
    } else {
        idxTables.height = Number(totalTables) // cast from BigInt
        idxTables.updatedAt = moment().unix()
        // console.log('NEW IDX', idxTables)

        idxCommunity = await systemDb
            .get('idx_community')
            .catch(err => console.error(err))
// console.log('INDEX COMMUNITY (db)', idxCommunity)

        /* Check community. */
        if (idxCommunity.height < idxTables.height) {
            await _addNewTable(idxCommunity)
        }

        await systemDb
            .put(idxTables)
            .catch(err => {
                if (err.message !== 'Document update conflict.') {
                    console.error(err)
                }
            })

        /* Send (Admin) notification. */
        fetch('https://cast.casino/v1/admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: 'notify',
                pkg: idxTables,
            }),
        })
    }
}
