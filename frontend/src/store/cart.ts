import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CartApi } from '@/services/cartApi'

export const CartStore = defineStore('cart', () => {
  const cart = ref<CartApi.CartApiOut>({
    id: 0,
    user: 0,
    cartProduct: [],
    createdAt: '',
    updatedAt: '',
    expiredAt: ''
  })

  const getCart = () => {
    return cart.value
  }

  const setCart = (value: CartApi.CartApiOut) => {
    cart.value = value
  }

  return { cart, getCart, setCart }
})
