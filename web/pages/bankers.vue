<script setup lang="ts">
useHead({
    title: 'Bankers — Nexa Games',
    meta: [
        { name: 'description', content: 'Nexa Gaming offers a revolutionary blockchain experience.' }
    ],
})
</script>

<template>
    <main class="max-w-5xl mx-auto my-10 space-y-5">
        <h1 class="text-5xl font-medium">
            Bankers
        </h1>

        <p>
            Bankers provide the capital that backs each and every Play made between platform participants.
        </p>

        <div class="grid grid-cols-2 gap-4">
            <section class="px-3 py-2 bg-gradient-to-r from-gray-200 to-gray-300 border-2 border-gray-500 rounded-lg shadow-md">
                <h2 class="text-3xl font-medium">
                    Governors
                </h2>

                <p>
                    (Optionally) Receive an NFT from the Gamemaster offering PREMIUM revenue opportunities.
                </p>
            </section>

            <section class="px-3 py-2 bg-gradient-to-r from-gray-200 to-gray-300 border-2 border-gray-500 rounded-lg shadow-md">
                <h2 class="text-3xl font-medium">
                    Treasurers
                </h2>

                <p>
                    Receive STANDARD revenue opportunities.
                </p>
            </section>

        </div>
    </main>
</template>
