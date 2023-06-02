<script setup lang="ts">
/* Define properties. */
const props = defineProps({
    title: String,
    value: String,
})
</script>

<template>
    <main class="w-fit px-3 py-2 bg-rose-200 border-2 border-rose-400 rounded-lg shadow-md">
        <h4 class="text-sm text-gray-500 font-medium uppercase">
            {{title}}
        </h4>

        <h2 class="text-2xl font-medium">
            {{value}}
        </h2>
    </main>
</template>
