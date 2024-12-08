<script setup lang="ts">
useHead({
    title: 'Gallery — Casino Gallery',
    meta: [
        { name: 'description', content: 'Casino Gaming offers a revolutionary blockchain experience.' }
    ],
})
</script>

<template>
    <main class="max-w-5xl mx-auto my-10">
        <h1 class="text-5xl font-medium">
            Gallery
        </h1>

        <section class="p-5 bg-gray-100">
            <NuxtLink to="https://cast.poker" target="_blank" class="">
                <h2 class="text-xl font-medium hover:underline">Cast Poker</h2>
            </NuxtLink>

        </section>
    </main>
</template>
