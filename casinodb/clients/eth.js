import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const ethClient = createPublicClient({
    chain: mainnet,
    transport: http()
})
