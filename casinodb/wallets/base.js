import { createWalletClient, http } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { base } from 'viem/chains'

export default (_mnemonic) => {
    const account = mnemonicToAccount(_mnemonic)

    const client = createWalletClient({
        account,
        chain: base,
        transport: http(),
    })

    return client
}
