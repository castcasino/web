/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'

const systemDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/system`)

/**
 * Administration Module
 */
export default async (req, res) => {
    console.log('BODY', req.body)

    let response

    response = await systemDb
        .get('quotes')
        .catch(err => console.error(err))
console.log('RESPONSE (quotes)', quote)

    /* Sanitize. */
    delete response._id
    delete response._rev

    /* Return quotes. */
    return res.json(quotes)
}
