/* Import modules. */
import moment from 'moment'
import nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid'

/**
 * Start Daemon
 */
export async function start(_databases) {
    let id
    let address
    let body
    let response
    let results

    /* Generate id. */
    id = uuidv4()

    /* Add record to database. */
    // response = await notifsDb
    //     .put({
    //         _id: id,
    //         ...body,
    //     })
    //     .catch(err => {
    //         console.error(err)
    //
    //         return res.json(err)
    //     })

    const msgFrom = '"Cast Casino" <hello@cast.casino>'

    const msgRecipient = 'info@bchplease.org'

    const msgSubject = 'Cast Casino Event'

    const msgDetails = {
        txid: 'd465b82e9d9e74a19b5ea0ac09308be93be8e5f3b46ad8ceb0da99005b7e9b2e',
    }

    const auth = {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 465,
        secure: true, // true for 465, false for other ports
        auth,
    })

    const mailPkg = {
        from: msgFrom,
        to: msgRecipient,
        subject: msgSubject,
        text: `This is just some text`,
        html: `<h1>Heading</h1> <p>This is just some <strong>HTML</strong></p>`
        // text: require('../templates/plaintext')(msgDetails),
        // html: require('../templates/html')(msgDetails),
    }

    // send mail with defined transport object
    const info = await transporter.sendMail(mailPkg)
    console.log('Message sent: %s', info.messageId)

    /* Send response back to client. */
    res.json({
        databaseId: response.id,
        messageId: info.messageId,
    })
}

/**
 * Test Daemon
 *
 * Performs various tests to ensure the daemon is performing as expected.
 */
export async function test(_databases) {
    let id
    let response

    /* Set databases. */
    const sessionsDb = _databases.sessions

    const method = 'getwalletinfo'

    const params = []

    /* Set node options. */
    const options = {
        username: 'user', // required
        password: 'password', // required
        host: '127.0.0.1', // (optional) default is localhost (127.0.0.1)
        port: '7227', // (optional) default is 7227
    }

    response = await call(method, params, options)
    // console.log('RPC RESPONSE\n', response)

    id = 'd5113e8e-d2c1-416f-aa8e-cbdb54f7e718'
    response = await sessionsDb
        .get(id)
        .catch(err => {
            console.error(err)
        })
    console.log('DB RESPONSE', response)
}
