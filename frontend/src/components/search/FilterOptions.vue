<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { onMounted, ref, type Ref } from 'vue'
import { BrandApi } from '@/services/brandApi'
import { CategoryApi } from '@/services/categoryApi'
import Checkbox from 'primevue/checkbox'
import Slider from 'primevue/slider'

defineProps<{
  open: boolean
}>()

const emit = defineEmits(['open'])

const breakpoints = useBreakpoints(breakpointsTailwind)

const getOpenClasses = () => {
  if (breakpoints.smaller('md').value) {
    return 'absolute top-0 left-0 z-[60]'
  }
  return 'sticky top-[66px]'
}

const brands: Ref<BrandApi.BrandOut[]> = ref([])
const selectedBrands = ref([])

const categories: Ref<CategoryApi.CategoryOut[]> = ref([])
const selectedCategories = ref([])

const priceRange: Ref<number[]> = ref([0, 1000])

onMounted(async () => {
  const data = await BrandApi.getAll()
  brands.value = data

  const categoriesData = await CategoryApi.getAll()
  categories.value = categoriesData
})
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
      <AccordionTab header="Marques">
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
      <AccordionTab header="Catégories">
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
        <p class="pb-2.5">{{ priceRange[0] }}€ - {{ priceRange[1] }}€</p>
        <Slider v-model="priceRange" range :max="500" />
      </AccordionTab>
    </Accordion>
  </div>
</template>
