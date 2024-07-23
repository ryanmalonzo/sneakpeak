<template>
  <div
    v-if="show"
    class="fixed bottom-5 left-5 right-5 z-50 flex flex-col gap-2.5 border border-gray-300 bg-black p-5 text-white shadow-lg"
  >
    <p>
      Ce site utilise des cookies strictement nécessaires pour son bon fonctionnement. En continuant
      à utiliser ce site, vous acceptez l'utilisation de ces cookies.
    </p>
    <RouterLink to="/legal/politique-de-cookies" class="text-blue-500 underline">
      Politique de cookies
    </RouterLink>
    <button @click="closeNotice" class="self-start rounded bg-white px-3 py-2 text-black">
      Compris
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onBeforeMount } from 'vue'

const show = ref(true)

onBeforeMount(() => {
  const noticeClosed = localStorage.getItem('noticeClosed')
  if (noticeClosed) {
    show.value = false
  }
})

const closeNotice = () => {
  show.value = false
  localStorage.setItem('noticeClosed', 'true')
}
</script>

<style scoped></style>

