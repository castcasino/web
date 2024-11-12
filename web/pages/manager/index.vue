<script setup lang="ts">
/* Initialize stores. */
import { useSystemStore } from '@/stores/system'
/* Initialize stores. */
import { useProfileStore } from '@/stores/profile'

/* Initialize Profile. */
const Profile = useProfileStore()


/* Initialize System. */
const System = useSystemStore()

useHead({
    title: 'Manager Login — Cast Casino',
    meta: [
        { name: 'description', content: 'Nexa Gaming offers a revolutionary blockchain experience.' }
    ],
})

const sessionid = ref(null)

const signin = () => {
    Profile.saveSession({
        id: sessionid.value,
    })
}

const signout = () => {
    Profile.deleteSession()
}

</script>

<template>
    <main class="max-w-5xl mx-auto my-10 flex flex-col gap-8">
        <header class="mx-3">
            <h1 class="text-5xl font-medium">
                Manager Login
            </h1>

        </header>

        <section class="mx-3">
            <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id eius voluptatem minus natus at eveniet dolorum eos mollitia, maxime animi excepturi harum omnis illum odit recusandae pariatur! Unde, explicabo molestias.
            </p>

        </section>

        <section class="mx-3 px-3 py-3 flex flex-col gap-4 bg-gray-100 border-2 border-gray-300 rounded-lg shadow-md">
            <h2 class="text-xl font-medium">
                Session Authorization
            </h2>

            <h3>
                SID -> {{Profile.sessionid}}
            </h3>

            <input
                type="text"
                placeholder="Enter a session id here"
                v-model="sessionid"
                class="px-3 py-1 text-2xl font-medium bg-yellow-100 border-2 border-yellow-300 rounded-lg shadow"
            />

            <button v-if="!Profile.session" @click="signin" class="px-5 py-2 w-fit bg-blue-200 border-2 border-blue-400 text-2xl font-medium rounded-lg shadow hover:bg-blue-300">
                Sign In
            </button>

            <button v-if="Profile.session" @click="signout" class="px-5 py-2 w-fit bg-red-200 border-2 border-red-400 text-2xl font-medium rounded-lg shadow hover:bg-red-300">
                Sign Out
            </button>
        </section>

    </main>
</template>
