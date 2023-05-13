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

        <div class="w-full py-5 flex justify-center">
            <input
                type="text"
                placeholder="Type or copy/paste your Game ID or Play ID here"
                class="w-1/2 py-2 px-5 bg-yellow-100 border-4 border-yellow-300 text-lg text-yellow-900 placeholder-yellow-900 rounded-lg"
            />
        </div>

        <section>
            <h2 class="text-xl font-medium">
                Hashes Lists <em>(by Epoch)</em>
            </h2>

            <blockquote class="text-sm text-gray-500 w-1/2">
                Hashes and attestations may be independently verified by ANY available <span class="text-indigo-500 font-medium">SHA-512</span> or <span class="text-indigo-500 font-medium">SHA-1</span> calculators.
                We recommend <NuxtLink to="https://md5file.com/calculator" target="_blank" class="text-blue-500 font-medium hover:underline">https://md5file.com/calculator</NuxtLink> and <NuxtLink to="https://emn178.github.io/online-tools/sha1.html" target="_blank" class="text-blue-500 font-medium hover:underline">https://emn178.github.io/online-tools/sha1.html</NuxtLink> respectively.
            </blockquote>

            <ol class="mt-5">
                <li class="px-3 py-2 bg-purple-100 border-2 border-purple-300 rounded-lg shadow-md">
                    <h2 class="text-base text-purple-500 font-medium uppercase">
                        Epoch #1
                    </h2>

                    <div class="pl-5">
                        <a href="/hashes/0001_public.txt" class="block text-blue-500 font-medium hover:underline">
                            0001_public.txt
                        </a>

                        <a href="/hashes/0001_public_checksum.txt" class="block text-blue-500 font-medium hover:underline">
                            0001_public_checksum.txt
                        </a>

                        <NuxtLink to="/epoch/1" class="block text-blue-500 font-medium hover:underline">
                            Attestation
                        </NuxtLink>
                    </div>

                    <section class="mt-2 w-fit px-3 py-1 border-2 border-purple-900 bg-purple-700 rounded-lg shadow">
                        <h3 class="text-purple-100 text-lg font-medium">
                            SHA-512 Proof
                        </h3>

                        <h3 class="text-purple-100 font-medium text-xs truncate">
                            6cf09a52bf6638df7f3686af6150341bc551648b50c7393bf94b2d105c78f97eca71b048d8f6d18e0e3c26f42b5a46f6e82d6db41c71f9f328c28783de600886
                        </h3>
                    </section>
                </li>
            </ol>
        </section>
    </main>

    <Footer />
</template>
