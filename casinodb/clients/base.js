import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'

export const baseClient = createPublicClient({
    chain: base,
    transport: http()
})

export default baseClient
