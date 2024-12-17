<script setup lang="ts">
definePageMeta({
    layout: 'app',
})

useHead({
    title: 'Game Creator — Cast Casino',
    meta: [
        { name: 'description', content: 'Cast Casino offers a revolutionary blockchain experience.' }
    ],
})

/* Initialize stores. */
import { useSystemStore } from '@/stores/system'

/* Initialize System. */
const System = useSystemStore()

const updateParent = async () => {
    // TODO
    return

    /* Initialize locals. */
    let cast
    let data
    let embeds
    let text
    let type

    /* Set (cast) type. */
    type = 'createCast'

    /* Set (cast) text. */
    text = `NYC pizza enjoyers, we need your input on last night's tasting:`

    /* Set (cast) embeds. */
    embeds = [ 'https://polls.example.com/frame/1' ]

    /* Build cast. */
    cast = { text, embeds }

    /* Build (message) data. */
    data = { cast }

    /* Send message to parent (window). */
    window.parent.postMessage({ type, data }, '*')
}

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
