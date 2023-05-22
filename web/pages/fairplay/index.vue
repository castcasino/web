<script setup lang="ts">
useHead({
    title: 'Fairplay — Nexa Games',
    meta: [
        { name: 'description', content: 'Nexa Gaming offers a revolutionary blockchain experience.' }
    ],
})

const router = useRouter()

const playid = ref(null)

const load = async () => {
    const play = await $fetch(`/api/plays/${playid.value}`)
        .catch(err => console.error(err))
    console.log('PLAY', play)

    if (play?.id) {
        router.push(`/fairplay/${play.id}`)
    } else {
        alert('Your Play ID is inavlid!')
    }
}


</script>

<template>
    <Header />

    <main class="max-w-5xl mx-auto my-10 px-3">
        <h1 class="text-5xl font-medium">
            Fairplay
        </h1>

        <h3 class="my-5 text-2xl lg:text-3xl lg:w-3/4 font-medium text-indigo-500">
            A fair shot at winning is everything a player wants from any gambling game.

        </h3>

        <div class="flex flex-col lg:flex-row items-start gap-4">
            <div class="order-2 lg:order-none">
                <p class="my-5">
                    We all want to play at fair, trustworthy online gambling sites.

                </p>

                <p class="my-5">
                    The Crypto gambling community has come up with its own way of proving that games are fair.
                    As you might expect, with this being specific to Crypto, it doesn’t require you to trust a third party, it makes games totally transparent, and it makes use of advanced cryptography to ensure game outcomes haven’t been tampered with.
                    Using the provably fair method, you can verify the results for yourself in real time.

                </p>

                <p class="my-5">
                    But what exactly is provably fair gambling? How does it work? Why does it make Crypto gambling so transparent? We’re going to explore all of that here.
                    As you’ll see, the ramifications of provably fair gambling are revolutionary.

                </p>

                <p class="my-5">
                    Much like Crypto itself, provably fair solutions work on the problem of trust.
                    You no longer need a middleman or third party to verify that a casino’s algorithm is fair.
                    Since you have intervened in the process of a game outcome by providing a seed which changes something, the casino is no longer fully in control.

                </p>

                <p class="my-5">
                    You should never trust any online entity at face value.
                    Luckily for casino players, there are third parties set up with the sole purpose of verifying the published payout figures through testing.

                    eCOGRA is an example of one such third party.
                    This organization tests many casino games and published reports on whether or not the claims of the software providers match up with the facts.

                </p>

                <p class="my-5">
                    We all want to play at fair, trustworthy online gambling sites.

                </p>

                <section class="hidden">
                    <h2 class="text-xl font-medium">
                        Hashes Lists <em>(by Epoch)</em>
                    </h2>

                    <blockquote class="text-sm text-gray-500 w-1/2">
                        Hashes and attestations may be independently verified by ANY available <span class="text-indigo-500 font-medium">SHA-512</span> or <span class="text-indigo-500 font-medium">SHA-1</span> calculators.
                        We recommend <NuxtLink to="https://md5file.com/calculator" target="_blank" class="text-blue-500 font-medium hover:underline">https://md5file.com/calculator</NuxtLink> and <NuxtLink to="https://emn178.github.io/online-tools/sha1.html" target="_blank" class="text-blue-500 font-medium hover:underline">https://emn178.github.io/online-tools/sha1.html</NuxtLink> respectively.
                    </blockquote>

                    <ol class="mt-5">
                        <li class="w-fit px-3 py-2 bg-purple-100 border-2 border-purple-300 rounded-lg shadow-md">
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

                            <section class="mt-2 w-full lg:w-96 px-3 py-1 border-2 border-purple-900 bg-purple-700 rounded-lg shadow">
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

            </div>

            <div class="w-full order-1 lg:w-96 py-5 flex flex-col justify-center gap-4">
                <input
                    type="text"
                    v-model="playid"
                    placeholder="Type or copy/paste your Play ID here"
                    class="w-full lg:w-96 py-2 px-5 bg-yellow-100 border-2 border-yellow-300 text-lg text-yellow-900 placeholder-yellow-900 rounded-lg"
                />

                <button @click="load" class="py-2 bg-blue-200 border-2 border-blue-400 text-2xl font-medium rounded-lg shadow hover:bg-blue-300">
                    Load Play
                </button>
            </div>
        </div>
    </main>

    <Footer />
</template>
