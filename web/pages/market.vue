<script setup lang="ts">
/* Initialize stores. */
import { useSystemStore } from '@/stores/system'

/* Initialize System. */
const System = useSystemStore()

useHead({
    title: 'Marketplace — Cast Casino',
    meta: [
        { name: 'description', content: 'Cast Casino offers a revolutionary blockchain experience.' }
    ],
})
</script>

<template>
    <main class="max-w-5xl mx-auto my-10">
        <h1 class="text-5xl font-medium">
            Marketplace
        </h1>

        <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id eius voluptatem minus natus at eveniet dolorum eos mollitia, maxime animi excepturi harum omnis illum odit recusandae pariatur! Unde, explicabo molestias.
        </p>
    </main>
</template>
