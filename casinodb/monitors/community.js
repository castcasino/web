/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'

/* Import blockchain clients. */
import { baseClient } from '../clients/base.js'
import { degenClient } from '../clients/degen.js'
import { ethClient } from '../clients/eth.js'

/* Import contract ABI. */
import castPokerAbi from '../abi/CastPoker.js'

import _getCommunityHashes from './_getCommunityHashes.js'

/* Import deck manager (utils). */
import {
    fullDeck,
    idxLookup,
    dealCards,
} from '../libs/dealer.js'

/* Initialize databases. */
const blocksBaseDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/blocks_base`)
const pokerTablesDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/poker_tables`)

/* Initialize constants. */
const CAST_POKER_ADDRESS = '0xD54f3183bB58fAe987F2D1752FFc37BaB4DBaA95'

export default async () => {
// console.log('MANAGING COMMUNITY')

    /* Initialize locals. */
    let activeDeck
    let communityHashes
    let communityPkg
    let dealer
    let response
    let selected
    let unset

    response = await pokerTablesDb
        .query('api/unsetTables', {
            include_docs: true,
        }).catch(err => console.error(err))
// console.log('RESPONSE (unset tables)', response)

    /* Validate response. */
    if (!response || response.total_rows === 0) {
        return console.log('  All tables are set!')
    }

    /* Set unset. */
    unset = response.rows.map((_unset) => {
        return _unset.doc
    })
console.log('UNSET', unset)

    /* Validate unset. */
    if (unset && unset.length > 0) {
        dealer = unset[0]
console.log('DEALER', dealer)

        activeDeck = fullDeck()
// console.log('(FULL) DECK', activeDeck.length, activeDeck)

        /* Initialize selected handler. */
        selected = []

        /* Request community hashes. */
        communityHashes = await _getCommunityHashes()
console.log('COMMUNITY HASHES', communityHashes)

        selected.push(dealCards(
            activeDeck, communityHashes[0].hash.slice(2), 1))
        selected.push(dealCards(
            activeDeck, communityHashes[1].hash.slice(2), 1))
        selected.push(dealCards(
            activeDeck, communityHashes[2].hash.slice(2), 1))
        selected.push(dealCards(
            activeDeck, communityHashes[3].hash.slice(2), 1))
        selected.push(dealCards(
            activeDeck, communityHashes[4].hash.slice(2), 1))

        communityPkg = {
            flop1: {
                card: selected[0][0],
                cardIdx: idxLookup(selected[0][0]),
                blockIdx: communityHashes[0]._id,
                blockHash: communityHashes[0].hash
            },
            flop2: {
                card: selected[1][0],
                cardIdx: idxLookup(selected[1][0]),
                blockIdx: communityHashes[1]._id,
                blockHash: communityHashes[1].hash
            },
            flop3: {
                card: selected[2][0],
                cardIdx: idxLookup(selected[2][0]),
                blockIdx: communityHashes[2]._id,
                blockHash: communityHashes[2].hash
            },
            turn: {
                card: selected[3][0],
                cardIdx: idxLookup(selected[3][0]),
                blockIdx: communityHashes[3]._id,
                blockHash: communityHashes[3].hash
            },
            river: {
                card: selected[4][0],
                cardIdx: idxLookup(selected[4][0]),
                blockIdx: communityHashes[4]._id,
                blockHash: communityHashes[4].hash
            }
        }
console.log('COMMUNITY PACKAGE', communityPkg)
console.log('ACTIVE DECK (original)', activeDeck.length, activeDeck)

        /* Update dealer. */
        dealer.community = communityPkg
        dealer.updatedAt = moment().unix()

        response = await pokerTablesDb
            .put(dealer)
            .catch(err => console.error(err))
console.log('RESPONSE (dealer)', response)
    }
}
