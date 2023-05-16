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

    let queue

    queue = await walletDb.query('api/isPending', {
        include_docs: true,
    })
    .catch(err => console.error(err))
    console.log('QUEUE', queue)

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
