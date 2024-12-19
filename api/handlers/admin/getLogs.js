/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

/* Initialize databases. */
const sessionsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/sessions`)

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
// console.log('SESSION ID', sessionid)

    response = await sessionsDb
        .query('api/isCastEmbed', {
            limit: 50,
            include_docs: true,
        }).catch(err => console.error(err))

    /* Return (request) error. */
    _res.json(response)
}
