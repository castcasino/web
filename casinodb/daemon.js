/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

/* Import handlers. */
import handlePlays from './handlers/plays.js'
import handleWallet from './handlers/wallet.js'

/* Import blockchain clients. */
import { baseClient } from './clients/base.js'
import { degenClient } from './clients/degen.js'
import { ethClient } from './clients/eth.js'

/* Initialize databases. */
const errorsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/errors`)
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)
const systemDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/system`)

const blocksBaseDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/blocks_base`)
const blocksDegenDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/blocks_degen`)
const blocksEthDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/blocks_eth`)

/* Set constants. */
const PLAYS_INTERVAL = 5000
const WALLET_INTERVAL = 15000

// TODO Replace with @nexajs/utils
const jsonParse = (_data, _transform = true) => {
    let data

    if (_transform) {
        data = _data
    } else {
        // NOTE: We actually (de-)transform before decoding.
        data = JSON.stringify(_data)
    }

    try {
        return JSON.parse(data, (key, value) => {
            if (typeof value === 'string' && /^\d+n$/.test(value)) {
                return BigInt(value.slice(0, value.length - 1))
            }
            return value
        })
    } catch (err) {
        console.log('JSON PARSE ERROR!');
        console.log('ERROR', err)
    }
}

console.info('\n  Starting Cast Casino daemon...\n')


/**
 * Plays Queue
 *
 * Performs a check to validate ALL (unpaid) plays and
 * calculate payouts for entry to the Wallet.
 */
const handlePlaysQueue = async () => {
    console.info('\n  Checking Plays queue...\n')

    const playQueue = {}

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
        const play = jsonParse(playQueue[_playid], false)
        console.log('PLAY', play);

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

    const walletQueue = {}

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
            const payment = jsonParse(_item.doc, false)
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

const _handleBaseBlock = async (_block) => {
// console.log('NEW BASE BLOCK', _block)

    const pkg = {
        _id: _block.number.toString(),
        hash: _block.hash,
        timestamp: _block.timestamp,
        numTxs: _block.transactions.length,
        createdAt: moment().unix(),
    }
console.log('DB PACKAGE', pkg)

    blocksBaseDb
        .put(pkg)
        .catch(err => console.error(err))

    const idx = await systemDb.get('idx_base')
        .catch(err => console.error(err))
// console.log('IDX', idx)

    idx.height = _block.number.toString()
    idx.updateAt = moment().unix()
console.log('NEW IDX', idx)

    systemDb
        .put(idx)
        .catch(err => console.error(err))
}

;(async () => {
// handlePlaysQueue()
// handleWalletQueue()

const unwatchBase = baseClient
    .watchBlocks({
        emitMissed: true,
        emitOnBegin: true,
        includeTransactions: false,
        onBlock: _handleBaseBlock,
    })
console.log('UNWATCH', unwatchBase)

setTimeout(() => {
    unwatchBase()
    console.log('STOPPED WATCHING!')
}, 60000)

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
