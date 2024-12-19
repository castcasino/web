/* Import modules. */
import moment from 'moment'

/* Import (local) modules. */
import getLogs from '../handlers/admin/getLogs.js'

/* Import libs. */
import { send } from '../libs/nodemailer.js'

/**
 * Administration Module
 */
export default async (req, res) => {
console.log('BODY', req.body)

    /* Initialize locals. */
    let body
    let method
    // let message
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
        response = await send(body.pkg)
        break
    case 'logs':
        response = await getLogs()
        break
    default:
        response = {}
    }
console.log('RESPONSE (nodemailer start)', response)

    /* Return response. */
    return res.json(response)
}
