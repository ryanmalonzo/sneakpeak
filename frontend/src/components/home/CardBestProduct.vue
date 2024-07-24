<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{
  sneakerSlug: string
  colorSlug: string
  image: string
  name: string
  price: number
}>()

const router = useRouter()

const redirectToSneakerView = (sneakerSlug: string, colorSlug: string) => {
  router.push({
    name: 'sneakers',
    params: { slugSneaker: sneakerSlug },
    query: { color: colorSlug }
  })
}
</script>

<template>
  <div
    class="flex cursor-pointer flex-wrap justify-center"
    @click="redirectToSneakerView(sneakerSlug, colorSlug)"
  >
    <img :src="image" :alt="name" class="h-[162px] w-[172px] object-contain" />
    <div class="flex flex-1 flex-col flex-wrap items-center justify-center gap-4 p-4">
      <p>{{ name }}</p>
      <p class="font-bold">{{ price }} €</p>
      <p class="bg-black px-10 py-2 text-center font-semibold text-white">Voir le produit</p>
    </div>
  </div>
</template>
