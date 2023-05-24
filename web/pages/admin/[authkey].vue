<script setup lang="ts">
/* Initialize stores. */
import { useSystemStore } from '@/stores/system'

/* Initialize System. */
const System = useSystemStore()

useHead({
    title: 'Admin — Nexa Games',
    meta: [
        { name: 'description', content: 'Nexa Gaming offers a revolutionary blockchain experience.' }
    ],
})

const route = useRoute()

const authkey = route.params.authkey
console.log('AUTH KEY', authkey)

</script>

<template>
    <Header />

    <main class="max-w-5xl mx-auto my-10">
        <h1 class="text-5xl font-medium">
            Admin
        </h1>

        <p>
            Authorization Key [ {{authkey}} ]
        </p>
    </main>

    <Footer />
</template>
