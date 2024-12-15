/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'

/* Initialize databases. */
const systemDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/system`)

export default async () => {
// console.log('MANAGING QUOTES')

    /* Initialize locals. */
    let quotes
    let response

    quotes = {}

    response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,CNY,JPY,GBP')
        .catch(err => console.error(err))
// console.log('RESPONSE (quote)', response)

    quotes.ETH = await response.json()
console.log('QUOTES', quotes)

    response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=DEGEN&tsyms=USD,EUR,CNY,JPY,GBP')
console.log('RESPONSE (quote)', response)

    quotes.DEGEN = await response.json()
console.log('QUOTES', quotes)

    response = await systemDb
        .get('quotes')
        .catch(err => console.error(err))

    if (response) {
        response = {
            ...response,
            ...quotes,
            updatedAt: moment().unix()
        }

        await systemDb
            .put(response)
            .catch(err => console.error(err))
    }

    /* Return quotes. */
    return quotes
}
