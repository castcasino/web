/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'
import { Wallet } from '@nexajs/wallet'

/* Initialize databases. */
const playsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/plays`)
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)

// const BOOTSTRAP_PLAYID = '475b4cfc-ae95-419d-9681-cf378c083963'

export default defineEventHandler(async (event) => {
    /* Set (request) body. */
    const body = await readBody(event)

    const mnemonic = process.env.MNEMONIC
    console.log('MNEMONIC', mnemonic)

    /* Initialize wallet. */
    const wallet = new Wallet(mnemonic)

    /* Request (receiving) address. */
    const address = wallet.address
    console.log('ADDRESS', address)

    const _id = uuidv4()

    const gameid = null

    const playerid = null

    const createdAt = moment().valueOf()

    const play = {
        _id,
        address,
        ...body,
        gameid,
        playerid,
        createdAt,
    }
    console.log('API SAVE PLAY', play)

    const response = await playsDb
        .put(play)
        .catch(err => console.error(err))
    console.log('PLAY (api):', response)

    /* Return response. */
    return play
})
