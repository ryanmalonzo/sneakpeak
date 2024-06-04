<script setup lang="ts">
import BasePage from '@/components/BasePage.vue'
import FilterOptions from '@/components/search/FilterOptions.vue'
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
    page: currentPage.value,
    sort: route.query.sort as string,
    order: route.query.order as string,
    q: route.query.q as string
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
    <!-- Sidebar -->
    <FilterOptions />
    <!-- Main content -->
    <section class="relative flex flex-1 flex-col gap-30px px-5 pb-5 md:px-10 md:pb-10">
      <div
        class="sticky top-[64.5px] z-40 flex flex-col justify-between bg-white pb-2.5 pt-5 md:flex-row md:pb-5 md:pt-10"
      >
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
          :image="sneaker.variants[0].image"
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
    </section>
  </BasePage>
</template>
