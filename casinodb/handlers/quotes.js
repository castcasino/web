/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'

/* Initialize databases. */
const systemDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/system`)

export default async () => {
// console.log('MANAGING QUOTES')

    /* Initialize locals. */
    let response

    response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD')
console.log('RESPONSE (quote)', response)
return

}
