<script setup lang="ts">
import BasePage from '@/components/BasePage.vue'
import SortMenu from '@/components/search/SortMenu.vue'
import SneakerCard from '@/components/sneakers/SneakerCard.vue'
import SneakerGrid from '@/components/sneakers/SneakerGrid.vue'
import { SneakerApi } from '@/services/sneakerApi'
import Divider from 'primevue/divider'
import Paginator, { type PageState } from 'primevue/paginator'
import { ref, watchEffect, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const sneakers: Ref<SneakerApi.SneakerOut[]> = ref([])
const totalCount = ref(0)
const currentPage = ref(1)

const searchSneakers = async (pagination: SneakerApi.PaginationIn) => {
  const data = await SneakerApi.getPaginated(pagination)
  sneakers.value = data.items
  totalCount.value = data.total
}

watchEffect(() => {
  searchSneakers({
    q: route.query.q as string,
    page: Number(route.query.page) || 1,
    sort: route.query.sort as string,
    order: route.query.order as string
  })
})

const setQueryParams = (query: Record<string, string>) => {
  router.replace({
    query: {
      ...route.query,
      ...query
    }
  })
}

const onCriteriaChange = (criteria: { sort: string; order: string }) => {
  setQueryParams({
    sort: criteria.sort,
    order: criteria.order
  })
}

const handlePageChange = (event: PageState) => {
  currentPage.value = event.page + 1
  setQueryParams({ page: currentPage.value.toString() })
}
</script>

<template>
  <BasePage>
    <div class="flex flex-1 flex-col gap-30px p-5 md:p-10">
      <div class="flex flex-col justify-between md:flex-row">
        <h1 class="text-xl font-medium">
          {{ route.query.q || 'Toutes les sneakers' }} ({{ totalCount }})
        </h1>

        <Divider class="md:hidden" />

        <div class="flex justify-between gap-10 md:justify-start">
          <button type="button">Afficher les filtres <i class="pi pi-filter"></i></button>
          <SortMenu @on-criteria-change="onCriteriaChange" />
        </div>
      </div>

      <SneakerGrid>
        <SneakerCard
          v-for="sneaker in sneakers"
          :key="sneaker._id"
          :image="sneaker.coverImage"
          :name="sneaker.name"
          :price="sneaker.price"
        />
      </SneakerGrid>

      <Paginator
        v-if="totalCount"
        :rows="sneakers.length"
        :total-records="totalCount"
        @page="handlePageChange"
      />
    </div>
  </BasePage>
</template>
