<template>
    <div v-if="show"
        class="fixed bottom-5 left-5 right-5 bg-black border border-gray-300 p-5 shadow-lg z-50 text-white">
        <p>Ce site utilise des cookies strictement nécessaires pour son bon fonctionnement. En continuant à utiliser ce
            site, vous acceptez l'utilisation de ces cookies.</p>
        <button @click="closeNotice" class="mt-3 bg-white text-black px-3 py-2 rounded">Compris</button>
    </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { onBeforeMount } from 'vue'

const show = ref(true)


onBeforeMount(() => {

    const noticeClosed = localStorage.getItem('noticeClosed');
    if (noticeClosed) {
        show.value = false;
    }
})

const closeNotice = () => {
    show.value = false;
    localStorage.setItem('noticeClosed', 'true');
}




</script>

<style scoped></style>