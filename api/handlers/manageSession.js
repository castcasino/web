/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

/* Set today. */
const TODAY = moment().format('YYYYMMDD')

/* Initialize databases. */
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)
const playersDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/players`)
const sessionsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/sessions`)

export default async (_req, _res) => {
    /* Initialize locals. */
    let body
    let createdAt
    let error
    let exec
    let id
    let pkg
    let profile
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
    if (typeof body !== 'undefined' && body !== null) {
        /* Generate new ID. */
        id = uuidv4()

        /* Generate timestamp (in milliseconds). */
        createdAt = moment().unix()

        /* Add to logs db. */
        logsDb.put({
            _id: id,
            body,
            createdAt,
        }).catch(err => console.error(err))

        pkg = body.pkg

        if (typeof pkg === 'undefined' || pkg === null) {
            return _res.json({
                error: 'Oops! No pkg found!'
            })
        }

        if (typeof pkg === 'string') {
            try {
                pkg = JSON.parse(pkg)
            } catch (err) {
                console.error(err)
                return _res.json(err)
            }
        }

        /* Validate package. */
// FIXME WE MUST AUTHENTICATE THE DATA BEFORE STORING
        if (pkg && pkg.user) {
            response = await playersDb
                .get(pkg.user.fid)
                .catch(err => console.error(err))

            /* Validate response. */
            if (typeof response === 'undefined' || response === null) {
                await playersDb.put({
                    _id: pkg.user.fid.toString(),
                    address: pkg.address,
                    ...pkg.user,
                    ...pkg.client,
                    createdAt,
                }).catch(err => console.error(err))
            }
        }

        /* Add to sessions db. */
        response = await sessionsDb
            .put({
                _id: id,
                ...pkg,
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
