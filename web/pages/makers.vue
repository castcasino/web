<script setup lang="ts">
useHead({
    title: 'Gamemakers — Nexa Games',
    meta: [
        { name: 'description', content: 'Nexa Gaming offers a revolutionary blockchain experience.' }
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

            <pre class="my-3 w-fit px-10 py-5 text-lg font-mono font-medium bg-gray-200 border-2 border-gray-400 rounded-lg shadow">dev@workspace: <span class="font-bold">npm create nexa</span></pre>

            <NuxtLink to="https://docs.nexa.games/maker/build-a-game-from-scratch" target="_blank" class="text-blue-500 font-medium hover:underline">
                https://docs.nexa.games/maker/build-a-game-from-scratch
            </NuxtLink>
        </section>
    </main>
</template>
