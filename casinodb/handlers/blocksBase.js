/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

/* Initialize databases. */
const blocksBaseDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/blocks_base`)
const systemDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/system`)

export default async (_block) => {
// console.log('NEW BASE BLOCK', _block)
    const pkg = {
        _id: _block.number.toString(),
        hash: _block.hash,
        timestamp: Number(_block.timestamp),
        numTxs: _block.transactions.length,
        createdAt: moment().unix(),
    }
// console.log('DB PACKAGE', pkg)

    blocksBaseDb
        .put(pkg)
        .catch(err => {
            if (err.message !== 'Document update conflict.') {
                console.error(err)
            }
        })

    const idx = await systemDb
        .get('idx_base')
        .catch(err => console.error(err))
// console.log('IDX', idx)

    idx.height = _block.number.toString()
    idx.updatedAt = moment().unix()
// console.log('NEW IDX', idx)

    systemDb
        .put(idx)
        .catch(err => {
            if (err.message !== 'Document update conflict.') {
                console.error(err)
            }
        })
}
