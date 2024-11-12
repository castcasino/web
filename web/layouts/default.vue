<script setup lang="ts">
useHead({
    // title: 'Blank — Cast Casino',
    // meta: [
    //     { name: 'description', content: 'Nexa Gaming offers a revolutionary blockchain experience.' }
    // ],
})
</script>

<template>
    <Header />

    <main class="px-3">
        <slot />
    </main>

    <Footer />
</template>
