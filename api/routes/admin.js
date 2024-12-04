/* Import modules. */
import moment from 'moment'

/* Set today. */
const TODAY = moment().format('YYYYMMDD')

/**
 * Administration Module
 */
export default async (req, res) => {
    console.log('BODY', req.body)

    return res.json({ hi: 'there!' })
}
