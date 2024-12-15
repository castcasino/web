/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'

const systemDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/system`)

/**
 * Administration Module
 */
export default async (req, res) => {
    console.log('BODY', req.body)

    let quotes

    quotes = await systemDb
        .get('quotes')
        .catch(err => console.error(err))
console.log('RESPONSE (quotes)', quotes)

    /* Sanitize. */
    delete quotes._id
    delete quotes._rev

    /* Return quotes. */
    return res.json(quotes)
}
