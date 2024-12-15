/* Import modules. */
import PouchDB from 'pouchdb'

/* Initialize databases. */
const blocksBaseDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/blocks_base`)

export default async () => {
    const blocks = await blocksBaseDb
        .query('api/byTimestamp', {
            limit: 5,
        }).catch(err => console.error(err))
    console.log('BLOCKS', blocks)
}
