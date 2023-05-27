/* Import modules. */
import { decodeAddress } from '@nexajs/address'
import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

/* Initialize databases. */
const promosDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/promos`)


export default defineEventHandler(async (event) => {
    let action
    let address
    let body
    let decoded
    let error
    let label
    let pkg
    let response
    let slug

    /* Set (request) body. */
    body = await readBody(event)
    // console.log('SESSIONS.POST (body):', body)

    /* Initialize locals. */
    action = body?.action

    pkg = {}

    if (action === 'register') {
        address = body?.address
        label = body?.label

        slug = address.slice(-6)

        const owners = [""]

        const createdAt = moment().unix()

        try {
            decoded = decodeAddress(address)
            console.log('DECODED', decoded)

            response = await promosDb.put({
                _id: address,
                label,
                slug,
                owners,
                createdAt,
            })
            .catch(err => {
                console.error(err)
                console.log('ERROR!', err.message)

                pkg.error = err.message
            })
            console.log('RESPONSE', response)

            pkg.success = true
            pkg.decoded = decoded
            pkg.response = response

        } catch (err) {
            console.error(err)
            console.error('ERROR', err.message)

            pkg.error = err.message
        }

    }


    /* Return session. */
    return pkg
})
