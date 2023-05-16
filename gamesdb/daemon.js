/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'
import { Wallet } from '@nexajs/wallet'

/* Import handlers. */
// import handleAddress from './handlers/address.js'
// import handleOutpoint from './handlers/outpoint.js'

/* Initialize databases. */
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)
const walletDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/wallet`)

/* Initialize locals. */
const queue = {}
let response

console.info('\n  Starting Nexa Games daemon...\n')


/**
 * Wallet Queue
 *
 * Performs a check to make sure we have transacted all pending
 * transactions queued in the wallet.
 */
const handleWalletQueue = async () => {
    console.info('\n  Checking wallet queue...\n')

    let response
    let rows

    /* Request pending transactions. */
    response = await walletDb.query('api/isPending', {
        include_docs: true,
    })
    .catch(err => console.error(err))
    // console.log('RESPONSE', response)

    /* Validate response. */
    if (response?.rows?.length > 0) {
        rows = response.rows
        console.log('QUEUE', rows)
    }

    /* Validate rows. */
    if (rows) {
        rows.forEach(_item => {
            const payment = _item.doc
            console.log('PAYMENT', payment)

            if (!queue[payment._id]) {
                queue[payment._id] = {
                    receiver: payment.receiver,
                    satoshis: payment.satoshis,
                    txid: payment.txid,
                    createdAt: payment.createdAt,
                }
            }
        })
    }
    console.log('QUEUE', queue)

    const pending = Object.keys(queue).filter(_paymentid => {
        /* Set payment. */
        const payment = queue[_paymentid]

        /* Return unprocessed .*/
        return payment.txid === null
    })
    console.log('PENDING', pending)

}

const handleQueue = async () => {

}

;(async () => {
    setInterval(() => {
        console.log('Managing queue...')
        handleWalletQueue()
    }, 5000)

})()

// handleWalletQueue()
