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

    /* Initialize locals. */
    let response
    let tables

    response = await pokerTablesDb
        .allDocs({
            include_docs: true,
        })
        .catch(err => console.error(err))
console.log('RESPONSE', response)

    /* Fitler tables. */
    tables = response.rows.filter(_table => {
        return _table.id !== '_design/api'
    })

    /* Return tables. */
    return res.json(tables)
}
