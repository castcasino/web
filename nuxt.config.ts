/* Initialize (default) frame embed. */
const frame = {
    version: 'next',
    imageUrl: 'https://cast.casino/poster.webp',
    button: {
        title: 'Real Money Gaming with Frens',
        action: {
            type: 'launch_frame',
            name: 'Cast Casino – Real Money Gaming',
            url: `https://cast.casino/`,
            splashImageUrl: `https://cast.casino/splash.gif`,
            splashBackgroundColor: '#78777c',
        },
    },
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    /* Application Settings */
    app: {
        /* Application Header */
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            title: 'Cast Casino – Real Money Gaming with Frens',
            meta: [
                { name: 'description', content: 'Real Money Gaming with your Farcaster frens – 100% provably Fairplay guarantee on every wager.' },
                { name: 'fc:frame', content: JSON.stringify(frame) },
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
            ],
        },
    },

    /* Application Modules */
    modules: [
        /* Tailwind CSS */
        '@nuxtjs/tailwindcss',

        /* Pinia */
        '@pinia/nuxt',
    ],

    /* Route Rules */
    routeRules: {
        /* Disable server-side rendering for Admin area. */
        '/manager/**': { ssr: false },
    },

    /* Set compatibility date. */
    compatibilityDate: '2025-05-25',
})
