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

        <section>
            <h2>Hashes Lists <em>(by Epoch)</em></h2>

            <blockquote class="text-sm text-gray-500 w-1/2">
                Hashes may be independently verified by <span class="text-indigo-500 font-medium">ANY SHA-1 and SHA-512</span> tools available to you.
                We recommend <NuxtLink to="https://md5file.com/calculator" target="_blank" class="text-blue-500 font-medium hover:underline">https://md5file.com/calculator</NuxtLink>
            </blockquote>

            <ol class="list-decimal pt-3 pl-10">
                <li>
                    <NuxtLink to="/hashes/0001_public.txt" class="block text-blue-500 font-medium hover:underline">0001_public.txt</NuxtLink>
                    <NuxtLink to="/hashes/0001_public_checksum.txt" class="block text-blue-500 font-medium hover:underline">0001_public_checksum.txt</NuxtLink>
                    <h3>SHA-512 -> 6cf09a52bf6638df ... 28c28783de600886</h3>
                </li>
            </ol>
        </section>
    </main>

    <Footer />
</template>
