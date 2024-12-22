/* Import modules. */
import PouchDB from 'pouchdb'

/* Initialize databases. */
const blocksBaseDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/blocks_base`)

const RETRY_DELAY = 5000

const sleep = ms => new Promise(r => setTimeout(r, ms))

const _requestBlocks = async () => {
    /* Initialize locals. */
    let blocks
    let response

    response = await blocksBaseDb
        .query('api/byTimestamp', {
            descending: true,
            limit: 5,
            include_docs: true,
        }).catch(err => console.error(err))
// console.log('RESPONSE (blocks)', response)

// FIXME ALL 5 BLOCKS MUST BE SEQUENTIAL -- OR ELSE TRY AGAIN!!
    /* Validate response. */
    if (typeof response !== 'undefined' && response !== null) {
        /* Set blocks. */
        blocks = response.rows

        /* Validate blocks. */
        if (typeof blocks !== 'undefined' && blocks !== null) {
            blocks = blocks.map(_block => {
                return _block.doc
            })

            /* Return (reversed/ascending) blocks. */
            return blocks.reverse()
        }

    } else {
        await sleep(RETRY_DELAY)
        return _requestBlocks()
    }

    /* Return empty. */
    return response
}

export default async () => {
    /* Request (sequential) blocks. */
    return _requestBlocks()
}
