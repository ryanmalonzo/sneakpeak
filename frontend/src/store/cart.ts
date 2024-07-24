import { ref } from 'vue'
import { defineStore } from 'pinia'
import { CartApi } from '@/services/cartApi'

export const CartStore = defineStore('cart', () => {
  const cart = ref<CartApi.CartApiOut | undefined>({
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

  const addProduct = async (variantId: number, quantity: number) => {
    try {
      await CartApi.addProduct(variantId, quantity)
      const data = await CartApi.getAll()
      setCart(data)
    } catch (error) {
      throw await (error as Response) // Renvoie le message d'erreur au composant
    }
  }

  const clearCart = () => {
    cart.value = undefined
  }

  return { cart, getCart, setCart, addProduct, clearCart }
})
