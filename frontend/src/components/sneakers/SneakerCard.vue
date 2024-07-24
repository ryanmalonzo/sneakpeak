<script setup lang="ts">
const { color } = defineProps<{
  image: string | undefined
  name: string
  price: number
  color: string
  sneakerSlug: string
  colorSlug: string
}>()

import { useRouter } from 'vue-router'

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
    class="flex cursor-pointer flex-col items-center gap-3 transition-transform duration-200 ease-in-out hover:scale-105"
    id="sneaker-card"
    @click="redirectToSneakerView(sneakerSlug, colorSlug)"
  >
    <img
      :src="image"
      :alt="name"
      class="h-[105px] w-[159px] rounded-[10px] object-cover md:h-[144px] md:w-[264px]"
      id="cover"
    />
    <div class="flex flex-col text-center">
      <p>{{ name }}</p>
      <p class="text-sm font-bold">{{ price }} €</p>
      <small class="text-sm text-orange-500">{{ color }}</small>
    </div>
  </div>
</template>

<style scoped>
#cover {
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset;
}
</style>
