/* Import modules. */
// const { Magic } = require('@magic-sdk/admin')
import moment from 'moment'
import PouchDB from 'pouchdb'
// import superagent from 'superagent'
import util from 'util'
import { v4 as uuidv4 } from 'uuid'

/* Set today. */
const TODAY = moment().format('YYYYMMDD')

/* Initialize databases. */
// const activityDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/nodes_activity_20241128`)
// const nodesDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/nodes`)
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)
const sessionsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/sessions_20241128`)

/**
 * Users Module
 */
export default async (req, res) => {
    /* Initialize locals. */
    let action
    let activity
    let authorization
    let blob
    let body
    let createdAt
    let email
    let headers
    let node
    let nodeid
    let pkg
    let results
    let updatedAt

    /* Set headers. */
    headers = req.headers
console.log('HEADERS', headers)

    /* Set body. */
    body = req.body
console.log('BODY', body)

return res.json({ we: 'done!' })

    /* Validate headers. */
    if (headers) {
        /* Set authorization. */
        authorization = headers.authorization
console.log('AUTHORIZATION', authorization)

        /* Validate authorization. */
        // if (!authorization) {
        //     /* Set status. */
        //     res.status(401)
        //
        //     /* Return error. */
        //     return res.json({
        //         error: 'You MUST provide authorization.'
        //     })
        // }

        /* Retrieve token. */
        // const token = authorization.split(' ')[1]
        // console.log('RECEIVED TOKEN', token)

        /* Validate token. */
        // if (!token) {
        //     /* Set status. */
        //     res.status(400)
        //
        //     /* Return error. */
        //     return res.json({
        //         error: 'You MUST provide a DID token.'
        //     })
        // }

        /* Set issuer. */
        // const issuer = magicAdmin.token.getIssuer(token)

        /* Validate issuer. */
        // if (!issuer) {
        //     /* Set status. */
        //     res.status(400)
        //
        //     /* Return error. */
        //     return res.json({
        //         error: 'Could NOT retrieve this issuer.'
        //     })
        // }

        /* Set issuer metadata. */
        // const metadata = await magicAdmin.users.getMetadataByIssuer(issuer)
        // console.log('MAGIC LOGIN (data):', JSON.stringify(metadata, null, 4))

        /* Validate metadata. */
        // if (!metadata) {
        //     /* Set status. */
        //     res.status(400)
        //
        //     /* Return error. */
        //     return res.json({
        //         error: 'Could NOT retrieve the email for this issuer.'
        //     })
        // }

        /* Set email address. */
        // email = metadata.email
        // console.log('MAGIC LOGIN (email):', email)

        /* Validate email. */
        // if (!email) {
        //     /* Set status. */
        //     res.status(401)
        //
        //     /* Return error. */
        //     return res.json({
        //         error: 'Unauthorized user.'
        //     })
        // }

    }

    /* Set body. */
    body = req.body
console.log('BODY-2', body)

    nodeid = body.nodeid
console.log('NODE ID', nodeid);

    results = await sessionsDb
        .get(nodeid)
        .catch(err => console.error(err))
    console.log('RESULTS (node)', results);

    if (results) {
        blob = results.blob
        createdAt = results.createdAt
    }

    results = await activityDb
        .get(nodeid)
        .catch(err => console.error(err))
    console.log('RESULTS (activity)', activity);

    if (results) {
        action = {
            actionid: results.actionid,
            target: results.target,
            createdAt: results.createdAt
        }

        if (typeof activity === 'undefined' || activity === null) {
            /* Initialize array. */
            activity = []
        }

        /* Add action. */
        activity.push(action)
    }

    /* Build package. */
    pkg = {
        nodeid,
        activity,
        blob,
        createdAt,
        // created_at: moment().unix(), // NOTE: Rust casing.
    }
console.log('PKG', pkg)

    /* Retrieve results. */
    // results = await usersDb.put(pkg)
    //     .catch(err => {
    //         console.error('AUTH ERROR:', err)
    //     })
    // console.log('RESULT (node)', util.inspect(results, false, null, true))

    return res.json(pkg)
}
