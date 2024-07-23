<script setup lang="ts">
import BasePage from '@/components/BasePage.vue'
import FilterOptions from '@/components/search/FilterOptions.vue'
import SortMenu from '@/components/search/SortMenu.vue'
import SneakerCard from '@/components/sneakers/SneakerCard.vue'
import SneakerGrid from '@/components/sneakers/SneakerGrid.vue'
import { SneakerApi } from '@/services/sneakerApi'
import Divider from 'primevue/divider'
import Paginator, { type PageState } from 'primevue/paginator'
import { ref, watch, watchEffect, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const filterOptionsOpen = ref(false)
const variants: Ref<SneakerApi.FlattenedVariantOut[]> = ref([])
const totalCount = ref(0)
const currentPage = ref(route.query.page ? parseInt(route.query.page as string) : 1)

const DEFAULT_LIMIT = 25

const searchSneakers = async (pagination: SneakerApi.PaginationIn) => {
  const data = await SneakerApi.getVariantsPaginated(pagination)
  variants.value = data.items
  totalCount.value = data.total
}

watchEffect(() => {
  searchSneakers({
    page: currentPage.value,
    sort: route.query.sort as string,
    order: route.query.order as string,
    q: route.query.q as string,
    brand: route.query.brand as string,
    category: route.query.category as string,
    price: route.query.price as string,
    'variants.name': route.query.color as string,
    'variants.sizes.name': route.query.size as string
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

// Set current page back to 1 when filters change
watch(
  [
    () => route.query.brand,
    () => route.query.category,
    () => route.query.color,
    () => route.query.size,
    () => route.query.price
  ],
  () => {
    currentPage.value = 1
    setQueryParams({ page: currentPage.value.toString() })
  }
)

const onCriteriaChange = (criteria: { sort: string; order: string }) => {
  // Reset page to 1 when sorting changes
  currentPage.value = 1

  setQueryParams({
    sort: criteria.sort,
    order: criteria.order,
    page: '1'
  })
}

const handlePageChange = (event: PageState) => {
  currentPage.value = event.page + 1
  setQueryParams({ page: currentPage.value.toString() })
}

const handleFilterOptionsOpen = (value: boolean) => {
  filterOptionsOpen.value = value
}

if (
  route.query.brand ||
  route.query.category ||
  route.query.price ||
  route.query.color ||
  route.query.size
) {
  filterOptionsOpen.value = true
}
</script>

<template>
  <BasePage>
    <!-- Sidebar -->
    <FilterOptions :open="filterOptionsOpen" @open="handleFilterOptionsOpen" />
    <!-- Main content -->
    <section class="relative flex flex-1 flex-col gap-30px px-5 pb-5 md:px-10 md:pb-10">
      <div
        class="sticky top-[64.5px] z-40 flex flex-col justify-between bg-white pb-2.5 pt-5 md:top-[66px] md:flex-row md:pb-5 md:pt-10"
      >
        <h1 class="text-xl font-medium">
          {{ route.query.q || 'Toutes les sneakers' }} ({{ totalCount }})
        </h1>

        <div class="md:hidden">
          <Divider />
        </div>

        <div class="flex justify-between gap-10 md:justify-start">
          <button type="button" @click="filterOptionsOpen = !filterOptionsOpen">
            {{ filterOptionsOpen ? 'Masquer' : 'Afficher' }} les filtres
            <i class="pi pi-filter"></i>
          </button>
          <SortMenu @on-criteria-change="onCriteriaChange" />
        </div>
      </div>

      <SneakerGrid>
        <SneakerCard
          v-for="variant in variants"
          :key="variant.sizeSlug"
          :image="variant.variantImage"
          :name="variant.sneakerName"
          :price="variant.sneakerPrice"
          :slug="variant.sneakerSlug"
        />
      </SneakerGrid>

      <Paginator
        v-if="totalCount"
        :first="DEFAULT_LIMIT * (currentPage - 1)"
        :rows="DEFAULT_LIMIT"
        :total-records="totalCount"
        @page="handlePageChange"
      />
    </section>
  </BasePage>
</template>
