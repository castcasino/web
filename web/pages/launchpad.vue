<script setup lang="ts">
/* Initialize stores. */
import { useSystemStore } from '@/stores/system'

/* Initialize System. */
const System = useSystemStore()

useHead({
    title: 'Launchpad — Cast Casino',
    meta: [
        { name: 'description', content: 'Nexa Gaming offers a revolutionary blockchain experience.' }
    ],
})
</script>

<template>
    <main class="max-w-5xl mx-auto my-10">
        <h1 class="text-5xl font-medium">
            Launchpad
        </h1>

        <p>
            Are you ready to monetize your game?
        </p>

        <p>
            Nexa Gaming Engine (NGE) is a permissionless and provably fair wagering system, powered by the Nexa blockchain.
        </p>
    </main>
</template>
