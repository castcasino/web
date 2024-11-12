<script setup lang="ts">
definePageMeta({
    layout: 'manager',
})

useHead({
    title: `Manager — Cast Manager`,
    meta: [
        { name: 'description', content: `Cast Manager makes building your next BIG idea effortless.` }
    ],
})

/* Initialize stores. */
import { useSystemStore } from '@/stores/system'
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
    <main class="max-w-5xl mx-auto py-5 flex flex-col gap-4">
        <h1 class="text-5xl font-medium">
            Casino Manager
        </h1>

        <p>
            Manage your Casino games ALL from a single, convenient location.
        </p>

        <ol class="pl-10 list-decimal">
            <li>Track community engagement</li>
            <li>Customize your games</li>
        </ol>
    </main>

    <Footer />
</template>
