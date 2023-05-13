<script setup lang="ts">
/* Initialize stores. */
import { useSystemStore } from '@/stores/system'

/* Initialize System. */
const System = useSystemStore()

useHead({
    title: 'Epochs — Nexa Games',
    meta: [
        { name: 'description', content: 'Nexa Gaming offers a revolutionary blockchain experience.' }
    ],
})

const route = useRoute()

const epochid = route.params.epochid
console.log('EPOCH ID', epochid)

</script>

<template>
    <Header />

    <main class="max-w-5xl mx-auto my-10">
        <h1 class="text-3xl font-medium">
            Epoch #{{epochid}} Attestation
        </h1>

        <pre class="mt-5 w-fit font-mono text-xs px-3 py-2 bg-yellow-100 border-2 border-yellow-300 rounded-lg shadow-md">
Nexa Games Hashes
Generated: Saturday, May 13, 2023 4:26 PM UTC
Hash count: 10,000
Epoch: 1

0001_private.txt
a359601231f93af0b35be9ddd2abe8daedd890577ffb7d36e34aba81dc9777134d788ff360c2b2cab1b23a711848610e2bd78ccce0b4424f477b2b9c50891adf

0001_public.txt
6cf09a52bf6638df7f3686af6150341bc551648b50c7393bf94b2d105c78f97eca71b048d8f6d18e0e3c26f42b5a46f6e82d6db41c71f9f328c28783de600886
        </pre>

        <section class="w-fit mt-5 px-3 py-2 bg-purple-700 border-2 border-purple-900 rounded-md shadow-md">
            <h2 class="text-purple-200 text-lg font-bold">
                SHA-1 Proof
            </h2>

            <h2 class="text-purple-200 font-medium">
                a39764e3f0bcb442f13888564e18fc5262f3f1f5
            </h2>

            <section class="px-3 py-2">
                <h3 class="text-sm">
                    Online SHA-1 Calculator
                </h3>

                <NuxtLink to="https://emn178.github.io/online-tools/sha1.html" target="_blank" class="text-sm text-blue-100 font-medium hover:underline">
                    https://emn178.github.io/online-tools/sha1.html
                </NuxtLink>
            </section>
        </section>

        <section class="w-fit mt-5 px-3 py-2 bg-purple-700 border-2 border-purple-900 rounded-md shadow-md">
            <h2 class="text-purple-200 text-lg font-bold">
                On-chain (OP_RETURN) Proof
            </h2>

            <NuxtLink to="https://explorer.nexa.org/" target="_blank" class="text-sm text-blue-100 font-medium hover:underline">
                [ put transaction id here ]
            </NuxtLink>
        </section>
    </main>

    <Footer />
</template>
