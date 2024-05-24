<script setup lang="ts">
import BasePage from '@/components/BasePage.vue'
import CardProduct from '../components/home/CardProduct.vue';
import CardBestProduct from '../components/home/CardBestProduct.vue';
import Carousel from 'primevue/carousel';
import CardBrand from '../components/home/CardBrand.vue';

const products = [
  {
    name: 'Baskets New Balance Unisexe M1906RRA Licorice Moonbeam Castlerock',
    price: '99,95 €',
  },
  {
    name: 'Baskets New Balance Unisexe M1906RRA Licorice Moonbeam Castlerock',
    price: '99,95 €',
  },
  {
    name: 'Baskets New Balance Unisexe M1906RRA Licorice Moonbeam Castlerock',
    price: '99,95 €',
  },
  {
    name: 'Baskets New Balance Unisexe M1906RRA Licorice Moonbeam Castlerock',
    price: '99,95 €',
  },
]
</script>

<template>
  <BasePage>
    <div class="flex-col">
      <section>
        <a href="#" class="w-screen flex justify-center items-end">
          <img src="../assets/images/image.png" alt="" class="w-full">
          <button class="absolute max-md:mb-4 md:mb-20 bg-white max-md:px-2 md:px-40 py-4 font-bold">Sneakers Puma :
            Achetez
            maintenant
            !</button>
        </a>
      </section>

      <section>
        <h1 class="text-center text-xl not-italic font-bold my-10">NOS DERNIÈRES BASKETS</h1>
        <div class="max-md:hidden md:flex flex-wrap justify-center gap-10 md:mx-40">
          <CardProduct />
          <CardProduct />
          <CardProduct />
          <CardProduct />
          <CardProduct />
          <CardProduct />
          <CardProduct />
          <CardProduct />
        </div>
        <Carousel :value="products" :numVisible="1" :numScroll="1" orientation="vertical"
          contentClass="flex align-items-center md:hidden" :autoplayInterval="3000" :showNavigators="false">
          <template #item="slotProps">
            <a href="#">
              <div class="border-1 surface-border border-round m-2  p-3">
                <div class="mb-3">
                  <div class="relative mx-auto">
                    <img :src="'/src/assets/images/product.png'" class="w-full border-round" />
                  </div>
                  <div class="my-3 text-center">
                    <p>{{ slotProps.data.name }}</p>

                    <p class="font-bold">{{ slotProps.data.price }}</p>
                  </div>

                </div>
              </div>
            </a>
          </template>
        </Carousel>
      </section>


      <section>
        <h1 class="text-center text-xl not-italic font-bold my-10">NOS MARQUES</h1>
        <div
          class="max-md:hidden md:flex flex-row w-full justify-center items-start content-start gap-2.5 flex-wrap px-0 shrink-0">
          <CardBrand />
          <CardBrand />
          <CardBrand />
          <CardBrand />
          <CardBrand />
        </div>
        <Carousel :value="products" :numVisible="1" :numScroll="1" orientation="vertical" :autoplayInterval="3000"
          contentClass="flex align-items-center md:hidden" :showNavigators="false" verticalViewPortHeight="230px">
          <template #item="">
            <a href="#">
              <div class="border-1 surface-border border-round m-2  p-3">
                <div class="mb-3">
                  <div class="relative mx-auto">
                    <img :src="'/src/assets/images/brand.png'" class="w-full border-round" />
                  </div>
                </div>
              </div>
            </a>
          </template>
        </Carousel>



      </section>
      <section>
        <h1 class="text-center text-xl not-italic font-bold my-10">LES MEILLEURS VENTES DU MOMENT</h1>
        <div class="flex w-full h-auto justify-center items-start content-start gap-5 flex-row mx-auto">
          <img src="../assets/images/cover.png" alt="" class="w-[439px] h-[566px] shrink-0 max-lg:hidden">
          <div class="flex flex-col">
            <CardBestProduct />
            <CardBestProduct />
            <CardBestProduct />
          </div>
        </div>
      </section>
      <section>
        <div
          class="flex max-md:w-full my-10 md:w-1/2 h-auto flex-col items-center gap-[30px] px-4 py-[30px] bg-black justify-center  mx-auto text-center ">

          <p class="text-white">About us <br>
            "A service-first home for contemporary style." <br>
            At SneakPeak you can expect an unrivalled level of service and an ever evolving range of sneakers and
            apparel. <br>

            From the classic Nike, adidas, Puma and New Balance
            drops to the more exclusive brands
            and releases to surprise even the most curious among us.
            Rooted in Amsterdam street culture we’ve always supported local initiatives, creatives and athletes from day
            one.
            Working on
            unique collaborations with both local and international brands and
            hosting regular events and parties in our shops for our community. Something we’ll continue doing wherever
            we go.
            With an expanding assortment of fashion and apparel brands, SD has become your service-first home for
            contemporary
            style.</p>
          <img src="../assets/images/about.png" alt="" class="h-auto shrink-0 self-stretch">
        </div>
      </section>
    </div>




  </BasePage>
</template>
