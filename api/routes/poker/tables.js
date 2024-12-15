/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'

/* Initialize databases. */
const pokerTablesDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/poker_tables`)

/**
 * Administration Module
 */
export default async (req, res) => {
    console.log('BODY', req.body)

    const tables = pokerTablesDb
        .allDocs()
        .catch(err => console.error(err))
console.log('TABLES', tables)

    return res.json(tables)
}
