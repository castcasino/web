/* Import modules. */
import { encodePrivateKeyWif } from '@nexajs/hdnode'
import { getAddressBalance } from '@nexajs/rostrum'
import { listUnspent } from '@nexajs/address'
import PouchDB from 'pouchdb'
import { sha256 } from '@nexajs/crypto'
import { Wallet } from '@nexajs/wallet'

/* Initialize databases. */
const playsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/plays`)
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)

export default async (_updatedInfo) => {
    console.log('PLAY HANDLER', _updatedInfo)

    let playAddress
    let playData
    let playSatoshis
    let response
    let treasuryAddress
    let unspent

    /* Set play address. */
    playAddress = _updatedInfo[0]
    console.log('PLAY ADDRESS', playAddress)

    // const treasuryMnemonic = process.env.MNEMONIC
    // console.log('TREASURY MNEMONIC', treasuryMnemonic)

    /* Initialize wallet. */
    // const treasuryWallet = new Wallet(treasuryMnemonic)

    /* Request (receiving) address. */
    // const treasuryAddress = treasuryWallet.address
    // console.log('TREASURY ADDRESS', treasuryAddress)

    /* Encode Private Key WIF. */
    // const wif = encodePrivateKeyWif({ hash: sha256 }, treasuryWallet.privateKey, 'mainnet')
    // console.log('PRIVATE KEY (WIF):', wif)

    // Fetch all unspent transaction outputs for the temporary in-browser wallet.
    unspent = await listUnspent(playAddress)
    console.log('\n  Unspent outputs:\n', unspent)

    playSatoshis = await getAddressBalance(playAddress)
    console.log('\n  Play balance:\n', playSatoshis)

    response = await playsDb
        .query('api/byAddress', {
            key: playAddress,
            include_docs: true,
        })
        .catch(err => console.error(err))
    console.log('RESPONSE', response)

    if (response?.rows.length > 0) {
        playData = response.rows[0].doc
        console.log('PLAY DATA', playData)
    }


return

    const treasuryMnemonic = process.env.MNEMONIC
    console.log('TREASURY MNEMONIC', treasuryMnemonic)

    /* Initialize wallet. */
    const treasuryWallet = new Wallet(treasuryMnemonic)

    /* Request (receiving) address. */
    treasuryAddress = treasuryWallet.address
    console.log('TREASURY ADDRESS', treasuryAddress)

    /* Encode Private Key WIF. */
    const wif = encodePrivateKeyWif({ hash: sha256 }, treasuryWallet.privateKey, 'mainnet')
    console.log('PRIVATE KEY (WIF):', wif)

    // Fetch all unspent transaction outputs for the temporary in-browser wallet.
    unspent = await listUnspent(wallet.value.address)
    console.log('\n  Unspent outputs:\n', unspent)

    satoshis.value = await getAddressBalance(wallet.value.address)
    console.log('\n  Address balance:\n', satoshis.value)

    /* Filter out ANY tokens. */
    // FIXME We should probably do something better than this, lol.
    unspent = unspent.filter(_unspent => {
        return _unspent.value > DUST_LIMIT
    })

    /* Validate unspent outputs. */
    if (unspent.length === 0) {
        return console.error('There are NO unspent outputs available.')
    }

    /* Build parameters. */
    const coins = unspent.map(_unspent => {
        const outpoint = _unspent.outpointHash
        const satoshis = _unspent.value

        return {
            outpoint,
            satoshis,
            wif,
        }
    })
    console.log('\n  Coins:', coins)
}
