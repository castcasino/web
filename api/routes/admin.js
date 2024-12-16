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

    const response = await start()
console.log('RESPONSE (nodemailer start)', response)

    return res.json({ hi: 'there!' })
}
