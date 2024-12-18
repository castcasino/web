// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    /* Application Settings */
    app: {
        /* Application Header */
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            title: 'Cast Casino — Casual & Provably Fair Gaming',
            meta: [
                { name: 'description', content: 'The first fairplay, permissionless real-money gaming network.' },
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

        /* Plausible */
        '@nuxtjs/plausible',
    ],

    plausible: {
        // Prevent tracking on localhost
        ignoredHostnames: ['localhost'],
        apiHost: 'https://plausible.cast.casino',
    },

    /* Route Rules */
    routeRules: {
        /* Disable server-side rendering for Admin area. */
        '/manager/**': { ssr: false },

        /* Add CORS headers to API. */
        '/v1/**': { cors: true },
    },

    /* Set compatibility date. */
    compatibilityDate: '2024-12-05',
})
