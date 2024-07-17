<script setup lang="ts">
import BasePage from '@/components/BasePage.vue'
import { RouterLink, useRoute } from 'vue-router'

import { ref, onMounted } from 'vue'

const reference = ref('')

onMounted(async () => {
  const route = useRoute()
  reference.value = route.params.reference as string
})
</script>

<template>
  <BasePage>
    <div class="my-auto h-full w-full text-center">
      <h1 class="text-2xl font-semibold">Merci pour votre commande</h1>

      <p class="mt-4">Votre commande a été traitée avec succès.</p>

      <button type="button" class="my-4 bg-black p-3 px-5 text-white">
        <RouterLink :to="'/profile/orders/' + reference">
          Voir les détails de la commande
        </RouterLink>
      </button>
    </div>
  </BasePage>
</template>

<style scoped></style>
