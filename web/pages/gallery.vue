<script setup lang="ts">
useHead({
    title: 'Gallery — Nexa Gallery',
    meta: [
        { name: 'description', content: 'Nexa Gaming offers a revolutionary blockchain experience.' }
    ],
})
</script>

<template>
    <Header />

    <main class="max-w-5xl mx-auto my-10">
        <h1 class="text-5xl font-medium">
            Gallery
        </h1>

        <section class="p-5 bg-gray-100">
            <NuxtLink to="https://wallydice.com" target="_blank" class="">
                <h2 class="text-xl font-medium hover:underline">Wally Dice</h2>
            </NuxtLink>

        </section>
    </main>

    <Footer />
</template>
