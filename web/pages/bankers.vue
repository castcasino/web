<script setup lang="ts">
useHead({
    title: 'Bankers — Nexa Games',
    meta: [
        { name: 'description', content: 'Nexa Gaming offers a revolutionary blockchain experience.' }
    ],
})
</script>

<template>
    <Header />

    <main class="max-w-5xl mx-auto my-10 space-y-5">
        <h1 class="text-5xl font-medium">
            Bankers
        </h1>

        <section>
            <h2 class="text-3xl font-medium">
                Directors
            </h2>

            <p>
                (Optionally) Receive an NFT from the Gamemaster offering PREMIUM revenue opportunities.
            </p>
        </section>

        <section>
            <h2 class="text-3xl font-medium">
                Associates
            </h2>

            <p>
                Receive STANDARD revenue opportunities.
            </p>
        </section>
    </main>

    <Footer />
</template>
