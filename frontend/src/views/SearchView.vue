<script setup lang="ts">
import BasePage from '@/components/BasePage.vue'
import SneakerCard from '@/components/sneakers/SneakerCard.vue'
import SneakerGrid from '@/components/sneakers/SneakerGrid.vue'
import { SneakerApi } from '@/services/sneakerApi'
import { ref, watchEffect, type Ref } from 'vue'
import { useRoute } from 'vue-router'

interface SneakerOut {
  _id: string
  coverImage: string
  name: string
  price: number
}

const route = useRoute()

const sneakers: Ref<SneakerOut[]> = ref([])
const totalCount = ref(0)

const searchSneakers = async (query: string) => {
  const data = await SneakerApi.get(query)
  sneakers.value = data.items
  totalCount.value = data.total
}

watchEffect(() => {
  searchSneakers(route.query.q as string)
})
</script>

<template>
  <BasePage>
    <div class="flex flex-1 flex-col gap-30px px-30px py-5 md:p-10">
      <h1 class="text-xl font-medium">
        {{ route.query.q || 'Toutes les sneakers' }} ({{ totalCount }})
      </h1>

      <SneakerGrid>
        <SneakerCard
          v-for="sneaker in sneakers"
          :key="sneaker._id"
          :image="sneaker.coverImage"
          :name="sneaker.name"
          :price="sneaker.price"
        />
      </SneakerGrid>
    </div>
  </BasePage>
</template>
