<script setup lang="ts">
import BasePage from '@/components/BasePage.vue'
import CardProduct from '../components/home/CardProduct.vue'
import CardBestProduct from '../components/home/CardBestProduct.vue'
import Carousel from 'primevue/carousel'
import CardBrand from '../components/home/CardBrand.vue'
import { onMounted, reactive } from 'vue'
import { VariantApi } from '@/services/variantApi'

const latestVariants: VariantApi.VariantOut[] = reactive([])

onMounted(async () => {
  const data = await VariantApi.getPaginated({ limit: 8, sort: 'createdAt', order: 'desc' })
  latestVariants.push(...data.items)
})
</script>

<template>
  <BasePage>
    <div class="flex-col">
      <section>
        <a href="#" class="flex w-screen items-end justify-center">
          <img src="../assets/images/image.png" alt="" class="w-full" />
          <a class="absolute mb-4 bg-white px-2 py-4 font-bold md:mb-20 md:px-40">
            Sneakers Puma : Achetez maintenant !
          </a>
        </a>
      </section>

      <section>
        <h1 class="py-10 text-center text-xl font-bold uppercase">Nos dernières baskets</h1>
        <div class="hidden flex-wrap justify-center gap-10 md:flex">
          <CardProduct
            v-for="variant in latestVariants"
            :key="variant.name"
            :image="variant.image"
            :name="variant.name"
            :price="variant.price"
          />
        </div>
        <Carousel
          :value="latestVariants"
          :numVisible="1"
          :numScroll="1"
          orientation="vertical"
          verticalViewPortHeight="358px"
          containerClass="align-items-center flex md:!hidden"
          :autoplayInterval="3000"
          :showNavigators="false"
        >
          <template #item="slotProps">
            <a href="#" class="h-[358px]">
              <div class="border-1 surface-border border-round flex flex-col items-center p-5">
                <img :src="slotProps.data.image" class="border-round w-full" />
                <p>{{ slotProps.data.name }}</p>
                <p class="font-bold">{{ slotProps.data.price }} €</p>
              </div>
            </a>
          </template>
        </Carousel>
      </section>

      <section>
        <h1 class="py-10 text-center text-xl font-bold uppercase">Nos marques</h1>
        <div
          class="hidden w-full shrink-0 flex-wrap content-start items-start justify-center gap-2.5 px-0 md:flex"
        >
          <CardBrand />
          <CardBrand />
          <CardBrand />
          <CardBrand />
          <CardBrand />
        </div>
        <Carousel
          :value="products"
          :numVisible="1"
          :numScroll="1"
          orientation="vertical"
          :autoplayInterval="3000"
          containerClass="flex align-items-center md:!hidden"
          :showNavigators="false"
          verticalViewPortHeight="230px"
        >
          <template #item="">
            <a href="#">
              <div class="border-1 surface-border border-round m-2 p-3">
                <div class="mb-3">
                  <div class="relative mx-auto">
                    <img :src="'/src/assets/images/brand.png'" class="border-round w-full" />
                  </div>
                </div>
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
          <div class="flex justify-between gap-5">
            <img
              src="../assets/images/cover.png"
              alt=""
              class="h-[566px] w-[439px] shrink-0 max-lg:hidden"
            />
            <div class="flex flex-col justify-between">
              <CardBestProduct />
              <CardBestProduct />
              <CardBestProduct />
            </div>
          </div>
        </section>
        <section class="flex justify-center">
          <div
            class="my-10 flex w-full flex-1 flex-col items-center justify-center gap-30px bg-black px-4 py-30px text-center md:w-1/2"
          >
            <p class="text-white">À propos de nous</p>
            <p class="text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed etiam, ut ipsi
              adgnoscitis et alii ad. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              etiam, ut ipsi adgnoscitis et alii ad.
            </p>
            <img src="../assets/images/about.png" alt="" class="h-auto shrink-0 self-stretch" />
          </div>
        </section>
      </div>
    </div>
  </BasePage>
</template>
