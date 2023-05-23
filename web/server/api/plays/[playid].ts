/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

/* Initialize databases. */
const playsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/plays`)

export default defineEventHandler(async (_event) => {
    let response

    const params = _event.context.params
    // console.log('PARAMS', params)

    const playid = params?.playid
    // console.log('PLAY ID', playid)

    response = await playsDb
        .get(playid)
        .catch(err => console.error(err))
    // console.log('DB RESPONSE', response)

    if (response.error === 'not_found') {
        return {
            error: response.error,
        }
    }

    const entropy = response.updatedAt ? response.entropy : '[ hidden ]'

    const mnemonic = response.updatedAt ? response.mnemonic : '[ hidden ]'

    /* Build (filtered) response. */
    const filtered = {
        id: response._id,
        gameid: response.gameid,
        playerid: response.playerid,
        address: response.address,
        rtp: response.rtp,
        entropy,
        mnemonic,
        payout: response.payout,
        position: response.position,
        seed: response.seed,
        serverHash: response.serverHash,
        unpent: response.unpent,
        satoshis: response.satoshis,
        outcome: response.outcome,
        playerJoy: response.playerJoy,
        houseJoy: response.houseJoy,
        createdAt: response.createdAt,
        expiresAt: response.expiresAt,
        updatedAt: response.updatedAt,
    }

    /* Return (filtered) results. */
    return filtered
  })
