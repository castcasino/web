/* Import modules. */
import cors from 'cors'
import express from 'express'

/* Import handlers. */
import routesAdmin from './routes/admin.js'
import routesMain from './routes/main.js'
import routesNotif from './routes/notif.js'
import routesSession from './routes/session.js'

/* Set constants. */
const HOST = process.env.HOST || '127.0.0.1'
const PORT = process.env.PORT || 4000

/* Initialize application. */
const app = express()

/* Initialize CORS. */
app.use(cors())

/* Initialize JSON parser. */
app.use(express.json())

/* Initialize URL parser. */
app.use(express.urlencoded({ extended: true }))

/* Build welcome message. */
const welcome = `
<html>
<body>

<h2>Welcome to the Cast Casino API</h2>
<h3>https://cast.casino/v1</h3>

</body>
</html>
`

// TODO: Replace with a "static" site.
app.get('/v1', (req, res) => {
    res.end(welcome)
})

/* Initialize General route. */
app.post('/v1', routesMain)

/* Initialize Administration route. */
app.post('/v1/admin', routesAdmin)

/* Initialize Notification route. */
app.post('/v1/notif', routesNotif)

/* Initialize Session route. */
app.post('/v1/session', routesSession)

// TODO: Offer help.
app.get('*', (req, res) => {
    res.end('Oops! I think you forgot something.')
})

/* Start listening for connections. */
app.listen(PORT, HOST)

/* Display current environment variables. */
console.info()
console.log(`Running on http://${HOST}:${PORT}`)
console.info()
console.info('Current Environment Variables')
console.info('-----------------------------')
console.info('  - NODE_ENV     :', process.env.NODE_ENV)
console.info('  - ADMIN_KEY    :', process.env.ADMIN_KEY)
console.info('  - COUCHDB_AUTH :', process.env.COUCHDB_AUTH)
console.info('  - SMTP_HOST    :', process.env.SMTP_HOST)
console.info('  - SMTP_USER    :', process.env.SMTP_USER)
console.info('  - SMTP_PASS    :', process.env.SMTP_PASS)
console.info()
