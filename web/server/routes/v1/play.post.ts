/* Import modules. */
import { binToHex } from '@nexajs/utils'
import { entropyToMnemonic } from '@nexajs/hdnode'
import moment from 'moment'
import PouchDB from 'pouchdb'
import { randomBytes } from '@nexajs/crypto'
import { sha512 } from '@nexajs/crypto'
import { subscribeAddress } from '@nexajs/rostrum'
import { v4 as uuidv4 } from 'uuid'
import { Wallet } from '@nexajs/wallet'

import playHandler from './play/handler.ts'

/* Initialize databases. */
const playsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/plays`)
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)

export default defineEventHandler(async (event) => {
    /* Set (request) body. */
    const body = await readBody(event)

    const treasuryMnemonic = process.env.MNEMONIC
    console.log('TREASURY MNEMONIC', treasuryMnemonic)

    /* Initialize wallet. */
    const treasuryWallet = new Wallet(treasuryMnemonic)

    /* Request (receiving) address. */
    const treasuryAddress = treasuryWallet.address
    console.log('TREASURY ADDRESS', treasuryAddress)

    // -------------------------------------------------------------------------

    const _id = uuidv4()

    const entropy = binToHex(randomBytes(32))
    console.log('ENTROPY', entropy)

    const mnemonic = entropyToMnemonic(entropy)

    const serverHash = sha512(entropy)

    const createdAt = moment().valueOf()

    /* Initialize wallet. */
    const wallet = new Wallet(mnemonic)

    /* Request (receiving) address. */
    const address = wallet.address
    console.log('PLAY ADDRESS', address)

    /* Start monitoring address. */
    const cleanup = await subscribeAddress(address, playHandler)
    console.log('CLEANUP', cleanup)

    const dbPlay = {
        _id,
        address,
        entropy,
        mnemonic,
        serverHash,
        ...body,
        createdAt,
    }
    console.log('DATABASE PLAY', dbPlay)

    const response = await playsDb
        .put(dbPlay)
        .catch(err => console.error(err))
    console.log('PLAY (api):', response)

    const play = {
        playid: _id,
        address,
        serverHash,
        createdAt,
    }

    /* Return response. */
    return play
})
