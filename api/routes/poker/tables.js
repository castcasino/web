/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'

/* Initialize databases. */
const pokerTablesDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/poker_tables`)
const systemDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/system`)

/**
 * Administration Module
 */
export default async (req, res) => {
// console.log('BODY', req.body)

    /* Initialize locals. */
    let nextid
    let response
    let table
    let tableid
    let tables

    /* Validate table id. */
    if (req.params && req.params.tableid) {
        /* Set table id. */
        tableid = req.params.tableid
// console.log('TABLE ID', tableid)

        /* Request table. */
        table = await pokerTablesDb
            .get(tableid)
            .catch(err => console.error(err))
// console.log('TABLE', table)

        /* Sanitize table. */
        delete table._id
        delete table._rev

        /* Return table. */
        return res.json(table)
    }

    /* Validate table id. */
    if (req.params && req.params.nextid) {
        /* Set table id. */
        nextid = req.params.nextid
console.log('NEXT (TABLE) ID', nextid)

        response = await systemDb
            .get('next_table')
            .catch(err => console.error(err))
console.log('RESPONSE (next table)', response)

        /* Return table. */
        return res.json(response)
    }

    response = await pokerTablesDb
        .allDocs({
            include_docs: true,
        })
        .catch(err => console.error(err))
// console.log('RESPONSE', response)

    /* Fitler tables. */
    tables = response.rows.filter(_table => {
        return _table.id !== '_design/api'
    })

    /* Map tables. */
    tables = tables.map(_table => {
        /* Set doc. */
        const doc = _table.doc

        /* Sanitize doc. */
        delete doc._id
        delete doc._rev

        /* Return doc. */
        return doc
    })

    /* Return tables. */
    return res.json(tables)
}
