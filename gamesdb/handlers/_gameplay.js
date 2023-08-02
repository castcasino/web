    /* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { Wallet } from '@nexajs/wallet'

/* Initialize databases. */
const playsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/plays`)
const walletDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/wallet`)

const GAME_ENGINE_FEE = 0.5 // as a percentage (eg. 1/2%)
const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS

const VAULT_MNEMONIC = process.env.MNEMONIC

/* Initialize wallet. */
const vaultWallet = new Wallet(VAULT_MNEMONIC)

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

export default async (_game, _play, _sender) => {

    const receivers = []

    let address
    let take
    let rate
    let latestDb
    let updatedDb
    let response
    let satoshis
    let share

    latestDb = await playsDb
        .get(_play._id)
        .catch(err => console.err(err))
    // console.log('LATEST (play)', latestDb)

    updatedDb = {
        ...latestDb,
        txidem: 'INQUEUE',
        updatedAt: moment().valueOf(),
        updatedBy: 'GAMEPLAY',
    }
    // console.log('UPDATED (play)', updatedDb)

    response = await playsDb
        .put(updatedDb)
        .catch(err => console.error(err))
    // console.log('UPDATE (play) RESPONSE', response)

    if (_play.playerJoy === true) {
        /* Send Sender (total) winnings. */
        address = _sender.address

        satoshis = BigInt(parseInt(_play.satoshis * _play.payout))

        receivers.push({
            address,
            satoshis,
        })

        /* Set change address. */
        address = vaultWallet.address

        /* Set change receiver. */
        receivers.push({
            address,
        })
    } else {
        /* Send player (DUST). */
        // NOTE: Blocking DUST transactions to prevent accidental "token" sends.
        address = _sender.address
        satoshis = BigInt(888) // GOOD LUCK!
        receivers.push({
            address,
            satoshis,
        })

        /* Send gamemakers (share) winnings. */
        address = TREASURY_ADDRESS
        rate = GAME_ENGINE_FEE / 100.0
        // console.log('GAME ENGINE RATE', rate)
        satoshis = BigInt(parseInt(_play.satoshis * rate))
        // console.log('GAME ENGINE SATS', satoshis)
        receivers.push({
            address,
            satoshis,
        })

        /* Send gamemakers (share) winnings. */
        address = _game.gamemakers.members[0]
        share = _game.gamemakers.share
        // console.log('GAMEMAKERS SHARE', share)
        rate = (100 - _game.rtp - GAME_ENGINE_FEE) / 100.0
        // console.log('HOUSE RATE', rate)
        take = (_play.satoshis * rate)
        // console.log('HOUSE TAKE', take)
        satoshis = BigInt(parseInt(take * (share * 0.01)))
        // console.log('GAMEMAKERS SATS', satoshis)
        receivers.push({
            address,
            satoshis,
        })

        /* Send promoters (share) winnings. */
        address = _game.promoters.members[0]
        share = _game.promoters.share
        // console.log('PROMOTERS SHARE', share)
        rate = (100 - _game.rtp - GAME_ENGINE_FEE) / 100.0
        // console.log('HOUSE RATE', rate)
        take = (_play.satoshis * rate)
        // console.log('HOUSE TAKE', take)
        satoshis = BigInt(parseInt(take * (share * 0.01)))
        // console.log('PROMOTERS SATS', satoshis)
        receivers.push({
            address,
            satoshis,
        })

        /* Set change address. */
        address = vaultWallet.address

        /* Set change receiver. */
        receivers.push({
            address,
        })
    }

    const walletPkg = {
        _id: _play._id,
        entropy: _play.entropy,
        unspent: _play.unspent,
        receivers: jsonStringify(receivers, false),
        txidem: null,
        createdAt: moment().valueOf(),
    }

    response = await walletDb
        .put(walletPkg)
        .catch(err => console.error(err))
    // console.log('RESPONSE (wallet):', response)

    return response
}
