/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

/* Initialize databases. */
const walletDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/wallet`)

/**
 * Create Session
 *
 * @returns session
 */
const createSession = async (_event) => {
    /* Set headers. */
    const headers = _event.node.req.headers
    // console.log('HEADERS', headers)

    /* Build log details. */
    const logDetails = {
        i18n: headers['accept-language'],
        client: headers['user-agent'],
        referer: headers['referer'],
        host: headers['host'],
        ip: headers['x-real-ip'],
        ip_fwd: headers['x-forwarded-for'],
        url: _event.node.req.url,
    }
    // console.info('LOG (api):', logDetails)

    /* Create (new) session. */
    const session = {
        _id: uuidv4(),
        ...logDetails,
        isActive: true,
        createdAt: moment().unix(),
    }

    /* Save session to database. */
    const success = await walletDb
        .put(session)
        .catch(err => console.error(err))
    console.log('SUCCESS', success)

    /* Return session. */
    return session
}

export default defineEventHandler(async (event) => {
    /* Set (request) body. */
    const body = await readBody(event)
    console.log('WALLET.POST (body):', body)

    /* Initialize locals. */
    let response
    let wallet

    /* Request session (if available). */
    response = await walletDb
        .allDocs({
            include_docs: true,
        })
        .catch(err => console.error(err))
    console.log('RESPONSE (wallet):', response)

    if (response?.rows.length > 0) {
        wallet = response.rows.map(_entry => {
            const newDoc = {
                id: _entry.doc._id,
                ..._entry.doc,
            }

            delete newDoc._id
            delete newDoc._rev

            return newDoc
        })
    }

    /* Return session. */
    return wallet
})
