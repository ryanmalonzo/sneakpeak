<script setup lang="ts">
import { ref, watchEffect, type Ref } from 'vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import Checkbox from 'primevue/checkbox'
import Slider from 'primevue/slider'
import { BrandApi } from '@/services/brandApi'
import { CategoryApi } from '@/services/categoryApi'
import { ColorApi } from '@/services/colorApi'
import { SizeApi } from '@/services/sizeApi'

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

const colors: Ref<ColorApi.ColorOut[]> = ref([])
const selectedColors: Ref<string[]> = ref([])

const sizes: Ref<SizeApi.SizeOut[]> = ref([])
const selectedSizes: Ref<string[]> = ref([])

const DEFAULT_PRICE_RANGE = [0, 500]
const price: Ref<number[]> = ref(DEFAULT_PRICE_RANGE)

// Set selected filters from URL
watchEffect(() => {
  if (route.query.brand) {
    selectedBrands.value = (route.query.brand as string).split(',')
  } else {
    selectedBrands.value = []
  }
  if (route.query.category) {
    selectedCategories.value = (route.query.category as string).split(',')
  } else {
    selectedCategories.value = []
  }
  if (route.query.price) {
    price.value = (route.query.price as string).split(',').map(Number)
  } else {
    price.value = DEFAULT_PRICE_RANGE
  }
if (route.query.color) {
  selectedColors.value = (route.query.color as string).split(',')
} else {
  selectedColors.value = []
}
if (route.query.size) {
  selectedSizes.value = (route.query.size as string).split(',')
} else {
  selectedSizes.value = []
}
})

Promise.all([
  BrandApi.getPaginated(),
  CategoryApi.getPaginated(),
  ColorApi.getPaginated(),
  SizeApi.getPaginated()
]).then(([brandsData, categoriesData, colorsData, sizesData]) => {
  brands.value = brandsData
  categories.value = categoriesData
  colors.value = colorsData
  sizes.value = sizesData
})

const handleFilterChange = () => {
  const query = {
    brand: selectedBrands.value.length ? selectedBrands.value.join(',') : undefined,
    category: selectedCategories.value.length ? selectedCategories.value.join(',') : undefined,
    color: selectedColors.value.length ? selectedColors.value.join(',') : undefined,
    size: selectedSizes.value.length ? selectedSizes.value.join(',') : undefined
  }

  router.replace({
    query: {
      ...route.query,
      ...query
    }
  })
}

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

const getColorsHeader = () => {
  if (!selectedColors.value.length) {
    return 'Couleurs'
  }
  return `Couleurs (${selectedColors.value.length})`
}

const getSizesHeader = () => {
  if (!selectedSizes.value.length) {
    return 'Tailles'
  }
  return `Tailles (${selectedSizes.value.length})`
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
    class="flex h-full w-full flex-col gap-30px bg-white md:sticky md:w-[300px] md:px-5 md:py-10"
    :class="[open ? getOpenClasses() : 'hidden']"
  >
    <div class="flex items-center justify-between px-5 pt-5 md:px-0 md:pt-0">
      <h2 class="text-lg font-medium">Filtrer par</h2>
      <button
        type="button"
        class="pi pi-times cursor-pointer md:!hidden"
        @click="emit('open', false)"
      ></button>
    </div>

    <!-- Accordions -->
    <Accordion multiple class="bg-white px-5 md:px-0">
      <AccordionTab :header="getBrandsHeader()">
        <div v-for="brand of brands" :key="brand.slug" class="flex items-center gap-2">
          <Checkbox
            v-model="selectedBrands"
            :inputId="brand.slug"
            name="brand"
            :value="brand.name"
            @change="handleFilterChange"
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
            @change="handleFilterChange"
          />
          <label :for="category.slug">{{ category.name }}</label>
        </div>
      </AccordionTab>
      <AccordionTab :header="getColorsHeader()">
        <div v-for="color of colors" :key="color.slug" class="flex items-center gap-2">
          <Checkbox
            v-model="selectedColors"
            :inputId="color.slug"
            name="color"
            :value="color.name"
          />
          <label :for="color.slug">{{ color.name }}</label>
        </div>
      </AccordionTab>
      <AccordionTab :header="getSizesHeader()">
        <div v-for="size of sizes" :key="size.slug" class="flex items-center gap-2">
          <Checkbox v-model="selectedSizes" :inputId="size.slug" name="size" :value="size.name" />
          <label :for="size.slug">{{ size.name }}</label>
        </div>
      </AccordionTab>
      <AccordionTab header="Prix">
        <p class="pb-2.5">{{ price[0] }}€ - {{ price[1] }}€</p>
        <Slider v-model="price" range :max="DEFAULT_PRICE_RANGE[1]" @slideend="onSlideEnd" />
      </AccordionTab>
    </Accordion>
  </div>
</template>
