/* Import modules. */
import { encodeAddress } from '@nexajs/address'

import {
    ripemd160,
    sha256,
} from '@nexajs/crypto'

import { getTransaction } from '@nexajs/rostrum'
import { encodeDataPush } from '@nexajs/script'

import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'


export default async (_unspent) => {
    // const pos = _unspent.pos
    const txid = _unspent.txid

    const tx = await getTransaction(txid)
    // console.log('TX', tx)

    const inputs = tx?.vin
    // console.log('INPUTS', inputs)

    const hex = inputs[0]?.scriptSig.hex
    // console.log('HEX', hex)

    const publicKey = hexToBin(hex.slice(4, 70))
    // console.log('PUBLIC KEY', binToHex(publicKey))

    /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
    const scriptPushPubKey = encodeDataPush(publicKey)
    // console.log('SCRIPT PUSH PUBLIC KEY', scriptPushPubKey);

    const publicKeyHash = ripemd160(sha256(scriptPushPubKey))
    // console.log('PUBLIC KEY HASH (hex)', binToHex(publicKeyHash))

    const pkhScript = hexToBin('17005114' + binToHex(publicKeyHash))
    // console.info('  Public key hash Script:', binToHex(pkhScript))

    const address = encodeAddress(
        'nexa',
        'TEMPLATE',
        pkhScript,
    )
    // console.info('ADDRESS', address)

    /* Set sender. */
    const sender = {
        address,
        inputs,
    }

    /* Return sender. */
    return sender
}
