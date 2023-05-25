/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'

/* Initialize databases. */
const playsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/plays`)

const MIN_PLAY_SATOSHIS = 10000 // 100.00 NEX (~$0.001 as of 2023.5.25)

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
        console.log('PLAY (pending):', play)

        /* Remove (payment) from queue. */
        delete _queue[_pending[i]]

        const satoshis = play.satoshis
        console.log('SATOSHIS', satoshis)

        if (satoshis < MIN_PLAY_SATOSHIS) {
            play.txidem = 'DUST'
            play.updatedAt = moment().valueOf()

            response = await playsDb
                .put(play)
                .catch(err => console.error(err))
            console.log('RESPONSE', response);

            continue
        }

        /* Create network data. */
        const engineData = `NEXA.games~${play._id}`
        // console.log('USER DATA', engineData)

        /* Initialize hex data. */
        let hexData = ''

        /* Convert user data (string) to hex. */
        for (let j = 0; j < engineData.length; j++) {
            /* Convert to hex code. */
            let code = engineData.charCodeAt(j).toString(16)

            if (engineData[j] === '~') {
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
