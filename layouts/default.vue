<template>
    <main class="w-screen h-screen overflow-hidden flex flex-col justify-between bg-gradient-to-l from-slate-600 to-slate-800">
        <section class="w-full sm:w-[640px] mx-auto bg-gradient-to-r from-slate-50 to-slate-200 flex-1 overflow-y-scroll">
            <Header />

            <slot />

            <!-- <Footer /> -->
        </section>
    </main>
</template>
