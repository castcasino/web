<script setup lang="ts">
useHead({
    title: 'Cast Casino — Casual Blockchain Gaming',
    meta: [
        { name: 'description', content: 'Cast Casino offers a premium blockchain gaming experience for Players over 18+.' }
    ],
})
</script>

<template>
    <main class="bg-white">
        <!-- Hero section -->
        <div class="relative pt-5">
            <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100"></div>

            <div class="mx-auto max-w-7xl sm:px-6">
                <div class="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
                    <div class="absolute inset-0">
                        <img
                            class="h-full w-full object-cover"
                            src="https://images.unsplash.com/photo-1592398191627-25b41eeaa398?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80"
                            alt="Casino room"
                        />
                        <div class="absolute inset-0 bg-gradient-to-r from-purple-800 to-indigo-700 mix-blend-multiply"></div>
                    </div>

                    <div class="relative px-4 py-16 sm:px-6 sm:py-24">
                        <h1 class="text-center font-bold tracking-tight">
                            <span class="block text-white text-5xl">
                                Cast Casino
                            </span>

                            <span class="block text-indigo-200 text-4xl sm:text-5xl">
                                Casual &amp; Provably Fair Gaming
                            </span>
                        </h1>

                        <p class="mx-auto mt-6 max-w-lg text-center text-xl text-indigo-200 sm:max-w-3xl">
                            Join the excitement in our growing community of real-money Gamers and the talented Creators who build &amp; publish the games they love.
                        </p>

                        <div class="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                            <div class="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                                <NuxtLink to="/gallery" class="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-2xl font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 sm:px-8">
                                    Browse Games
                                </NuxtLink>

                                <a href="javascript://" class="flex items-center justify-center rounded-md border border-transparent bg-indigo-500 bg-opacity-60 px-4 py-3 text-2xl font-medium text-white shadow-sm hover:bg-opacity-70 sm:px-8">
                                    Watch a demo
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Alternating Feature Sections -->
        <div class="relative overflow-hidden py-16">
            <div aria-hidden="true" class="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-gray-100"></div>

            <div class="relative">
                <div class="">
                    <div class="mx-auto max-w-xl px-4 sm:px-6">
                        <div>
                            <div>
                                <span class="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600">
                                    <!-- Heroicon name: outline/inbox -->
                                    <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
                                        />
                                    </svg>
                                </span>
                            </div>

                            <div class="mt-6">
                                <h2 class="text-3xl font-bold tracking-tight text-gray-900">
                                    Coincun Game Engine (CGE) GUARANTEES 100% <em class="text-indigo-500">Provably Fair</em> Gameplay
                                </h2>

                                <p class="mt-4 text-lg text-gray-500">
                                    Every game play MUST pass through the CGE to protect Players from code bugs and malware.
                                    The CGE protects both Players and Bankers by offering mathematical proofs and/or hardware attestations for every action executed by the engine.
                                </p>

                                <div class="mt-6">
                                    <NuxtLink to="/fairplay"
                                        class="inline-flex rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-2xl font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                                    >
                                        Learn more
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>

                        <div class="mt-8 border-t border-gray-200 pt-6">
                            <blockquote>
                                <div>
                                    <p class="text-base text-gray-500">
                                        &ldquo;CGE made it possible to monetize my 3yr old indie game; and be able to support myself and the rest of my team to continue living out our dreams.&rdquo;
                                    </p>
                                </div>

                                <footer class="mt-3">
                                    <div class="flex items-center space-x-3">
                                        <div class="flex-shrink-0">
                                            <img class="h-6 w-6 rounded-full" src="https://images.unsplash.com/photo-1509783236416-c9ad59bae472?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80" alt="" />
                                        </div>

                                        <div class="text-base font-medium text-gray-700">
                                            Londynn Lee, Homemade Crypto
                                        </div>
                                    </div>
                                </footer>
                            </blockquote>
                        </div>
                    </div>

                    <div class="mt-12 sm:mt-16">
                        <div class="-mr-48 pl-4 sm:pl-6 md:-mr-16">
                            <img
                                class="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5"
                                src="~/assets/coincun-game-engine.jpg"
                                alt="Coincun Game Engine"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-24">
                <div class="">
                    <div class="mx-auto max-w-xl px-4 sm:px-6">
                        <div>
                            <div>
                                <span class="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600">
                                    <!-- Heroicon name: outline/sparkles -->
                                    <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                                        />
                                    </svg>
                                </span>
                            </div>

                            <div class="mt-6">
                                <h2 class="text-3xl font-bold tracking-tight text-gray-900">
                                    All games are published as Free and Open Source Software (FOSS)
                                </h2>

                                <p class="mt-4 text-lg text-gray-500">
                                    Our team believes in <span class="font-medium text-indigo-500">"transparency first"</span>; and so ALL games are hosted via IPFS and built from open-source repositories.
                                </p>

                                <p class="mt-4 text-lg text-gray-500">
                                    The <span class="font-medium text-indigo-500">Coincun Professionals Network (CPN)</span> supports our Players to receive the MOST up-to-date and accurate safety &amp; security assurances from the MOST trusted names in Crypto gaming.
                                </p>

                                <div class="mt-6">
                                    <NuxtLink
                                        to="https://github.com/nyusternie/" target="_blank"
                                        class="inline-flex rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-2 text-2xl font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                                    >
                                        View the CGE source
                                    </NuxtLink>

                                    <em class="block w-2/3 my-2 text-sm text-gray-500">
                                        The Coincun Game Engine (CGE) is temporarily closed-source until Beta release.
                                        Sorry for any inconvenience.
                                    </em>
                                </div>

                                <div class="mt-6">
                                    <NuxtLink
                                        to="https://github.com/nyusternie/" target="_blank"
                                        class="inline-flex rounded-md border border-transparent bg-yellow-600 bg-origin-border px-4 py-2 text-xl font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                                    >
                                        View the Cast Poker source
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-12 sm:mt-16">
                        <div class="-ml-48 pr-4 sm:pr-6 md:-ml-16">
                            <img
                                class="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5"
                                src="~/assets/open-source-code.jpg"
                                alt="Customer profile user interface"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Stats section -->
        <div class="relative bg-gray-900">
            <div class="absolute inset-x-0 bottom-0 h-80 xl:top-0 xl:h-full">
                <div class="h-full w-full xl:grid xl:grid-cols-2">
                    <div class="h-full xl:relative xl:col-start-2">
                        <img
                            class="h-full w-full object-cover opacity-25 xl:absolute xl:inset-0"
                            src="https://images.unsplash.com/photo-1561414927-6d86591d0c4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80"
                            alt="People working on laptops"
                        />
                        <div aria-hidden="true" class="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-900 xl:inset-y-0 xl:left-0 xl:h-full xl:w-32 xl:bg-gradient-to-r"></div>
                    </div>
                </div>
            </div>

            <div class="mx-auto max-w-4xl px-4 sm:px-6">
                <div class="relative pt-12 pb-64 sm:pt-24 sm:pb-64 xl:col-start-1 xl:pb-24">
                    <h2 class="text-2xl font-semibold">
                        <span class="bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                            Monetization for Gamemakers
                        </span>
                    </h2>

                    <p class="mt-3 text-3xl font-bold tracking-tight text-white">
                        Join the #1 gaming community that's ready to GET YOU PAID!
                    </p>

                    <p class="mt-5 text-lg text-gray-300">
                        We want you to continue building your wildest dreams; and that's why Cast Casino offers a comprehensive suite of monetization tools &amp; services to best suit your individual/team's needs.
                    </p>
                    <div class="mt-12 grid grid-cols-1 gap-y-12 gap-x-6 sm:grid-cols-2">
                        <p>
                            <span class="block text-4xl font-bold text-white">3</span>
                            <span class="mt-1 block text-base text-gray-300"><span class="font-medium text-white">Developers building</span> the next BIG blockbuster game using CGE.</span>
                        </p>

                        <p>
                            <span class="block text-4xl font-bold text-white">$200+</span>
                            <span class="mt-1 block text-base text-gray-300"><span class="font-medium text-white">Paid out</span> to all the players, brokers and promoters.</span>
                        </p>

                        <p>
                            <span class="block text-4xl font-bold text-white">98%</span>
                            <span class="mt-1 block text-base text-gray-300"><span class="font-medium text-white">Players returning</span> for more action after their 1st play.</span>
                        </p>

                        <p>
                            <span class="block text-4xl font-bold text-white">100+</span>
                            <span class="mt-1 block text-base text-gray-300"><span class="font-medium text-white">Countries</span> where we are licensed to offer real-money gaming services.</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- CTA Section -->
        <div class="bg-white">
            <div class="mx-auto max-w-4xl py-16 px-4 sm:px-6 sm:py-24">
                <h2 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    <span class="block">
                        Ready to start playing?
                    </span>

                    <span class="-mb-1 block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text pb-1 text-transparent">
                        Choose a game you like and GO!
                    </span>
                </h2>

                <div class="mt-6 space-y-4 sm:flex sm:space-y-0 sm:space-x-5">
                    <NuxtLink
                        to="/gallery"
                        class="flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-3 text-2xl font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700"
                    >
                        Browse the games
                    </NuxtLink>

                    <NuxtLink to="https://docs.cast.casino" target="_blank" class="flex items-center justify-center rounded-md border border-transparent bg-indigo-50 px-4 py-3 text-2xl font-medium text-indigo-800 shadow-sm hover:bg-indigo-100">
                        Learn more
                    </NuxtLink>
                </div>
            </div>
        </div>
    </main>
</template>
