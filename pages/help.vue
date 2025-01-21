<script setup lang="ts">
import { ref } from 'vue'

/* Initialize stores. */
import { useSystemStore } from '@/stores/system'

/* Initialize System. */
const System = useSystemStore()

useHead({
    title: 'Help — Cast Casino',
    meta: [
        { name: 'description', content: 'Cast Casino offers a revolutionary blockchain experience.' }
    ],
})

const treasuryBalance = ref(0)

const treasuryAddress = 'TBD'

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

        <NuxtLink to="" target="_blank" class="text-blue-500 font-medium hover:underline">
            TBD
        </NuxtLink>
    </main>
</template>
