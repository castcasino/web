/* Import modules. */
import PouchDB from 'pouchdb'

/* Initialize databases. */
const walletDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/wallet`)

export default async (_transaction) => {
    let newAddress
    let result

    const outputs = _transaction.vout

    for (let i = 0; i < outputs.length; i++) {
        /* Set output. */
        const output = outputs[i]

        /* Set script public key. */
        const scriptPubKey = output.scriptPubKey.hex.slice(6)

        /* Saved (in database) value. */
        const saved = await walletDb
            .get(scriptPubKey)
            .catch(err => console.error(err))
        // console.log('SAVED (outputs):', saved)

        if (saved) {
            const txs = saved.txs
            txs[_transaction.txidem] = _transaction.hex

            newAddress = {
                ...saved,
                txcount: Object.keys(txs).length,
                txs,
            }
        } else {
            const txs = {}
            txs[_transaction.txidem] = _transaction.hex

            newAddress = {
                _id: scriptPubKey,
                txcount: Object.keys(txs).length,
                txs,
            }
        }

        result = await walletDb
            .put(newAddress)
            .catch(err => console.error(err))
        console.log('OUTPOINT (result):', result)
    }

    return result
}
