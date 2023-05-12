<script setup lang="ts">
useHead({
    title: 'Fairplay — Nexa Games',
    meta: [
        { name: 'description', content: 'Nexa Gaming offers a revolutionary blockchain experience.' }
    ],
})
</script>

<template>
    <Header />

    <main class="max-w-5xl mx-auto my-10">
        <h1 class="text-5xl font-medium">
            Fairplay
        </h1>

        <p class="my-5">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur assumenda velit animi aut ipsa ab vero perferendis nam consequuntur sequi qui deleniti neque facere, laudantium dolore officiis earum tempore nesciunt.
        </p>

        <h2>playid: {{$route.params.playid}}</h2>

        <div class="w-full py-5 flex justify-center">
            <input
                type="text"
                placeholder="Type or copy/paste your Player ID here"
                class="w-1/2 py-2 px-5 bg-yellow-100 border-4 border-yellow-300 text-lg text-yellow-900 placeholder-yellow-900 rounded-lg"
            />
        </div>
    </main>

    <Footer />
</template>
