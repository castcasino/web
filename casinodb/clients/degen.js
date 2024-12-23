import { createPublicClient, http } from 'viem'
import { degen } from 'viem/chains'

export const degenClient = createPublicClient({
    chain: degen,
    transport: http()
})

export default degenClient
