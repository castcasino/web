<script setup lang="ts">
useHead({
    title: 'Players — Cast Casino',
    meta: [
        { name: 'description', content: 'Cast Casino offers a revolutionary blockchain experience.' }
    ],
})
</script>

<template>
    <main class="max-w-5xl mx-auto my-10 flex flex-col gap-4">
        <h1 class="text-5xl font-medium">
            Players
        </h1>

        <p>
            Compete head-to-head with your peers or against the Bankers.
            All Plays are provably fair using our Fairplay Gaming Engine (FGE).
        </p>

        <section class="flex flex-col gap-4">
            <h2 class="text-2xl font-medium">
                Why Fairplay?
            </h2>

            <p>
                There are many reasons why Fairplay is the best way to wager.
            </p>

            <ol class="list-decimal pl-10">
                <li>Verifiable proof of outcome</li>
                <li>Immutable transaction ledger</li>
            </ol>
        </section>

        <section class="flex flex-col gap-4">
            <h2 class="text-2xl font-medium">
                Play Anywhere
            </h2>

            <p>
                Most Cast Casino are HTML5-compatible and can be played from EVERY device, including:
            </p>

            <ol class="list-decimal pl-10">
                <li>Mobile (Android &amp; iOS)</li>
                <li>PC (Windows, Mac &amp; Linux)</li>
                <li>Smart TV (Samsung, LG, and more...)</li>
            </ol>
        </section>
    </main>
</template>
