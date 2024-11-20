<script setup lang="ts">
definePageMeta({
    layout: 'app',
})

useHead({
    title: 'Game Creator — Cast Casino',
    meta: [
        { name: 'description', content: 'Nexa Gaming offers a revolutionary blockchain experience.' }
    ],
})

/* Initialize stores. */
import { useSystemStore } from '@/stores/system'

/* Initialize System. */
const System = useSystemStore()

// onMounted(() => {
//     console.log('Mounted!')
//     // Now it's safe to perform setup operations.
// })

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })

</script>

<template>
    <main class="max-w-5xl mx-auto my-10">
        <h1 class="text-5xl font-medium">
            Game Creator
        </h1>

        <p>
            Let's create brand NEW game and share it with your community.
        </p>
    </main>
</template>
