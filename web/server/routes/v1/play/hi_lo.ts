/* Import modules. */
import { getAddressBalance } from '@nexajs/rostrum'
import { listUnspent } from '@nexajs/address'
import moment from 'moment'
import PouchDB from 'pouchdb'
import { getHmac } from '@nexajs/crypto'

/* Initialize databases. */
const playsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/plays`)
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)

// TODO Replace with @nexajs/utils
const jsonStringify = (_data, _transform = true) => {
    let data

    data = JSON.stringify(_data, (key, value) =>
        typeof value === 'bigint' ? value.toString() + 'n' : value
    )

    if (!_transform) {
        data = JSON.parse(data)
    }

    return data
}

export default async (_updatedInfo) => {
    // console.log('PLAY HANDLER', _updatedInfo)

    /* Initialize locals. */
    let playAddress
    let playData
    let playHash
    let playSatoshis

    let playerJoy
    let houseJoy

    let response
    let unspent

    /* Set play address. */
    playAddress = _updatedInfo[0]
    // console.log('GAMEPLAY ADDRESS', playAddress)

    // Fetch all unspent transaction outputs for the temporary in-browser wallet.
    unspent = await listUnspent(playAddress)
    // console.log('\n  Unspent outputs:\n', unspent)

    if (unspent.length === 0) {
        // NOTE: Prevent replay.
        return
    }

    playSatoshis = await getAddressBalance(playAddress)
    // console.log('\n  Play balance:\n', playSatoshis)

    if (playSatoshis === 0) {
        // NOTE: Prevent replay.
        return
    }

    response = await playsDb
        .query('api/byAddress', {
            key: playAddress,
            include_docs: true,
        })
        .catch(err => console.error(err))
    // console.log('RESPONSE', response)

    if (response?.rows.length > 0) {
        playData = response.rows[0].doc
        // console.log('PLAY DATA', playData)
    }

    playHash = getHmac(playData.entropy, playData.seed)
    // console.log('PLAY HASH', playHash)

    const playValueHex = playHash.slice(0, 8) // 32-bit value
    // console.log('PLAY VALUE (hex):', playValueHex)

    const playValueNum = parseInt(playValueHex, 16)
    // console.log('PLAY VALUE (number):', playValueNum)

    const MAX_PLAY_VALUE = parseInt('ffffffff', 16) // MAX 32-bit integer value
    // console.log('MAX_PLAY_VALUE', MAX_PLAY_VALUE)

    const playValue = (playValueNum / MAX_PLAY_VALUE) * 100.0
    // console.log('PLAY VALUE', playValue)
    // console.log('PLAY VALUE (formatted):', playValue.toFixed(2))


    /**
     * Calculate (1.2x) Play Outcome
     */
    if (playData.payout === 1.2) {
        if (playValue < 80.8 && playData.position === 0) {
            playerJoy = true
            houseJoy = false
        } else if (playValue > 19.2 && playData.position === 1) {
            playerJoy = true
            houseJoy = false
        } else {
            playerJoy = false
            houseJoy = true
        }
    }

    /**
     * Calculate (2x) Play Outcome
     */
    if (playData.payout === 2) {
        if (playValue < 48.5 && playData.position === 0) {
            playerJoy = true
            houseJoy = false
        } else if (playValue > 51.5 && playData.position === 1) {
            playerJoy = true
            houseJoy = false
        } else {
            playerJoy = false
            houseJoy = true
        }
    }

    /**
     * Calculate (5x) Play Outcome
     */
    if (playData.payout === 5) {
        if (playValue < 17.6 && playData.position === 0) {
            playerJoy = true
            houseJoy = false
        } else if (playValue > 82.4 && playData.position === 1) {
            playerJoy = true
            houseJoy = false
        } else {
            playerJoy = false
            houseJoy = true
        }
    }

    /* Initialize paid flag (used by Wallet daemon). */
    const txidem = null

    /* Build database update. */
    const updated = {
        ...playData,
        unspent: jsonStringify(unspent[0], false),
        satoshis: playSatoshis.confirmed + playSatoshis.unconfirmed,
        outcome: playValue,
        playerJoy,
        houseJoy,
        txidem,
        updatedAt: moment().valueOf()
    }
    console.log('UPDATED', updated)

    response = await playsDb
        .put(updated)
        .catch(err => console.error(err))
    console.log('UPDATED RESPONSE', response)

}
