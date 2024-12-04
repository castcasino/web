/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

/* Set today. */
const TODAY = moment().format('YYYYMMDD')

/* Initialize databases. */
const responsesDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/sessions_${TODAY}_res`)

export default async (_req, _res) => {
    /* Initialize locals. */
    let body
    let error
    let id
    let createdAt
    let request
    let resp
    let response
    let sessionid

    /* Set body. */
    body = _req.body

    /* Set session id. */
    sessionid = body.sessionid
console.log('SESSION ID', sessionid)

    /* Set response. */
    resp = body.resp
console.log('RESP', resp)

    /* Validate body params. */
    if (sessionid && resp) {
        /* Generate new ID. */
        id = uuidv4()

        /* Generate timestamp (in milliseconds). */
        createdAt = moment().valueOf()

        /* Add request to db. */
        response = await responsesDb
            .put({
                _id: id,
                sessionid,
                resp,
                createdAt,
            }).catch(err => {
                console.error(err)
                error = JSON.stringify(err)
            })
console.log('RESPONSE (resp)', response)

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
