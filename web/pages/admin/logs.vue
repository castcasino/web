<script setup lang="ts">
useHead({
    title: 'Blank — Cast Casino',
    meta: [
        { name: 'description', content: 'Cast Casino offers a revolutionary blockchain experience.' }
    ],
})

/* Initialize stores. */
import { useSystemStore } from '@/stores/system'

/* Initialize System. */
const System = useSystemStore()

const sessions = ref(null)

const init = async () => {
    const response = await $fetch('https://cast.casino/v1/admin', {
        method: 'POST',
        body: JSON.stringify({
            method: 'sessions',
        })
    }).catch(err => console.error(err))
console.log('RESPONSE', response)

    if (response && response.length > 0) {
        sessions.value = response
    }
}

onMounted(() => {
    init()
})

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })
</script>

<template>
    <main class="max-w-5xl mx-auto my-10 gap-4">
        <h1 class="text-5xl font-medium">
            Session Logs
        </h1>

        <pre class="text-xs">{{JSON.stringify(sessions, null, 2)}}</pre>
    </main>
</template>
