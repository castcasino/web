<script setup lang="ts">
/* Initialize stores. */
import { useSystemStore } from '@/stores/system'

/* Initialize System. */
const System = useSystemStore()

useHead({
    title: 'Strategy — Nexa Games',
    meta: [
        { name: 'description', content: 'Nexa Gaming offers a revolutionary blockchain experience.' }
    ],
})
</script>

<template>
    <Header />

    <main class="max-w-5xl mx-auto my-10">
        <h1 class="text-5xl font-medium">
            Strategy
        </h1>

        <p>
            <ul>
                <li>Martingale</li>
                <li>Delayed Martingale</li>
                <li>Paroli</li>
                <li>D 'Alembert</li>
            </ul>
        </p>
    </main>

    <Footer />
</template>
