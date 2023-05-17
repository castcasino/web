import { getAddressBalance } from '@nexajs/rostrum'

export default defineEventHandler(async (event) => {
    const address = event.context.params.address
    console.log('ADDRESS', address)

    const balance = await getAddressBalance(address)
        .catch(err => console.error(err))

    /* Return block. */
    return balance
})
