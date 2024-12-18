/* Import modules. */
import moment from 'moment'

/**
 * Administration Module
 */
export default async (req, res) => {
console.log('BODY', req.body)

    /* Return response. */
    return res.json(req.body)
}
