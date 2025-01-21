<script setup lang="ts">
useHead({
    title: 'Gallery — Casino Gallery',
    meta: [
        { name: 'description', content: 'Casino Gaming offers a revolutionary blockchain experience.' }
    ],
})
</script>

<template>
    <main class="max-w-5xl mx-auto my-10 px-3">
        <h1 class="text-6xl font-light tracking-tight italic">
            Games Gallery
        </h1>

        <section class="mt-5 p-5 bg-gray-100">

            <NuxtLink to="https://cast.poker" target="_blank" class="flex flex-row items-center gap-3">
                <img src="https://cast.poker/icon.svg" class="size-10" />

                <h2 class="text-4xl font-medium tracking-widest hover:underline">
                    Cast Poker
                </h2>
            </NuxtLink>

        </section>
    </main>
</template>
