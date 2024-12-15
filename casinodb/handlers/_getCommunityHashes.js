/* Import modules. */
import PouchDB from 'pouchdb'

/* Initialize databases. */
const blocksBaseDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/blocks_base`)

const RETRY_DELAY = 5000

const sleep = ms => new Promise(r => setTimeout(r, ms))

const _requestBlocks = async () => {
    let blocks
    let response

    response = await blocksBaseDb
        .query('api/byTimestamp', {
            descending: true,
            limit: 5,
            include_docs: true,
        }).catch(err => console.error(err))
    console.log('RESPONSE (blocks)', response)

// FIXME ALL 5 BLOCKS MUST BE SEQUENTIAL -- OR ELSE TRY AGAIN!!
    /* Validate response. */
    if (typeof response !== 'undefined' && response !== null) {
        // sleep(RETRY_DELAY)
        // return _requestBlocks()

    } else {
        sleep(RETRY_DELAY)
        return _requestBlocks()
    }

    return response
}

export default async () => {
    /* Request (sequential) blocks. */
    return _requestBlocks()
}
