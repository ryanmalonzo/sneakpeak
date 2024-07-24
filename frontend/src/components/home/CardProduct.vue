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
  <div class="flex justify-center align-middle">
    <div
      class="flex h-auto w-[264px] shrink-0 cursor-pointer flex-col justify-center gap-2 text-center transition-transform duration-200 ease-in-out hover:scale-105"
      @click="redirectToSneakerView(sneakerSlug, colorSlug)"
    >
      <img :src="image" :alt="name" />
      <p>{{ name }}</p>
      <p class="font-bold">{{ price }} €</p>
    </div>
  </div>
</template>

<style scoped>
img {
  width: 100%;
  height: 144px;
  object-fit: cover;
}
</style>
