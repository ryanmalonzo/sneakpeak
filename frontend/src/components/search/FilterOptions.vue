<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { ref, watchEffect, type Ref } from 'vue'
import { BrandApi } from '@/services/brandApi'
import { CategoryApi } from '@/services/categoryApi'
import Checkbox from 'primevue/checkbox'
import Slider from 'primevue/slider'
import { useRoute, useRouter } from 'vue-router'

defineProps<{
  open: boolean
}>()

const emit = defineEmits(['open'])

const router = useRouter()
const route = useRoute()

const breakpoints = useBreakpoints(breakpointsTailwind)

const getOpenClasses = () => {
  if (breakpoints.smaller('md').value) {
    return 'absolute top-0 left-0 z-[60]'
  }
  return 'sticky top-[66px]'
}

const brands: Ref<BrandApi.BrandOut[]> = ref([])
const selectedBrands: Ref<string[]> = ref([])

const categories: Ref<CategoryApi.CategoryOut[]> = ref([])
const selectedCategories: Ref<string[]> = ref([])

const DEFAULT_PRICE_RANGE = [0, 500]
const price: Ref<number[]> = ref(DEFAULT_PRICE_RANGE)

// Set selected filters from URL
if (route.query.brand) {
  selectedBrands.value = (route.query.brand as string).split(',')
}
if (route.query.category) {
  selectedCategories.value = (route.query.category as string).split(',')
}
if (route.query.price) {
  price.value = (route.query.price as string).split(',').map(Number)
}

Promise.all([BrandApi.getAll(), CategoryApi.getAll()]).then(([brandsData, categoriesData]) => {
  brands.value = brandsData
  categories.value = categoriesData
})

watchEffect(() => {
  const query = {
    brand: selectedBrands.value.length ? selectedBrands.value.join(',') : undefined,
    category: selectedCategories.value.length ? selectedCategories.value.join(',') : undefined
  }

  router.replace({
    query: {
      ...route.query,
      ...query
    }
  })
})

const getBrandsHeader = () => {
  if (!selectedBrands.value.length) {
    return 'Marques'
  }
  return `Marques (${selectedBrands.value.length})`
}

const getCategoriesHeader = () => {
  if (!selectedCategories.value.length) {
    return 'Catégories'
  }
  return `Catégories (${selectedCategories.value.length})`
}

const onSlideEnd = () => {
  const query = {
    price:
      price.value.join(',') !== DEFAULT_PRICE_RANGE.join(',') ? price.value.join(',') : undefined
  }

  router.replace({
    query: {
      ...route.query,
      ...query
    }
  })
}
</script>

<template>
  <div
    class="flex h-full w-full flex-col gap-30px bg-white px-5 py-5 md:sticky md:w-[300px] md:py-10"
    :class="[open ? getOpenClasses() : 'hidden']"
  >
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-medium">Filtrer par</h2>
      <button
        type="button"
        class="pi pi-times cursor-pointer md:!hidden"
        @click="emit('open', false)"
      ></button>
    </div>

    <!-- Accordions -->
    <Accordion multiple>
      <AccordionTab :header="getBrandsHeader()">
        <div v-for="brand of brands" :key="brand.slug" class="flex items-center gap-2">
          <Checkbox
            v-model="selectedBrands"
            :inputId="brand.slug"
            name="brand"
            :value="brand.name"
          />
          <label :for="brand.slug">{{ brand.name }}</label>
        </div>
      </AccordionTab>
      <AccordionTab :header="getCategoriesHeader()">
        <div v-for="category of categories" :key="category.slug" class="flex items-center gap-2">
          <Checkbox
            v-model="selectedCategories"
            :inputId="category.slug"
            name="category"
            :value="category.name"
          />
          <label :for="category.slug">{{ category.name }}</label>
        </div>
      </AccordionTab>
      <AccordionTab header="Prix">
        <p class="pb-2.5">{{ price[0] }}€ - {{ price[1] }}€</p>
        <Slider v-model="price" range :max="DEFAULT_PRICE_RANGE[1]" @slideend="onSlideEnd" />
      </AccordionTab>
    </Accordion>
  </div>
</template>
