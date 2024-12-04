import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

/* Set today. */
const TODAY = moment().format('YYYYMMDD')

/* Initialize databases. */
const sessionsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/sessions_${TODAY}`)

export default async (_req, _res) => {
    /* Initialize locals. */
    let body
    let cpu
    let createdAt
    let error
    let ip
    let mem
    let profile
    let release
    let request
    let response
    let sessionid
    let uptime

    /* Set body. */
    body = _req.body

    /* Set IP address. */
    ip = body.ip

    /* Set release. */
    release = body.release

    /* Set uptime. */
    uptime = body.uptime

    /* Set cpu. */
    cpu = body.cpu

    /* Set mem. */
    mem = body.mem

    /* Set profile. */
    profile = body.profile

    /* Validate body params. */
    if (ip && release) {
        /* Generate new session id. */
        sessionid = uuidv4()

        /* Generate timestamp (in seconds). */
        createdAt = moment().unix()

        /* Add request to db. */
        response = await sessionsDb
            .put({
                _id: sessionid,
                ip,
                release,
                uptime,
                cpu,
                mem,
                profile,
                createdAt,
            }).catch(err => {
                console.error(err)
                error = JSON.stringify(err)
            })
// console.log('RESPONSE (request)', response)

        /* Validate response. */
        if (response.ok === true) {
            /* Return (request) response. */
            return _res.json({
                sessionid,
                success: true,
                createdAt,
                created_at: createdAt, // For Rust snake_case.
            })
        }
    }

    /* Return (request) error. */
    _res.json({
        sessionid,
        success: false,
        error,
        createdAt,
        created_at: createdAt, // For Rust snake_case.
    })
}
