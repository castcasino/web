/* Import modules. */
import moment from 'moment'

import { start } from '../libs/nodemailer.js'

/* Set today. */
const TODAY = moment().format('YYYYMMDD')

/**
 * Administration Module
 */
export default async (req, res) => {
    console.log('BODY', req.body)

    /* Initialize locals. */
    let body
    let method
    let response

    body = req.body

    /* Validate body. */
    if (typeof body === 'undefined') {
        /* Set status. */
        res.status(401)

        /* Return error. */
        return res.json({
            error: 'You MUST provide a body.'
        })
    }

    /* Set method. */
    method = body.method

    /* Validate method. */
    if (typeof method === 'undefined') {
        /* Set status. */
        res.status(401)

        /* Return error. */
        return res.json({
            error: 'You MUST provide a method.'
        })
    }

    /* Handle method. */
    switch(method) {
    case 'notify':
        response = await start()
        break
    default:
        response = {}
    }
console.log('RESPONSE (nodemailer start)', response)

    /* Return response. */
    return res.json(response)
}
