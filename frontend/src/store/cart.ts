import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { CartApi } from '@/services/cartApi'
export const cartStore = defineStore('cart', () => {
  const cart = ref(0)

  const getCart = async () => {
    const data = await CartApi.getAll()
    cart.value = data.cartProduct.length
    return cart.value
  }

  const setCart = (value: number) => {
    cart.value = value
  }

  return { cart, getCart, setCart }
})
