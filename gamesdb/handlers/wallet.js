/* Import modules. */
import { encodePrivateKeyWif } from '@nexajs/hdnode'
import { hexToBin } from '@nexajs/utils'
import { listUnspent } from '@nexajs/address'
import moment from 'moment'
import PouchDB from 'pouchdb'
import { sendCoin } from '@nexajs/purse'
import { sha256 } from '@nexajs/crypto'
import { Wallet } from '@nexajs/wallet'

/* Initialize databases. */
const playsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/plays`)
const walletDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/wallet`)

/* Set constants. */
const DUST_LIMIT = BigInt(546)
const ESTIMATED_NUM_OUTPUTS = 5

/* Initialize spent coins. */
const spentCoins = []

/**
 * Handle (Wallet) Queue
 *
 * Process the pending queue of open transactions.
 *
 * NOTE: We handle payment processing in a SINGLE thread,
 *       to mitigate the possibility of a "double send".
 */
export default async (_queue, _pending) => {
    let latestDb
    let response
    let txResult
    let updatedDb
    let unspent
    let wif

    for (let i = 0; i < _pending.length; i++) {
        const payment = _queue[_pending[i]]
        // console.log('PAYMENT (pending):', payment)

        /* Remove (payment) from queue. */
        delete _queue[_pending[i]]

        const paymentSatoshis = payment.receivers
            .reduce(
                (totalValue, receiver) => (totalValue + receiver.satoshis), BigInt(0)
            )
        // console.log('PAYMENT SATOSHIS', paymentSatoshis)

        const wallet = new Wallet(process.env.MNEMONIC)
        // console.log('WALLET', wallet)

        const address = wallet.address
        // console.log('TREASURY ADDRESS', address)

        /* Initialize receivers. */
        const receivers = []

        unspent = await listUnspent(address)
        // console.log('UNSPENT', unspent)

        /* Encode Private Key WIF. */
        wif = encodePrivateKeyWif({ hash: sha256 }, wallet.privateKey, 'mainnet')
        // console.log('PRIVATE KEY (WIF):', wif)

        /* Filter out ANY tokens. */
        // FIXME We should probably do something better than this, lol.
        // unspent = unspent.filter(_unspent => {
        //     return _unspent.satoshis > DUST_LIMIT
        // })
        /* Filter out ANY tokens & spent. */
        // FIXME We should probably do something better than this, lol.
        // unspent = unspent.filter(_unspent => {
        //     /* Initialize flag. */
        //     let isValid = true
        //
        //     if (_unspent.satoshis <= DUST_LIMIT) {
        //         /* Set flag. */
        //         isValid = false
        //     }
        //
        //     if (spentCoins.includes(_unspent.outpoint)) {
        //         /* Set flag. */
        //         isValid = false
        //     }
        //
        //     /* Return flag. */
        //     return isValid
        // })

        /* Validate unspent outputs. */
        if (unspent.length === 0) {
            return console.error('There are NO unspent outputs available.')
        }

        /* Build parameters. */
        const coins = unspent.map(_unspent => {
            const outpoint = _unspent.outpoint
            const satoshis = _unspent.satoshis

            return {
                outpoint,
                satoshis,
                wif,
            }
        })
        // console.log('\n  Coins-1:', coins)

        const wallet2 = new Wallet(payment.entropy)
        // console.log('WALLET-2', wallet2)

        const address2 = wallet2.address
        // console.log('TREASURY ADDRESS-2', address2)

        const pk2 = wallet2.privateKey
        // console.log('PRIVATE KEY-2', pk2)

        const playerCoin = {
            outpoint: payment.unspent.outpoint,
            satoshis: payment.unspent.satoshis,
            wif: encodePrivateKeyWif({ hash: sha256 }, pk2, 'mainnet'),
        }
        coins.unshift(playerCoin)
        // console.log('\n  Coins-2:', coins)

        /* Calculate the total balance of the unspent outputs. */
        const unspentSatoshis = coins
            .reduce(
                (totalValue, coin) => (totalValue + coin.satoshis), BigInt(0)
            )
        // console.log('UNSPENT SATOSHIS', unspentSatoshis)

        const chainData = `NEXA.games~${payment.id}`
        // console.log('BLOCKCHAIN DATA', chainData)

        // NOTE: 150b (per input), 35b (per output), 10b (misc)
        // NOTE: Double the estimate (for safety).
        // const feeEstimate = ((coins.length * 150) + (35 * ESTIMATED_NUM_OUTPUTS) + 10 + (chainData.length / 2)) * 2
        // console.log('FEE ESTIMATE', feeEstimate)

        /* Initialize hex data. */
        let hexData = ''

        /* Convert user data (string) to hex. */
        for (let j = 0; j < chainData.length; j++) {
            /* Convert to hex code. */
            let code = chainData.charCodeAt(j).toString(16)

            if (chainData[j] === '~') {
                code = '09'
            }

            /* Add hex code to string. */
            hexData += code
        }
        // console.log('HEX DATA', hexData)

        // TODO Validate data length is less than OP_RETURN max (220).

        /* Add OP_RETURN data. */
        receivers.push({
            data: hexData,
        })

        /* Add value output. */
        for (let j = 0; j < payment.receivers.length; j++) {
            if (payment.receivers[j].satoshis > DUST_LIMIT) {
                receivers.push({
                    address: payment.receivers[j].address,
                    satoshis: payment.receivers[j].satoshis,
                })
            }
        }
        return console.log('\n  Receivers:', receivers)

        /* Send UTXO request. */
        response = await sendCoin(coins, receivers)
        console.log('Send UTXO (response):', response)

        try {
            txResult = JSON.parse(response)
            console.log('TX RESULT', txResult)

            /* Validate transaction result. */
            if (txResult?.result) {
                /* Manage coins. */
                // coins.forEach(_coin => {
                //     /* Add hash to spent. */
                //     spentCoins.push(_coin.outpoint)
                //
                //     // TODO Add check for MAX spent (eg. 100).
                // })

                latestDb = await walletDb
                    .get(payment.id)
                    .catch(err => console.err(err))
                // console.log('LATEST (wallet)', latestDb)

                updatedDb = {
                    ...latestDb,
                    txidem: txResult?.result,
                    updatedAt: moment().valueOf(),
                }
                // console.log('UPDATED (wallet)', updatedDb)

                response = await walletDb
                    .put(updatedDb)
                    .catch(err => console.error(err))
                // console.log('UPDATE (wallet) RESPONSE', response)

                latestDb = await playsDb
                    .get(payment.id)
                    .catch(err => console.err(err))
                // console.log('LATEST (plays)', latestDb)

                updatedDb = {
                    ...latestDb,
                    txidem: txResult?.result,
                    updatedAt: moment().valueOf(),
                    updatedBy: 'WALLET',
                }
                // console.log('UPDATED (plays)', updatedDb)

                response = await playsDb
                    .put(updatedDb)
                    .catch(err => console.error(err))
                // console.log('UPDATE (plays) RESPONSE', response)
            }

            // TODO SEND EMAIL ERROR
            // txResult?.error
            // txResult?.result
        } catch (err) {
            console.error(err)
        }
    }
}
