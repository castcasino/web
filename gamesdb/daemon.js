/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

/* Libauth helpers. */
import {
    instantiateSha256,
} from '@bitauth/libauth'

/* Import handlers. */
import handlePlays from './handlers/plays.js'
import handleWallet from './handlers/wallet.js'

/* Initialize databases. */
const errorsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/errors`)
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)
const playsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/plays`)
const walletDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/wallet`)

/* Set constants. */
const PLAYS_INTERVAL = 5000
const WALLET_INTERVAL = 15000

/* Initialize locals. */
const playQueue = {}
const walletQueue = {}

let playResponse
let walletResponse

console.info('\n  Starting Nexa Games daemon...\n')


/**
 * Plays Queue
 *
 * Performs a check to validate ALL (unpaid) plays and
 * calculate payouts for entry to the Wallet.
 */
const handlePlaysQueue = async () => {
    console.info('\n  Checking Plays queue...\n')

    let response
    let rows

    /* Request pending transactions. */
    response = await playsDb
        .query('api/isUnpaid', {
            include_docs: true,
        })
        .catch(err => console.error(err))
    // console.log('RESPONSE', response)

    /* Validate response. */
    if (response?.rows?.length > 0) {
        rows = response.rows
        // console.log('ROWS', rows)
    }

    /* Validate rows. */
    if (rows) {
        rows.forEach(_item => {
            const play = _item.doc
            // console.log('PLAY', play)

            if (!playQueue[play._id]) {
                playQueue[play._id] = play
            }
        })
    }
    // console.log('PLAY QUEUE', playQueue)

    const pending = Object.keys(playQueue).filter(_playid => {
        /* Set play. */
        const play = playQueue[_playid]

        /* Return unprocessed .*/
        return play.txidem === null
    })
    // console.log('PENDING', pending)

    /* Handle queue. */
    handlePlays(playQueue, pending)
}


/**
 * Wallet Queue
 *
 * Performs a check to make sure we have transacted all pending
 * transactions queued in the wallet.
 */
const handleWalletQueue = async () => {
    console.info('\n  Checking Wallet queue...\n')

    let response
    let rows

    /* Request pending transactions. */
    response = await walletDb
        .query('api/isPending', {
            include_docs: true,
        })
        .catch(err => console.error(err))
    // console.log('RESPONSE', response)

    /* Validate response. */
    if (response?.rows?.length > 0) {
        rows = response.rows
        // console.log('ROWS', rows)
    }

    /* Validate rows. */
    if (rows) {
        rows.forEach(_item => {
            const payment = _item.doc
            console.log('PAYMENT', payment)

            if (!walletQueue[payment._id]) {
                walletQueue[payment._id] = {
                    id: payment._id,
                    entropy: payment.entropy,
                    unspent: payment.unspent,
                    receivers: payment.receivers,
                    txidem: payment.txidem,
                    createdAt: payment.createdAt,
                }
            }
        })
    }
    console.log('WALLET QUEUE', walletQueue)

    const pending = Object.keys(walletQueue).filter(_paymentid => {
        /* Set payment. */
        const payment = walletQueue[_paymentid]

        /* Return unprocessed .*/
        return payment.txidem === null
    })
    console.log('PENDING', pending)

    /* Handle queue. */
    handleWallet(walletQueue, pending)
}


;(async () => {
// handlePlaysQueue()
// handleWalletQueue()
return
    setInterval(() => {
        console.log('Managing Plays queue...')
        handlePlaysQueue()
    }, PLAYS_INTERVAL)

    setInterval(() => {
        console.log('Managing Wallet queue...')
        handleWalletQueue()
    }, WALLET_INTERVAL)

})()
