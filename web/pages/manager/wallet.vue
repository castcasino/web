<script setup lang="ts">
/* Initialize stores. */
import { useSystemStore } from '@/stores/system'

/* Initialize System. */
const System = useSystemStore()

useHead({
    title: 'Wallet — Nexa Games',
    meta: [
        { name: 'description', content: 'Nexa Gaming offers a revolutionary blockchain experience.' }
    ],
})

const wallet = ref(null)

const getSummary = async () => {
    const method = 'POST'

    const body = {
        action: 'summary',
    }

    /* Request game play. */
    const response = await $fetch('/api/wallet', {
        method,
        body,
    })
    .catch(err => console.error(err))
    console.log('WALLET RESPONSE', response)

    if (response) {
        wallet.value = response
    }

}

getSummary()
</script>

<template>
    <Header />

    <main class="max-w-5xl mx-auto my-10">
        <h1 class="text-5xl font-medium">
            Wallet
        </h1>

        <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id eius voluptatem minus natus at eveniet dolorum eos mollitia, maxime animi excepturi harum omnis illum odit recusandae pariatur! Unde, explicabo molestias.
        </p>
    </main>

    <pre>
{{wallet}}
    </pre>

    <Footer />
</template>
