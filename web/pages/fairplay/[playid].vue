<script setup lang="ts">
useHead({
    title: 'Fairplay — Nexa Games',
    meta: [
        { name: 'description', content: 'Nexa Gaming offers a revolutionary blockchain experience.' }
    ],
})

const route = useRoute()


const game = ref(null)
const gameid = ref(null)
const play = ref(null)
const playid = ref(null)

const summary = ref(null)
const title = ref(null)

const payout = ref(null)
const position = ref(null)

playid.value = route.params.playid
console.log('PLAY ID', playid.value)

/**
 * Load Play
 */
const loadPlay = async () => {
    play.value = await $fetch(`/api/plays/${playid.value}`)
        .catch(err => console.error(err))
    console.log('PLAY', play.value)

    gameid.value = play.value?.gameid
    payout.value = play.value?.payout + '%'
    position.value = play.value?.position.toString()

    if (gameid.value) {
        /* Load game. */
        loadGame(gameid.value)
    }
}

/**
 * Load Game
 */
const loadGame = async () => {
    game.value = await $fetch(`/api/games/${gameid.value}`)
    console.log('GAME', game.value)

    title.value = game.value?.title
    summary.value = game.value?.summary
}

loadPlay(playid)

</script>

<template>
    <Header />

    <main class="max-w-5xl mx-auto my-10 px-3">

        <section class="px-2 py-1 bg-yellow-200 border-2 border-yellow-400 rounded-lg shadow">
            <h3 class="text-xs text-yellow-700 font-medium uppercase">
                Fairplay Summary for Play ID
            </h3>

            <h2 class="text-sm text-yellow-900 font-bold font-mono tracking-wide truncate">
                {{playid}}
            </h2>
        </section>

        <h1 class="my-5 text-5xl font-medium">
            {{title || 'loading...'}}
        </h1>

        <p class="my-5">
            {{summary || 'loading...'}}
        </p>

        <div class="flex flex-col gap-4">
            <FairplayItem
                title="Player Payout"
                :value="payout || 'n/a'"
            />

            <FairplayItem
                title="Player Position"
                :value="position || 'n/a'"
            />

            <FairplayItem
                title="Return To Player"
                value="97%"
            />

        </div>


        <pre class="font-mono">
{{play}}
        </pre>
        <hr />
        <pre class="font-mono">
{{game}}
        </pre>
    </main>

    <Footer />
</template>
