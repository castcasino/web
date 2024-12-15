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
    indexLookup,
    selectCards,
} from '../libs/deckManager.js'

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
        })
        .catch(err => console.error(err))
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

        communityHashes = await _getCommunityHashes()
console.log('COMMUNITY HASHES', communityHashes)

        communityPkg = {
            flop1: {
                cardIdx: 1,
                blockIdx: communityHashes[0]._id,
                blockHash: communityHashes[0].hash
            },
            flop2: {
                cardIdx: 3,
                blockIdx: communityHashes[1]._id,
                blockHash: communityHashes[1].hash
            },
            flop3: {
                cardIdx: 5,
                blockIdx: communityHashes[2]._id,
                blockHash: communityHashes[2].hash
            },
            turn: {
                cardIdx: 7,
                blockIdx: communityHashes[3]._id,
                blockHash: communityHashes[3].hash
            },
            river: {
                cardIdx: 9,
                blockIdx: communityHashes[4]._id,
                blockHash: communityHashes[4].hash
            }
        }
console.log('COMMUNITY PACKAGE', communityPkg)


        activeDeck = fullDeck()
// console.log('(FULL) DECK', activeDeck.length, activeDeck)

        selected = selectCards(
            activeDeck,
            '13bdbadaeb217c08069c2821f5183d2ada5e4fdb158133ecda0c338f04633f34',
            1,
        )
console.log('SELECTED CARD-1', selected, indexLookup(selected[0]))
// console.log('ACTIVE DECK (original)-1', activeDeck.length, activeDeck)

        selected = selectCards(
            activeDeck,
            '13bdbadaeb217c08069c2821f5183d2ada5e4fdb158133ecda0c338f04633f34',
            2,
        )
console.log('SELECTED CARD-2', selected, indexLookup(selected[0]), indexLookup(selected[1]))
// console.log('ACTIVE DECK (original)-2', activeDeck.length, activeDeck)
    }
}
