/* Import modules. */
import { encodePrivateKeyWif } from '@nexajs/hdnode'
import { listUnspent } from '@nexajs/address'
import moment from 'moment'
import PouchDB from 'pouchdb'
import { reverseHex } from '@nexajs/utils'
import { sendCoin } from '@nexajs/purse'
import { v4 as uuidv4 } from 'uuid'
import { Wallet } from '@nexajs/wallet'

/* Libauth helpers. */
import {
    instantiateSha256,
} from '@bitauth/libauth'

/* Import handlers. */
// import handleAddress from './handlers/address.js'
// import handleOutpoint from './handlers/outpoint.js'

/* Initialize databases. */
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)
const walletDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/wallet`)

/* Set constants. */
const DUST_LIMIT = 546
const QUEUE_INTERVAL = 5000
const MNEMONIC = process.env.MNEMONIC

/* Initialize locals. */
const queue = {}
let response

console.info('\n  Starting Nexa Games daemon...\n')

/**
 * Handle Queue
 *
 * Process the pending queue of open transactions.
 *
 * NOTE: We handle payment processing in a SINGLE thread,
 *       to mitigate the possibility of a "double send".
 */
const handleQueue = async (_pending) => {
    for (let i = 0; i < _pending.length; i++) {
        const payment = queue[_pending[i]]
        console.log('PAYMENT (pending):', payment)

        /* Remove (payment) from queue. */
        delete queue[_pending[i]]

        const wallet = new Wallet(MNEMONIC)
        // console.log('WALLET', wallet)

        const address = wallet.address
        console.log('TREASURY ADDRESS', address)

        /* Initialize receivers. */
        const receivers = []

        let unspent

        unspent = await listUnspent(address)
        console.log('UNSPENT', unspent)

        /* Initialize SHA-256. */
        const sha256 = await instantiateSha256()

        /* Encode Private Key WIF. */
        const wif = encodePrivateKeyWif(sha256, wallet.privateKey, 'mainnet')
        console.log('PRIVATE KEY (WIF):', wif)

        /* Filter out ANY tokens. */
        // FIXME We should probably do something better than this, lol.
        unspent = unspent.filter(_unspent => {
            return _unspent.value > DUST_LIMIT
        })

        /* Validate unspent outputs. */
        if (unspent.length === 0) {
            return console.error('There are NO unspent outputs available.')
        }

        /* Build parameters. */
        const coins = unspent.map(_unspent => {
            const outpoint = reverseHex(_unspent.outpointHash)
            const satoshis = _unspent.value

            return {
                outpoint,
                satoshis,
                wif,
            }
        })
        console.log('\n  Coins:', coins)



        const userData = 'GAMES~~WALLY DICE~~abc123'
        console.log('USER DATA', userData)

        /* Initialize hex data. */
        let hexData = ''

        /* Convert user data (string) to hex. */
        for (let i = 0; i < userData.length; i++) {
            /* Convert to hex code. */
            let code = userData.charCodeAt(i).toString(16)

            /* Add hex code to string. */
            hexData += code
        }
        console.log('HEX DATA', hexData)

        // TODO Validate data length is less than OP_RETURN max (220).

        /* Add OP_RETURN data. */
        receivers.push({
            data: hexData,
        })

        /* Add value output. */
        receivers.push({
            address: payment.receiver,
            satoshis: -1, // alias for send MAX
        })

        /* Add (change) value output. */
        // receivers.push({
        //     address: address,
        //     satoshis: -1, // alias for send MAX
        // })
        console.log('\n  Receivers:', receivers)

        /* Set automatic fee (handling) flag. */
        const autoFee = true

        /* Send UTXO request. */
        response = await sendCoin(coins, receivers, autoFee)
        console.log('Send UTXO (response):', response)

        try {
            const txResult = JSON.parse(response)
            console.log('TX RESULT', txResult)

            const latest = await walletDb
                .get(payment.id)
                .catch(err => console.err(err))
            console.log('LATEST', latest)

            const updated = {
                ...latest,
                txidem: txResult?.result,
                updatedAt: moment().valueOf(),
            }
            console.log('UPDATED', updated)

            response = await walletDb
                .put(updated)
                .catch(err => console.error(err))
            console.log('UPDATE RESPONSE', response)
        } catch (err) {
            console.error(err)
        }
    }
}

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
    response = await walletDb
        .query('api/isPending', {
            include_docs: true,
        })
        .catch(err => console.error(err))
    console.log('RESPONSE', response)

    /* Validate response. */
    if (response?.rows?.length > 0) {
        rows = response.rows
        console.log('ROWS', rows)
    }

    /* Validate rows. */
    if (rows) {
        rows.forEach(_item => {
            const payment = _item.doc
            // console.log('PAYMENT', payment)

            if (!queue[payment._id]) {
                queue[payment._id] = {
                    id: payment._id,
                    receiver: payment.receiver,
                    satoshis: payment.satoshis,
                    txidem: payment.txidem,
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
        return payment.txidem === null
    })
    console.log('PENDING', pending)

    /* Handle queue. */
    handleQueue(pending)
}


;(async () => {
    setInterval(() => {
        console.log('Managing queue...')
        handleWalletQueue()
    }, QUEUE_INTERVAL)

})()
