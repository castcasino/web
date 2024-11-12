<script setup lang="ts">
import { getAddressBalance } from '@nexajs/rostrum'
import { ref } from 'vue'

/* Initialize stores. */
import { useSystemStore } from '@/stores/system'

/* Initialize System. */
const System = useSystemStore()

useHead({
    title: 'Help — Cast Casino',
    meta: [
        { name: 'description', content: 'Nexa Gaming offers a revolutionary blockchain experience.' }
    ],
})

const treasuryBalance = ref(0)

const treasuryAddress = 'nexa:nqtsq5g5avzufcrcw00jnpwyq9m5fe6rmwgty5fzaaqlngh5'

const getBalance = async () => {
    const balance = await $fetch(`/api/balance/${treasuryAddress}`)
        .catch(err => console.error(err))
    console.log('BALANCE', balance)

    if (balance) {
        treasuryBalance.value = balance.confirmed + balance.unconfirmed
    }
}

getBalance()
</script>

<template>
    <main class="max-w-5xl mx-auto my-10">
        <h1 class="text-5xl font-medium">
            Help &amp; Support
        </h1>

        <p>
            We're here to help you 24x7x365
        </p>

        <h2 class="text-2xl font-medium">
            Game Treasury Address
        </h2>

        <h2 class="text-2xl font-medium">
            Balance: {{treasuryBalance}}
        </h2>

        <NuxtLink to="https://explorer.nexa.org/address/nexa:nqtsq5g5avzufcrcw00jnpwyq9m5fe6rmwgty5fzaaqlngh5" target="_blank" class="text-blue-500 font-medium hover:underline">
            nexa:nqtsq5g5avzufcrcw00jnpwyq9m5fe6rmwgty5fzaaqlngh5
        </NuxtLink>
    </main>
</template>
