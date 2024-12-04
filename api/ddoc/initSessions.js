/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'

/* Set today. */
const TODAY = moment().format('YYYYMMDD')

/* Initialize databases. */
const requestsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/sessions_${TODAY}_req`)
const responsesDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/sessions_${TODAY}_res`)

/* Build design document. */
const ddoc = {
    _id: '_design/api',
    views: {
        bySession: {
            map: function (_doc) {
                if (_doc.sessionid) {
                    emit(_doc.sessionid)
                }
            }.toString()
        },
        isPending: {
            map: function (_doc) {
                if (typeof _doc.completedAt === 'undefined') {
                    emit(_doc._id)
                }
            }.toString()
        },
        isPendingBySession: {
            map: function (_doc) {
                if (typeof _doc.completedAt === 'undefined') {
                    emit(_doc.sessionid)
                }
            }.toString()
        },
    },
}

export default async () => {
    /* Initialize locals. */
    let response

    /* Query for design document. */
    response = await requestsDb
        .get('_design/api')
        .catch(err => console.error(err))
// console.log('INIT SESSIONS (check)', response)

    /* Validate response. */
    if (typeof response === 'undefined') {
        /* Save design document. */
        response = await requestsDb
            .put(ddoc)
            .catch(err => {
                console.error(err)
                if (err.name !== 'conflict') {
                    throw err
                }
                // ignore if doc already exists
            })
// console.log('INIT SESSIONS (saved)', response)
    } else {
        console.log(`[ sessions_${TODAY}_req ] design document already exists!`)
    }

    /* Query for design document. */
    response = await responsesDb
        .get('_design/api')
        .catch(err => console.error(err))
// console.log('INIT SESSIONS (check)', response)

    /* Validate response. */
    if (typeof response === 'undefined') {
        /* Save design document. */
        response = await responsesDb
            .put(ddoc)
            .catch(err => {
                console.error(err)
                if (err.name !== 'conflict') {
                    throw err
                }
                // ignore if doc already exists
            })
// console.log('INIT SESSIONS (saved)', response)
    } else {
        console.log(`[ sessions_${TODAY}_res ] design document already exists!`)
    }
}
