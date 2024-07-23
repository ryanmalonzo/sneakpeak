<script setup lang="ts">
import Image from 'primevue/image'
import { CartApi } from '@/services/cartApi'

const { id, stock } = defineProps({
  id: Number,
  image: String,
  name: String,
  color: String,
  size: String,
  price: Number,
  stock: Number,
  quantity: Number
})
const eventUpdateCart = defineEmits(['updateCart', 'updatePrice'])

const removeProduct = async () => {
  if (id) {
    await CartApi.removeProduct(id)
    console.log('Product removed with ID:' + id)
    eventUpdateCart('updateCart', id)
  }
}

const updateProduct = async (quantity: number) => {
  if (id && quantity > 0) {
    eventUpdateCart('updatePrice', quantity)
    await CartApi.updateProduct(id, quantity)
    eventUpdateCart('updateCart', id)
  }
}
</script>

<template>
  <div class="flex flex-col items-start gap-8 self-stretch rounded-2xl">
    <div
      class="flex h-auto items-start justify-between self-stretch rounded-xl md:border md:border-black"
    >
      <img
        :src="image"
        alt=""
        class="object-cover max-md:w-36 md:rounded-bl-xl md:rounded-tl-xl"
        :height="233"
        :width="244"
      />
      <div
        class="flex flex-1 flex-col items-start gap-3 self-stretch max-md:pl-4 max-md:text-xs md:p-5"
      >
        <div class="flex items-start gap-2 self-stretch">
          <p class="flex-1">{{ name }}</p>
          <p>{{ price }} €</p>
        </div>
        <p class="self-stretch">Couleur: {{ color }}</p>
        <p class="flex-1 self-stretch">Taille: {{ size }}</p>
        <div class="flex items-center justify-between self-stretch">
          <div class="flex w-16 items-center justify-between gap-2 border border-black p-2">
            <select
              name="quantity"
              class="pr-2"
              @change="
                (event) => updateProduct(parseInt((event.target as HTMLSelectElement).value))
              "
            >
              <option
                v-for="i in (stock ?? 1) < 5 ? stock ?? 1 : 5"
                :key="i"
                :value="i"
                :selected="i === quantity"
              >
                {{ i }}
              </option>
            </select>
          </div>
          <button :onclick="removeProduct">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <g clip-path="url(#clip0_283_468)">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.08115 2.32325C5.08115 2.00946 5.43526 1.54198 6.14057 1.54198H11.8594C12.5683 1.54198 12.9189 2.00218 12.9189 2.32325V3.87552C12.9189 3.94298 12.9275 4.00841 12.9438 4.07077H5.05619C5.07248 4.00841 5.08115 3.94298 5.08115 3.87552V2.32325ZM3.56324 4.07077C3.54696 4.00841 3.53829 3.94298 3.53829 3.87552V2.32325C3.53829 0.930595 4.82989 0 6.14057 0H11.8594C13.1666 0 14.4617 0.917316 14.4617 2.32325V3.87552C14.4617 3.94298 14.453 4.00841 14.4368 4.07077H17.2286C17.6546 4.07077 18 4.41596 18 4.84176C18 5.26757 17.6546 5.61275 17.2286 5.61275H16.1691V15.6767C16.1691 17.0694 14.8775 18 13.5669 18H4.42286C3.11572 18 1.82058 17.0827 1.82058 15.6767V5.61275H0.771429C0.34538 5.61275 0 5.26757 0 4.84176C0 4.41596 0.34538 4.07077 0.771429 4.07077H2.60228H3.56324ZM3.36343 5.61275V15.6767C3.36343 15.9978 3.714 16.458 4.42286 16.458H13.5669C14.2722 16.458 14.6263 15.9905 14.6263 15.6767V5.61275H3.36343ZM7.16914 7.94629C7.59519 7.94629 7.94057 8.29148 7.94057 8.71728V13.3638C7.94057 13.7896 7.59519 14.1347 7.16914 14.1347C6.7431 14.1347 6.39772 13.7896 6.39772 13.3638V8.71728C6.39772 8.29148 6.7431 7.94629 7.16914 7.94629ZM11.6023 8.71728C11.6023 8.29148 11.2569 7.94629 10.8309 7.94629C10.4048 7.94629 10.0594 8.29148 10.0594 8.71728V13.3638C10.0594 13.7896 10.4048 14.1347 10.8309 14.1347C11.2569 14.1347 11.6023 13.7896 11.6023 13.3638V8.71728Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_283_468">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
