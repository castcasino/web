/* Import modules. */
import { binToHex } from '@nexajs/utils'
import { decodeAddress } from '@nexajs/address'
import { entropyToMnemonic } from '@nexajs/hdnode'
import moment from 'moment'
import PouchDB from 'pouchdb'
import { randomBytes } from '@nexajs/crypto'
import { sha256 } from '@nexajs/crypto'
import { sha512 } from '@nexajs/crypto'
import { subscribeAddress } from '@nexajs/rostrum'
import { v4 as uuidv4 } from 'uuid'
import { Wallet } from '@nexajs/wallet'

/* Libauth helpers. */
import { instantiateRipemd160 } from '@bitauth/libauth'

import hiLoHandler from './play/hi_lo.ts'

/* Initialize databases. */
const playsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/plays`)
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)

export default defineEventHandler(async (event) => {
    /* Set (request) body. */
    const body = await readBody(event)

    /* Set player seed. */
    // FIXME WE MUST PERFORM PROPER DATA SANITIZATION!!!
    const playerSeed = body?.seed

    // TODO Perform data validation for seed

    const treasuryAddress = process.env.TREASURY_ADDRESS
    console.log('TREASURY ADDRESS', treasuryAddress)

    /* Set vault mnemonic (from env). */
    const vaultMnemonic = process.env.MNEMONIC

    /* Initialize wallet. */
    const vaultWallet = new Wallet(vaultMnemonic)

    /* Request (receiving) address. */
    const vaultAddress = vaultWallet.address
    console.log('VAULT ADDRESS', vaultAddress)

    // -------------------------------------------------------------------------

    const entropy = binToHex(randomBytes(32))
    // console.log('ENTROPY', entropy)

    /* Calculate mnemonic. */
    const mnemonic = entropyToMnemonic(entropy)

    /* Initialize wallet. */
    const wallet = new Wallet(mnemonic)
    // console.log('WALLET', wallet)

    /* Request (receiving) address. */
    const address = wallet.address
    // console.log('PLAY ADDRESS', address)

    const decoded = decodeAddress(address)
    // console.log('DECODED', decoded)

    const pubKeyHash = binToHex(decoded.hash).slice(8)
    // console.log('PUBLIC KEY HASH', pubKeyHash)

    /* Create play id. */
    const _id = pubKeyHash
    // console.log('PLAY ID', _id)

    /* Start monitoring address. */
    const cleanup = await subscribeAddress(address, hiLoHandler.bind(playerSeed))
    // console.log('CLEANUP', cleanup)

    /* Set creation date. */
    const createdAt = moment().valueOf()

    /* Set expiration date. */
    const expiresAt = moment().add(15, 'minutes').valueOf()

    /* Calculate db play. */
    const dbPlay = {
        _id,
        address,
        entropy,
        ...body,
        createdAt,
        expiresAt,
    }
    // console.log('DATABASE PLAY', dbPlay)

    /* Update plays db. */
    const response = await playsDb
        .put(dbPlay)
        .catch(err => console.error(err))
    // console.log('PLAY (api):', response)

    /* Calculate (server) key hash (for client). */
    const keyHash = sha512(sha512(entropy))

    const auth = {
        id: _id,
        //
        //
        //
        playerSeed,
        keyHash,
    }

    const ripemd160 = await instantiateRipemd160()

    // TODO Calculate "authorization" hash
    const authHash = binToHex(ripemd160.hash(sha256(JSON.stringify(auth)), 'binary'))

    /* Build play package. */
    const playPkg = {
        playid: _id,
        address,
        keyHash,
        authHash,
        createdAt,
        expiresAt,
    }

    /* Return package. */
    return playPkg
})
