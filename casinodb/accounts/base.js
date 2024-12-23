import { createWalletClient, http } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { base } from 'viem/chains'

export default () => {
    const account = mnemonicToAccount(process.env.MNEMONIC)
// console.log('ACCOUNT', account)

    const client = createWalletClient({
        account,
        chain: base,
        transport: http(),
    })
// console.log('CLIENT', client)

    return client
}
