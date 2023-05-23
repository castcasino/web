<script setup lang="ts">
/* Import modules. */
import moment from 'moment'
import formatPosition from './_formatPosition.js'

const route = useRoute()

const game = ref(null)
const gameid = ref(null)
const play = ref(null)
const playid = ref(null)

const title = ref(null)
const summary = ref(null)
const url    = ref(null)

const payout = ref(null)
const rtp = ref(null)
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

    rtp.value = play.value?.rtp + '%'

    /* Handle (player) position. */
    position.value = formatPosition(play.value?.position.toString())

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

    url.value = game.value?.url
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

        <h1 class="mt-5 mb-1 text-5xl font-medium">
            {{title || 'Anon'}}
        </h1>

        <NuxtLink :to="url" class="ml-2 text-blue-500 font-medium tracking-widest hover:underline">
            {{url || '...'}}
        </NuxtLink>

        <p class="my-5">
            {{summary || 'loading summary...'}}
        </p>

        <div class="flex flex-col gap-4">
            <FairplayItem
                title="Play Outcome"
                :value="play?.outcome || 'n/a'"
            />

            <FairplayItem
                title="Wager"
                :value="play?.satoshis || 'n/a'"
            />

            <FairplayItem
                title="Player Joy"
                :value="play?.playerJoy ? 'WIN' : 'LOSS'"
            />

            <FairplayItem
                title="Player Payout"
                :value="payout || 'n/a'"
            />

            <FairplayItem
                title="Player Position"
                :value="position || 'n/a'"
            />

            <FairplayItem
                title="Average Return To Player (RTP)"
                :value="rtp || 'n/a'"
            />

            <FairplayItem
                title="Play Created"
                :value="play?.createdAt ? moment(play.createdAt).fromNow() : 'n/a'"
            />

            <FairplayItem
                title="Play Completed"
                :value="play?.updatedAt ? moment(play.updatedAt).fromNow() : 'n/a'"
            />

            <FairplayItem
                title="Address"
                :value="play?.address || 'n/a'"
            />

            <FairplayItem
                title="Entropy"
                :value="play?.entropy || 'n/a'"
            />

            <FairplayItem
                title="Mnemonic"
                :value="play?.mnemonic || 'n/a'"
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
