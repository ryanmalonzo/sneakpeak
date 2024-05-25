<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import BasePage from '@/components/BasePage.vue'
import CardProduct from '../components/home/CardProduct.vue';
import CardBestProduct from '../components/home/CardBestProduct.vue';
import Carousel from 'primevue/carousel';
import CardBrand from '../components/home/CardBrand.vue';


const sneakers = ref([])
const brands = ref([])
const categories = ref([])
const bestSneakers = ref([])
const bearer = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjUyMjc0MmIzODBjNzU1MDE0ZTQ3YjUiLCJpYXQiOjE3MTY2Njc0MzYsImV4cCI6MTcxNjY3MTAzNn0.J7AfOS0g4fI5_lNEAPA-_Xeg90lwHj2xnx2ljH0lCug';
axios.defaults.headers.common['Authorization'] = bearer;

onMounted(async () => {
  const apiSneakers = await axios.get('http://localhost:3000/sneakers?limit=8');
  sneakers.value = apiSneakers.data.items

  const apiBestSneakers = await axios.get('http://localhost:3000/sneakers/best');
  bestSneakers.value = apiBestSneakers.data

  const apiBrands = await axios.get('http://localhost:3000/brands');
  brands.value = apiBrands.data

  const apiCategories = await axios.get('http://localhost:3000/categories/best');
  categories.value = apiCategories.data
  console.log(apiCategories.data)
})

</script>

<template>
  <BasePage>
    <div class="flex-col">
      <section>
        <a href="#" class="w-screen flex justify-center items-end">
          <div class="w-screen">
            <img :src="categories.image" alt="" class="w-full  h-[421px]  object-cover">
          </div>
          <button class="absolute max-md:mb-4 md:mb-20 bg-white max-md:px-2 md:px-40 py-4 font-bold">Sneakers {{
            categories.name }} :
            Achetez
            maintenant
            !</button>
        </a>
      </section>

      <section>
        <h1 class="text-center text-xl not-italic font-bold my-10">NOS DERNIÈRES BASKETS</h1>
        <div class="max-md:hidden md:flex flex-wrap justify-center gap-10 md:mx-40">
          <CardProduct :name="sneaker.name" :price="sneaker.price" :image="sneaker.coverImage"
            v-for="sneaker in sneakers" :key="sneaker._id" />
        </div>
        <Carousel :value="sneakers" :numVisible="1" :numScroll="1" orientation="vertical"
          contentClass="flex align-items-center md:hidden" :autoplayInterval="3000" :showNavigators="false">
          <template #item="slotProps">
            <a href="#">
              <div class="border-1 surface-border border-round m-2  p-3">
                <div class="mb-3">
                  <div class="relative mx-auto">
                    <img :src="slotProps.data.coverImage" :alt="slotProps.data.name" class="w-full border-round" />
                  </div>
                </div>

                <div class="flex justify-content-between align-items-center">
                  <div class="mb-3 font-medium">{{ slotProps.data.name }}</div>
                  <div class="mt-0 font-semibold text-xl">${{ slotProps.data.price }}</div>

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
          <CardBrand :name="brand.name" :image="brand.image" v-for="brand in brands" :key="brand._id" />

        </div>
        <Carousel :value="brands" :numVisible="1" :numScroll="1" orientation="vertical" :autoplayInterval="3000"
          contentClass="flex align-items-center md:hidden" :showNavigators="false" verticalViewPortHeight="230px">
          <template #item="slotProps">
            <a href="#">
              <div class="border-1 surface-border border-round m-2  p-3">
                <div class="mb-3">
                  <div class="relative mx-auto">
                    <img :src="slotProps.data.image" class="w-full border-round" />
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
            <CardBestProduct :name="bestSneaker.name" :price="bestSneaker.price" :coverImage="bestSneaker.coverImage"
              v-for="bestSneaker in bestSneakers" :key="bestSneaker._id" class="p-4" />
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
