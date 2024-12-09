/* Import modules. */
import { ethers } from 'ethers'
import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

import _handleRegister from '../handlers/register.js'
import _handleRequest from '../handlers/request.js'
import _handleResponse from '../handlers/response.js'

/* Set today. */
const TODAY = moment().format('YYYYMMDD')

/* Initialize databases. */
const activityDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/nodes_${TODAY}_act`)
const dailyLogsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs_${TODAY}`)
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)
const requestsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/sessions_${TODAY}_req`)
const responsesDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/sessions_${TODAY}_res`)
const sessionsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/sessions_${TODAY}`)

/* Initialize design document. */
import initSessions from '../ddoc/initSessions.js'
// initSessions()

/**
 * Sessions Module
 */
export default async (_req, _res) => {
    /* Initialize locals. */
    let activity
    let authorization
    let blob
    let body
    let cpu
    let createdAt
    let doc
    let email
    let headers
    let ip
    let lastSince
    let mem
    let method
    let node
    let nodeid
    let pkg
    let profile
    let release
    let results
    let since
    let specs
    let updatedAt
    let uptime

    /* Initialize locals. */
    let domain
    let endpoint
    let error
    let id
    let isVerified
    let profileid
    let response
    let session
    let sessionid
    let signature
    let types
    let value

    /* Initialize package handlers. */
    let act
    let log
    let req
    let res
    let rpt

    /* Set headers. */
    headers = _req.headers
// console.log('HEADERS', headers)

    /* Set body. */
    body = _req.body
console.log('BODY', body)

    /* Validate body. */
    if (typeof body === 'undefined' || body === null) {
        /* Set status. */
        _res.status(400)

        /* Return error. */
        return _res.json({
            error: 'Oops! You MUST provide a body.'
        })
    }

    method = body.method
// console.log('METHOD', method)

    /* Validate method. */
    if (method) {
        switch(method) {
        case 'reg':
            return _handleRegister(_req, _res)
        case 'req':
            return _handleRequest(_req, _res)
        case 'res':
            return _handleResponse(_req, _res)
        default:
            // NO ACTION SPECIFIED
        }
    }

    /* Set session id. */
    sessionid = body.sessionid
// console.log('SESSION ID', sessionid)

    /* Set since. */
    since = body.since
// console.log('SINCE', since)

    /* Set last since. */
    // NOTE: 0 is for registration info
    lastSince = 1

    /* Validate session id. */
    if (typeof sessionid === 'undefined' || sessionid === null) {
        /* Set status. */
        _res.status(400)

        /* Return error. */
        return _res.json({
            error: 'Oops! You MUST provide a `sessionid`.'
        })
    }

    results = await sessionsDb
        .get(sessionid)
        .catch(err => console.error(err))
// console.log('RESULTS (session)', results)

    /* Validate results. */
    if (results) {
        ip = results.ip
        release = results.release
        uptime = results.uptime
        cpu = results.cpu
        mem = results.mem
        profile = results.profile
        createdAt = results.createdAt
    }

    if (since === 0) {
        return _res.json({
            sessionid,
            ip,
            release,
            uptime,
            cpu,
            mem,
            profile,
            createdAt,
            created_at: createdAt,
        })
    }

    results = await activityDb
        .get(sessionid)
        .catch(err => console.error(err))
// console.log('RESULTS (activity)', results)

    if (results) {
        /* Manage last since. */
        if (results.createdAt > lastSince) {
            lastSince = results.createdAt
        }

        pkg = {
            actionid: results.actionid,
            target: results.target,
            createdAt: results.createdAt,
            created_at: results.createdAt, // Alias to Rust snake_case.
        }

        if (typeof act === 'undefined' || act === null) {
            /* Initialize array. */
            act = []
        }

        // act

        /* Add action. */
        act.push(pkg)
    }

    /* Request (all requests) from database. */
    results = await requestsDb
        .query('api/bySession', {
            key: sessionid,
            include_docs: true,
        }).catch(err => console.error(err))
// console.log('RESULTS (requests)', results)

    /* Validate results. */
    if (results && results.rows && results.rows.length) {
        if (typeof req === 'undefined' || req === null) {
            /* Initialize array. */
            req = []
        }

        /* Handle results. */
        for (let i = 0; i < results.rows.length; i++) {
            /* Set document. */
            doc = results.rows[i].doc
// console.log('DOC', doc)

            /* Validate execution instruction. */
            if (doc && doc.exec) {
                /* Verify inclusion set. */
                if (since < doc.createdAt) {
                    /* Manage last since. */
                    if (doc.createdAt > lastSince) {
                        lastSince = doc.createdAt
                    }

                    /* Add to requests. */
                    req.push({
                        id: doc._id,
                        exec: doc.exec,
                        createdAt: doc.createdAt,
                        created_at: doc.createdAt, // Alias to Rust snake_case.
                    })
                }
            }
        }
    }

    /* Request (all responses) from database. */
    results = await responsesDb
        .query('api/bySession', {
            key: sessionid,
            include_docs: true,
        }).catch(err => console.error(err))
// console.log('RESULTS (responses)', results)

    /* Validate results. */
    if (results && results.rows && results.rows.length) {
        if (typeof res === 'undefined' || res === null) {
            /* Initialize array. */
            res = []
        }

        /* Handle results. */
        for (let i = 0; i < results.rows.length; i++) {
            /* Set document. */
            doc = results.rows[i].doc
// console.log('DOC', doc)

            /* Validate execution instruction. */
            if (doc && doc.resp) {
                /* Verify inclusion set. */
                if (since < doc.createdAt) {
                    /* Manage last since. */
                    if (doc.createdAt > lastSince) {
                        lastSince = doc.createdAt
                    }

                    /* Add to responses. */
                    res.push({
                        id: doc._id,
                        resp: doc.resp,
                        createdAt: doc.createdAt,
                        created_at: doc.createdAt, // Alias to Rust snake_case.
                    })
                }
            }
        }
    }

    /* Validate last since. */
    if (lastSince <= 1) {
        lastSince = since
    }

    /* Build package. */
    pkg = {
        sessionid,
        act,
        log,
        req,
        res,
        rpt,
        createdAt,
        created_at: createdAt, // Alias to Rust snake_case.
        lastSince,
        last_since: lastSince, // Alias to Rust snake_case.
    }
// console.log('PKG', pkg)

    /* Retrieve results. */
    // results = await usersDb.put(pkg)
    //     .catch(err => {
    //         console.error('AUTH ERROR:', err)
    //     })
    // console.log('RESULT (session)', util.inspect(results, false, null, true))

    return _res.json(pkg)

}
