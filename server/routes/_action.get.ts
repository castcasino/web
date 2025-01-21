export default defineEventHandler((event) => {
    /* Initialize locals. */
    let action

    /* Build action. */
    action = {
        name: `Cast 🎰 Casino`,
        icon: 'organization', // https://docs.farcaster.xyz/reference/actions/spec#valid-icons
        description: `Create Casual (Real-money) Games`,
        aboutUrl: 'https://cast.casino/about',
        action: {
            type: 'post',
            postUrl: 'https://cast.casino/_action',
        },
    }

    /* Build (composer) action. */
    composerAction = {
        type: 'composer',
        name: `Cast 🎰 Casino`,
        icon: 'organization', // https://docs.farcaster.xyz/reference/actions/spec#valid-icons
        description: `Create Casual (Real-money) Games`,
        aboutUrl: 'https://cast.casino/about',
        imageUrl: 'https://cast.casino/favicon.png',
        action: {
            type: 'post',
            postUrl: 'https://cast.casino/_action',
        }
    }

    /* Return action. */
    return composerAction
})
