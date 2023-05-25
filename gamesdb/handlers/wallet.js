/* Import modules. */
import PouchDB from 'pouchdb'

/* Initialize databases. */
const walletDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/wallet`)

/**
 * Handle (Wallet) Queue
 *
 * Process the pending queue of open transactions.
 *
 * NOTE: We handle payment processing in a SINGLE thread,
 *       to mitigate the possibility of a "double send".
 */
export default async (_queue, _pending) => {
    let response
    
    for (let i = 0; i < _pending.length; i++) {
        const payment = _queue[_pending[i]]
        console.log('PAYMENT (pending):', payment)

        /* Remove (payment) from queue. */
        delete _queue[_pending[i]]

        const wallet = new Wallet(MNEMONIC)
        // console.log('WALLET', wallet)

        const address = wallet.address
        // console.log('TREASURY ADDRESS', address)

        /* Initialize receivers. */
        const receivers = []

        let unspent

        unspent = await listUnspent(address)
        // console.log('UNSPENT', unspent)

        /* Initialize SHA-256. */
        const sha256 = await instantiateSha256()

        /* Encode Private Key WIF. */
        const wif = encodePrivateKeyWif(sha256, wallet.privateKey, 'mainnet')
        // console.log('PRIVATE KEY (WIF):', wif)

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
        // console.log('\n  Coins:', coins)

        /* Calculate the total balance of the unspent outputs. */
        const unspentSatoshis = unspent
            .reduce(
                (totalValue, unspentOutput) => (totalValue + unspentOutput.value), 0
            )
        // console.log('UNSPENT SATOSHIS', unspentSatoshis)

        const chainData = `NEXA.games~${payment.playid}`
        // console.log('BLOCKCHAIN DATA', chainData)

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
        console.log('HEX DATA', hexData)

        // TODO Validate data length is less than OP_RETURN max (220).

        /* Add OP_RETURN data. */
        receivers.push({
            data: hexData,
        })

        /* Add value output. */
        for (let j = 0; j < payment.receivers.length; j++) {
            receivers.push({
                address: payment.receivers[j],
                satoshis: payment.satoshis[j],
            })
        }

        /* Handle (automatic) change. */
        if (unspentSatoshis - payment.satoshis - FIXED_GAS_FEE > 546) {
            receivers.push({
                address: address,
                satoshis: unspentSatoshis - payment.satoshis - FIXED_GAS_FEE,
            })
        }
        console.log('\n  Receivers:', receivers)

        /* Set automatic fee (handling) flag. */
        const autoFee = false

        /* Send UTXO request. */
        response = await sendCoin(coins, receivers, autoFee)
        console.log('Send UTXO (response):', response)

        try {
            const txResult = JSON.parse(response)
            console.log('TX RESULT', txResult)

            /* Validate transaction result. */
            if (txResult?.result) {
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
            }
        } catch (err) {
            console.error(err)
        }
    }
}
