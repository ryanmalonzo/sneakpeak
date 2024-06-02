<script setup lang="ts">
import BasePage from '@/components/BasePage.vue'
import SneakerCard from '@/components/sneakers/SneakerCard.vue'
import SneakerGrid from '@/components/sneakers/SneakerGrid.vue'
import { SneakerApi } from '@/services/sneakerApi'
import Paginator, { type PageState } from 'primevue/paginator'
import { ref, watchEffect, type Ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const sneakers: Ref<SneakerApi.SneakerOut[]> = ref([])
const totalCount = ref(0)
const currentPage = ref(1)

const searchSneakers = async (query: string, page: number) => {
  const data = await SneakerApi.getPaginated({ q: query, page })
  sneakers.value = data.items
  totalCount.value = data.total
}

watchEffect(() => {
  searchSneakers(route.query.q as string, currentPage.value)
})

const handlePageChange = (event: PageState) => {
  currentPage.value = event.page + 1
}
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

      <Paginator :rows="sneakers.length" :total-records="totalCount" @page="handlePageChange" />
    </div>
  </BasePage>
</template>
