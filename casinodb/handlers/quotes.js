/* Import modules. */
import axios from 'axios'
import moment from 'moment'
import PouchDB from 'pouchdb'

/* Initialize databases. */
const systemDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/system`)

/* Initialize constants. */
const ENDPOINT = 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'

const getQuotes = async () => {
    /* Initialize locals. */
    let headers
    let json
    let response

    /* Set headers. */
    headers = {
        'X-CMC_PRO_API_KEY': process.env.CMC_PRO_API_KEY,
    }

    /* Request data. */
    response = await axios
        .get(ENDPOINT, { headers })
        .catch(err => console.error(err))
console.log('RESPONSE (quotes)', response)

    /* Validate response. */
    if (response) {
        json = response.data
console.log('RESPONSE (json)', json)
    } else {
        json = {}
    }

    /* Return json. */
    return json
}

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
// console.log('QUOTES', quotes)

    response = await fetch('https://min-api.cryptocompare.com/data/price?fsym=DEGEN&tsyms=USD,EUR,CNY,JPY,GBP')
// console.log('RESPONSE (quote)', response)

    quotes.DEGEN = await response.json()
// console.log('QUOTES', quotes)

const test = await getQuotes()
console.log('QUOTES TEST', test)

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
