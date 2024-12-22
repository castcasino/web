/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'
import { formatEther } from 'viem'

/* Import handlers. */
import handleBlocksBase from './handlers/blocksBase.js'
import handleBlocksDegen from './handlers/blocksDegen.js'
import handleBlocksEth from './handlers/blocksEth.js'

/* Import wallets. */
import baseWallet from './wallets/base.js'

import handleCommunity from './monitors/community.js'
import handlePot from './monitors/pot.js'
import handleQuotes from './monitors/quotes.js'
import handleSeated from './monitors/seated.js'
import handleTables from './monitors/tables.js'
import handleShowdown from './monitors/showdown.js'

/* Import blockchain clients. */
import { baseClient } from './clients/base.js'
import { degenClient } from './clients/degen.js'
import { ethClient } from './clients/eth.js'

/* Set constants. */
const QUOTES_INTERVAL = 300000
const TABLES_INTERVAL = 15000
const COMMUNITY_INTERVAL = 15000
const PITBOSS_INTERVAL = 60000
const HOSTESS_INTERVAL = 60000
const SHOWDOWN_INTERVAL = 60000

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
// console.log('MNEMONIC', process.env.MNEMONIC)
// console.log('TREASURY_ADDRESS', process.env.TREASURY_ADDRESS)

    const accounts = await baseWallet(process.env.MNEMONIC)
        .getAddresses()
        .catch(err => console.error(err))
console.log('BASE ACCOUNTS', accounts)

    const balance = await baseClient.getBalance({
        address: accounts[0],
        blockTag: 'safe'
    })
    const balanceAsEther = formatEther(balance)
console.log('BALANCE AS ETHER', balanceAsEther, balance)
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

    setInterval(() => {
        // console.log('Managing Tables...')
        handleQuotes()
    }, QUOTES_INTERVAL)
    handleQuotes()

    setInterval(() => {
        // console.log('Managing Tables...')
        handleTables()
    }, TABLES_INTERVAL)
    handleTables()

    setInterval(() => {
        console.log('Managing Community...')
        handleCommunity()
    }, COMMUNITY_INTERVAL)
    handleCommunity()

    setInterval(() => {
        console.log('Managing Pot (by Pit Boss)...')
        handlePot()
    }, PITBOSS_INTERVAL)
    handlePot()

    setInterval(() => {
        console.log('Managing Seated (by Hostess)...')
        handleSeated()
    }, HOSTESS_INTERVAL)
    handleSeated()

    // setInterval(() => {
    //     console.log('Managing Showdown...')
    //     handleShowdown()
    // }, SHOWDOWN_INTERVAL)
    handleShowdown()
})()
