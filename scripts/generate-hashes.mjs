#!/usr/bin/env node

import crypto from 'crypto'
import fs from 'fs'
import moment from 'moment'
import numeral from 'numeral'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'
import { randomBytes } from '@nexajs/crypto'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/* Initialize databases. */
const hashesDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/hashes`)
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)

console.log('\n  Generating random hashes...')

const epoch = 1
const numHashes = 100

const timestamp = moment().utc().format('LLLL') + ' UTC'

const header = `Cast Casino Hashes
Generated: ${timestamp}
Hash count: ${numeral(numHashes).format('0,0')}
Epoch: ${epoch}
`

const privateName = `000${epoch}_private.txt`
const privatePath = path.join(__dirname, '..', 'secrets', privateName)

fs.writeFileSync(privatePath, header)
console.log('\n  Write (header) completed successfully!')

const publicName = `000${epoch}_public.txt`
const publicPath = path.join(__dirname, '..', 'web', 'public', 'hashes', publicName)

fs.writeFileSync(publicPath, header)
console.log('\n  Write (header) completed successfully!')

for (let i = 0; i < numHashes; i++) {
    const entropy = randomBytes(16)
    // console.log('ENTROPY', entropy)

    const v4options = {
        random: entropy,
    }
    // console.log('V4OPTIONS', v4options)

    /* Generate secret. */
    const secret = uuidv4()

    const idx = String(i).padStart(4, '0')

    /* Generate hash. */
    const hash = crypto
        .createHash('sha512')
        .update(secret)
        .digest('hex')

    /* Create secret line. */
    const privateLine = `${idx}:${secret}:${hash}`

    /* Append to public file. */
    fs.appendFileSync(privatePath, '\n' + privateLine)
    // console.log('\n  Write (hashes) completed successfully!')

    /* Create public line. */
    const publicLine = `${idx}:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:${hash}`

    /* Append to public file. */
    fs.appendFileSync(publicPath, '\n' + publicLine)
    // console.log('\n  Write (hashes) completed successfully!')

    const response = hashesDb.put({
        _id: hash,
        epoch,
        secret,
        gameid: null,
        playid: null,
        createdAt: moment().unix(),
    })
    console.log('RESPONSE', response)
}

console.log('\n  Write (hashes) completed successfully!')
console.log()
