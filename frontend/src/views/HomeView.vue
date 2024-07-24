<script setup lang="ts">
import { onMounted, reactive, ref, type Ref } from 'vue'
import Carousel from 'primevue/carousel'
import { useRouter } from 'vue-router'
import { BrandApi } from '@/services/brandApi'
import { CategoryApi } from '@/services/categoryApi'
import { SneakerApi } from '@/services/sneakerApi'
import BasePage from '@/components/BasePage.vue'
import CardBestProduct from '../components/home/CardBestProduct.vue'
import CardBrand from '../components/home/CardBrand.vue'
import CardProduct from '../components/home/CardProduct.vue'

const router = useRouter()

const lastCategory: Ref<CategoryApi.CategoryOut | undefined> = ref()
const latestVariants: SneakerApi.FlattenedVariantOut[] = reactive([])
const brands: BrandApi.BrandOut[] = reactive([])
const bestSellingVariants: SneakerApi.FlattenedVariantOut[] = reactive([])

const NB_BRANDS_TO_DISPLAY = 5

onMounted(async () => {
  const dataCategories = await CategoryApi.getPaginated()
  lastCategory.value = dataCategories.reduce((previous, current) =>
    previous.id > current.id ? previous : current
  )

  const dataVariants = await SneakerApi.getVariantsPaginated({
    limit: 8,
    sort: 'variantCreatedAt',
    order: 'desc'
  })

  // Filter out dataVariants.items with duplicate sneakerId AND color
  dataVariants.items = dataVariants.items.filter(
    (variant, index, self) =>
      index ===
      self.findIndex(
        (v) => v.sneakerId === variant.sneakerId && v.variantName === variant.variantName
      )
  )

  latestVariants.push(...dataVariants.items)

  const dataBrands = await BrandApi.getPaginated()
  brands.push(...dataBrands.slice(0, NB_BRANDS_TO_DISPLAY))

  const dataBestSellingVariants = await SneakerApi.getVariantsPaginated({
    limit: 3,
    'variants.isBest': true
  })

  dataBestSellingVariants.items = dataBestSellingVariants.items.filter(
    (variant, index, self) =>
      index ===
      self.findIndex(
        (v) => v.sneakerId === variant.sneakerId && v.variantName === variant.variantName
      )
  )

  bestSellingVariants.push(...dataBestSellingVariants.items)
})

const redirectToSneakerView = (sneakerSlug: string, colorSlug: string) => {
  router.push({
    name: 'sneakers',
    params: { slugSneaker: sneakerSlug },
    query: { color: colorSlug }
  })
}
</script>

<template>
  <BasePage>
    <div class="flex-col">
      <section>
        <div @click="router.push(`/search?category=${lastCategory.name}`)"
          class="flex w-screen cursor-pointer items-end justify-center" v-if="lastCategory">
          <img :src="lastCategory.image" :alt="lastCategory.name" class="max-h-[372px] w-full object-cover" />

          <a class="absolute mb-4 bg-white px-2 py-4 font-bold md:mb-20 md:px-40">
            Nouvelle collection : {{ lastCategory.name }}
          </a>
        </div>
      </section>

      <section>
        <h1 class="py-10 text-center text-xl font-bold uppercase">Nos dernières baskets</h1>
        <div class="hidden flex-wrap justify-center gap-10 md:flex">
          <CardProduct
            v-for="variant in latestVariants"
            :key="variant._id"
            :sneakerSlug="variant.sneakerSlug"
            :colorSlug="variant.colorSlug"
            :image="variant.variantImage"
            :name="variant.sneakerName"
            :price="variant.sneakerPrice"
          />
        </div>
        <Carousel :value="latestVariants" :numVisible="1" :numScroll="1" orientation="vertical"
          verticalViewPortHeight="358px" containerClass="align-items-center flex md:!hidden" :autoplayInterval="3000"
          :showNavigators="false">
          <template #item="variant">
            <a
              href="#"
              class="h-[358px]"
              @click="redirectToSneakerView(variant.sneakerSlug, variant.colorSlug)"
            >
              <div class="border-1 surface-border border-round flex flex-col items-center p-5">
                <img :src="variant.data.variantImage" class="border-round w-full" />
                <p>{{ variant.data.sneakerName }}</p>
                <p class="font-bold">{{ variant.data.sneakerPrice }} €</p>
              </div>
            </a>
          </template>
        </Carousel>
      </section>

      <section>
        <h1 class="py-10 text-center text-xl font-bold uppercase">Nos marques</h1>
        <div class="hidden w-full shrink-0 flex-wrap content-start items-start justify-center gap-2.5 px-0 md:flex">
          <CardBrand v-for="brand in brands" :key="brand.slug" :name="brand.name" :image="brand.image" />
        </div>
        <Carousel :value="brands" :numVisible="1" :numScroll="1" orientation="vertical" verticalViewPortHeight="310px"
          :autoplayInterval="3000" containerClass="flex align-items-center md:!hidden" :showNavigators="false">
          <template #item="brand">
            <a href="#" class="h-[310px]" @click="router.push(`/search?brand=${brand.name}`)">
              <div class="border-1 surface-border border-round flex flex-col items-center p-5">
                <img :src="brand.data.image" class="border-round w-full" />
              </div>
            </a>
          </template>
        </Carousel>
      </section>
      <div class="flex flex-col px-5 md:px-48">
        <section>
          <h1 class="py-10 text-center text-xl font-bold uppercase">
            Les meilleures ventes du moment
          </h1>
          <div class="flex justify-between gap-10">
            <img src="../assets/images/cover.png" alt="" class="h-[566px] w-[439px] shrink-0 max-lg:hidden" />
            <div class="flex flex-1 flex-col justify-between gap-5">
              <CardBestProduct
                v-for="variant in bestSellingVariants"
                :key="variant.sizeSlug"
                :image="variant.variantImage"
                :name="variant.sneakerName"
                :price="variant.sneakerPrice"
                :sneakerSlug="variant.sneakerSlug"
                :colorSlug="variant.colorSlug"
              />
            </div>
          </div>
        </section>
        <section class="flex justify-center">
          <div
            class="my-10 flex w-full flex-1 flex-col items-center justify-center gap-30px bg-black px-4 py-30px text-center md:w-1/2">
            <p class="text-white">À propos de nous</p>
            <p class="text-white">
              Chez Sneakpeak, nous sommes passionnés par l'excellence et le style. Nous vous proposons une sélection
              exclusive
              de sneakers de qualité supérieure, alliant design innovant et confort inégalé. Chaque paire est
              soigneusement
              choisie pour offrir à nos clients non seulement des chaussures élégantes mais aussi un véritable
              investissement
              dans la qualité. Découvrez l'élégance et le confort à chaque pas avec Sneakpeak, où chaque sneaker raconte
              une
              histoire de raffinement et de performance.
            </p>
            <img src="../assets/images/about.png" alt="" class="h-auto shrink-0 self-stretch" />
          </div>
        </section>
      </div>
    </div>
  </BasePage>
</template>
