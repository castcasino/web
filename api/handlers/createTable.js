/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

/* Initialize databases. */
const tablesDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/poker_tables`)

export default async (_req, _res) => {
    /* Initialize locals. */
    let body
    let error
    let exec
    let id
    let createdAt
    let request
    let response
    let sessionid
    let status

    /* Set body. */
    body = _req.body

    /* Set session id. */
    sessionid = body.sessionid
console.log('SESSION ID', sessionid)

    /* Validate body params. */
    if (body) {
        /* Generate new ID. */
        id = uuidv4()

        /* Set (waiting) status. */
        status = 'seating'

        /* Generate timestamp (in milliseconds). */
        createdAt = moment().unix()

        /* Add request to db. */
        response = await tablesDb
            .put({
                _id: id,
                ...body,
                status,
                createdAt,
            }).catch(err => {
                console.error(err)
                error = JSON.stringify(err)
            })
console.log('RESPONSE (request)', response)

        /* Validate response. */
        if (response.ok === true) {
            /* Return (request) response. */
            return _res.json({
                id,
                success: true,
                createdAt,
            })
        }
    }

    /* Return (request) error. */
    _res.json({
        id,
        success: false,
        error,
        createdAt,
    })
}
