/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

/* Initialize databases. */
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)

export default async (_req, _res) => {
    /* Initialize locals. */
    let body
    let error
    let response
    let sessionid

    /* Set body. */
    body = _req.body

    /* Set session id. */
    sessionid = body.sessionid
console.log('SESSION ID', sessionid)

    response = await logsDb
        .allDocs({
            limit: 10,
        }).catch(err => console.error(err))

    /* Return (request) error. */
    _res.json(response)
}
