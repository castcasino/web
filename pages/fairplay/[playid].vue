<script setup lang="ts">
/* Import modules. */
import formatPosition from './_formatPosition.js'
import moment from 'moment'
import numeral from 'numeral'

const route = useRoute()

const game = ref(null)
const gameid = ref(null)
const play = ref(null)
const playid = ref(null)
const entropy = ref(null)

const title = ref(null)
const summary = ref(null)
const url    = ref(null)

const outcome = ref(null)
const payout = ref(null)
const playerJoy = ref(null)
const position = ref(null)
const rtp = ref(null)

const satoshis = ref(null)
const wagerNEX = ref(null)

playid.value = route.params.playid
console.log('PLAY ID', playid.value)

const keyHash = computed(() => {
    if (entropy.value) {
        return sha512(sha512(entropy.value))
    } else {
        return null
    }
})

/**
 * Load Play
 */
const loadPlay = async () => {
    play.value = await $fetch(`/api/plays/${playid.value}`)
        .catch(err => console.error(err))
    console.log('PLAY', play.value)

    if (typeof play.value === 'undefined') {
        const decoded = decodeAddress(playid.value)
        const hash = binToHex(decoded.hash)
        const pubKeyHash = hash.slice(8)

        play.value = await $fetch(`/api/plays/${pubKeyHash}`)
            .catch(err => console.error(err))
        console.log('(re-)PLAY', play.value)
    }

    gameid.value = play.value?.gameid
    entropy.value = play.value?.entropy

    payout.value = play.value?.payout + 'X'

    if (typeof play.value?.playerJoy !== 'undefined') {
        playerJoy.value = play.value.playerJoy
    }

    if (typeof play.value?.outcome !== 'undefined') {
        outcome.value = (play.value.outcome).toFixed(2)
    }

    if (typeof play.value?.satoshis !== 'undefined') {
        satoshis.value = play.value.satoshis

        wagerNEX.value = numeral(play.value.satoshis / 100.0).format('0,0.00')
    }

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
                v-if="playerJoy !== null"
                title="Player Joy"
                :value="playerJoy ? 'WIN' : 'LOSS'"
            />

            <FairplayItem
                v-if="outcome !== null"
                title="Play Outcome"
                :value="outcome || 'n/a'"
            />

            <FairplayItem
                v-if="wagerNEX !== null"
                title="Wager ( in ETH )"
                :value="wagerNEX || 'n/a'"
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
                title="Average Return To Player ( RTP )"
                :value="rtp || 'n/a'"
            />

            <FairplayItem
                title="Play Created"
                :value="play?.createdAt ? moment(play.createdAt).fromNow() : 'loading...'"
            />

            <FairplayItem
                title="Play Completed"
                :value="play?.updatedAt ? moment(play.updatedAt).fromNow() : 'waiting for play...'"
            />

            <NuxtLink
                v-if="play?.txidem"
                :to="'/' + play.txidem" target="_blank"
            >
                <FairplayFeature

                    title="Transaction Idem"
                    :value="play.txidem || 'n/a'"
                />
            </NuxtLink>

            <hr class="my-5" />

            <FairplayItem
                title="Player ID / Wallet"
                :value="play?.playerid || 'n/a'"
            />

            <FairplayFeature
                title="Player Seed"
                :value="play?.seed"
            />

            <hr class="my-5" />

            <FairplayItem
                title="Gameplay Address"
                :value="play?.address || 'n/a'"
            />

            <FairplayItem
                title="Entropy"
                :value="entropy || 'n/a'"
            />

            <FairplayItem
                title="Mnemonic"
                :value="play?.mnemonic || 'n/a'"
            />

            <FairplayFeature
                title="Server Entropy (Private Key) Hash"
                :value="keyHash || 'n/a'"
            />

        </div>

    </main>
</template>
