/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'

import gameplay from './_gameplay.js'
import getSender from './_getSender.js'

/* Initialize databases. */
const gamesDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/games`)
const playsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/plays`)

const MIN_PLAY_SATOSHIS = 1000000 // 10,000.00 NEX (~$0.10 as of 2023.5.25)
// NOTE: We add 5% to account for variance in spot price calculation.
const MAX_PLAY_SATOSHIS = 105000000 // 1,050,000.00 NEX (~$10.50 as of 2023.5.25)


/**
 * Handle (Plays) Queue
 *
 * Process the pending queue of open transactions.
 *
 * NOTE: We handle payment processing in a SINGLE thread,
 *       to mitigate the possibility of a "double send".
 */
export default async (_queue, _pending) => {
    let response

    for (let i = 0; i < _pending.length; i++) {
        const play = _queue[_pending[i]]
        // console.log('PLAY (pending):', (i + 1), 'of', (_pending.length + 1), play)

        /* Remove (payment) from queue. */
        // FIXME DON'T DELETE! MARK AS USED, THEN CHECK!
        delete _queue[_pending[i]]

        const game = await gamesDb
            .get(play.gameid)
            .catch(err => console.error(err))
        // console.log('GAME', game)

        /* Set satoshis. */
        const satoshis = play.satoshis
        // console.log('SATOSHIS', satoshis)

        // FIXME ERROR IN QUEUE LOGIC CAUSING BAD DB
        if (satoshis === 0) continue

        /* Validate satoshis. */
        if (satoshis < MIN_PLAY_SATOSHIS) {
            play.txidem = 'DUST'
            play.updatedAt = moment().valueOf()

            response = await playsDb
                .put(play)
                .catch(err => console.error(err))
            // console.log('RESPONSE', response)

            continue
        }

        /* Validate satoshis. */
        if (satoshis > MAX_PLAY_SATOSHIS) {
            play.txidem = 'OVER_LIMIT'
            play.updatedAt = moment().valueOf()

            response = await playsDb
                .put(play)
                .catch(err => console.error(err))
            // console.log('RESPONSE', response)

            continue
        }

        /* Request player. */
        const sender = await getSender(play.unspent)
        // console.log('SENDER', sender)

        /* Handle gameplay. */
        await gameplay(game, play, sender)
    }
}
