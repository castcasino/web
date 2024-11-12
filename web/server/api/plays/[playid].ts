/* Import modules. */
// import { entropyToMnemonic } from '@nexajs/hdnode'
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

    // NOTE: Wait until tx idem before exposing secrets.
    const entropy = response?.txidem?.length === 64 ? response.entropy : '[ hidden ]'

    // NOTE: Wait until tx idem before exposing secrets.
    const mnemonic = response?.txidem?.length === 64 ? entropyToMnemonic(entropy) : '[ hidden ]'

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
        keyHash: response.keyHash,
        unpent: response.unpent,
        satoshis: response.satoshis,
        outcome: response.outcome,
        txidem: response.txidem,
        playerJoy: response.playerJoy,
        houseJoy: response.houseJoy,
        createdAt: response.createdAt,
        expiresAt: response.expiresAt,
        updatedAt: response.updatedAt,
    }

    /* Return (filtered) results. */
    return filtered
  })
