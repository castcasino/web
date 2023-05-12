#!/usr/bin/env node

import crypto from 'crypto'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

console.log('\n  Generating random hashes...')

const header = `Nexa Games Hashes
Generated: 2023.5.12 @ 12:00:00 UTC
Hash count: 10,000
`

const secretName = '0001_secret.txt'
const secretPath = path.join(__dirname, '..', 'web', 'public', 'hashes', secretName)

fs.writeFileSync(secretPath, header)
console.log('\n  Write (header) completed successfully!')

const hiddenName = '0001_hidden.txt'
const hiddenPath = path.join(__dirname, '..', 'web', 'public', 'hashes', hiddenName)

fs.writeFileSync(hiddenPath, header)
console.log('\n  Write (header) completed successfully!')

for (let i = 0; i < 5; i++) {
    /* Generate secret. */
    const secret = uuidv4()

    /* Generate hash. */
    const hash = crypto
        .createHash('sha512')
        .update(secret)
        .digest('hex')

    /* Create secret line. */
    const secretLine = `1:${secret}:${hash}`

    /* Append to hidden file. */
    fs.appendFileSync(secretPath, '\n' + secretLine)
    console.log('\n  Write (hashes) completed successfully!')

    /* Create hidden line. */
    const hiddenLine = `1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:${hash}`

    /* Append to hidden file. */
    fs.appendFileSync(hiddenPath, '\n' + hiddenLine)
    console.log('\n  Write (hashes) completed successfully!')
}

console.log()
