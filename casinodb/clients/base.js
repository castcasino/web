import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

export const baseClient = createPublicClient({
    chain: base,
    transport: http(`https://base-mainnet.infura.io/v3/${process.env.METAMASK_API_KEY}`)
})
