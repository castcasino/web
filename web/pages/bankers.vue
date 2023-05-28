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
            <section class="px-3 py-2 flex flex-col gap-3 bg-gradient-to-r from-gray-200 to-gray-300 border-2 border-gray-500 rounded-lg shadow-md">
                <h2 class="text-3xl font-medium">
                    Governors
                </h2>

                <p>
                    The top class of NFT offered in the Banking sector of Nexa Games.
                </p>

                <ol class="pl-10 list-disc">
                    <li>Up to 12 members per game</li>
                    <li>Premium revenue share/opportunities</li>
                    <li>2X to 10X voting rights</li>
                </ol>
            </section>

            <section class="px-3 py-2 flex flex-col gap-3 bg-gradient-to-r from-gray-200 to-gray-300 border-2 border-gray-500 rounded-lg shadow-md">
                <h2 class="text-3xl font-medium">
                    Treasurers
                </h2>

                <p>
                    The standard class of NFT offered in the Banking sector of Nexa Games.
                </p>

                <ol class="pl-10 list-disc">
                    <li>Up to 88 members per game</li>
                    <li>Standard revenue share/opportunities</li>
                    <li>Single voting rights</li>
                </ol>
            </section>

        </div>
    </main>
</template>
