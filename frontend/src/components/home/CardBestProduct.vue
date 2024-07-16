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
    query: { color: slugs[1], size: slugs[2] }
  })
}
</script>

<template>
  <div class="flex cursor-pointer flex-wrap justify-center" @click="redirectToSneakerView(slug)">
    <img :src="image" :alt="name" class="h-[162px] w-[172px] object-contain" />
    <div class="flex flex-1 flex-col flex-wrap items-center justify-center gap-4 p-4">
      <p>{{ name }}</p>
      <p class="font-bold">{{ price }} €</p>
      <p class="bg-black px-10 py-2 font-semibold text-white">Voir le produit</p>
    </div>
  </div>
</template>
