/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

/* Import handlers. */
import handleBlocksBase from './handlers/blocksBase.js'
import handleBlocksDegen from './handlers/blocksDegen.js'
import handleBlocksEth from './handlers/blocksEth.js'

/* Import blockchain clients. */
import { baseClient } from './clients/base.js'
import { degenClient } from './clients/degen.js'
import { ethClient } from './clients/eth.js'

/* Set constants. */
const PLAYS_INTERVAL = 5000
const WALLET_INTERVAL = 15000

// TODO Replace with @nexajs/utils
const jsonParse = (_data, _transform = true) => {
    let data

    if (_transform) {
        data = _data
    } else {
        // NOTE: We actually (de-)transform before decoding.
        data = JSON.stringify(_data)
    }

    try {
        return JSON.parse(data, (key, value) => {
            if (typeof value === 'string' && /^\d+n$/.test(value)) {
                return BigInt(value.slice(0, value.length - 1))
            }
            return value
        })
    } catch (err) {
        console.log('JSON PARSE ERROR!');
        console.log('ERROR', err)
    }
}

console.info('\n  Starting Cast Casino daemon...\n')
;(async () => {
    // handlePlaysQueue()
    // handleWalletQueue()

    baseClient
        .watchBlocks({
            emitMissed: true,
            emitOnBegin: true,
            includeTransactions: false,
            onBlock: handleBlocksBase,
        })

    degenClient
        .watchBlocks({
            emitMissed: true,
            emitOnBegin: true,
            includeTransactions: false,
            onBlock: handleBlocksDegen,
        })

    ethClient
        .watchBlocks({
            emitMissed: true,
            emitOnBegin: true,
            includeTransactions: false,
            onBlock: handleBlocksEth,
        })

return
    setInterval(() => {
        console.log('Managing Plays queue...')
        handlePlaysQueue()
    }, PLAYS_INTERVAL)

    setInterval(() => {
        console.log('Managing Wallet queue...')
        handleWalletQueue()
    }, WALLET_INTERVAL)
})()
