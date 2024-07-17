<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{
  slug: string
  image: string
  name: string
  price: number
}>()

const router = useRouter()

const redirectToSneakerView = (slug: string) => {
  const slugs = slug.split('|')
  router.push({
    name: 'sneakers',
    params: { slugSneaker: slugs[0] },
    query: { color: slugs[1] }
  })
}
</script>

<template>
  <div class="flex justify-center align-middle">
    <div
      class="flex h-auto w-[264px] shrink-0 cursor-pointer flex-col justify-center gap-2 text-center transition-transform duration-200 ease-in-out hover:scale-105"
      @click="redirectToSneakerView(slug)"
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
