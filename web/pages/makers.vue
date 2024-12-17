<script setup lang="ts">
useHead({
    title: 'Gamemakers — Cast Casino',
    meta: [
        { name: 'description', content: 'Cast Casino offers a revolutionary blockchain experience.' }
    ],
})
</script>

<template>
    <main class="max-w-5xl mx-auto my-10 flex flex-col gap-4">
        <h1 class="text-5xl font-medium">
            Gamemakers
        </h1>

        <p>
            Build a consistent monetization system directly into your game(s).
        </p>

        <section>
            <h2 class="text-2xl font-medium">
                Build a Game from Scratch
            </h2>

            <NuxtLink to="https://docs.cast.casino/maker/build-a-game-from-scratch" target="_blank" class="text-blue-500 font-medium hover:underline">
                https://docs.cast.casino/maker/build-a-game-from-scratch
            </NuxtLink>
        </section>
    </main>
</template>
