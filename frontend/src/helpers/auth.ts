import router from '@/router'
import { CartApi } from '@/services/cartApi'
import { SessionApi } from '@/services/sessionApi'
import { CartStore } from '@/store/cart'
import { profileStore } from '@/store/profile'

export async function checkAuth(): Promise<{ isAuthenticated: boolean; roles: string[] }> {
  // Verif si l'utilisateur est connecté
  const profile = profileStore()
  const cart = CartStore()
  try {
    const user = await SessionApi.getProfile()
    profile.setProfile(user)
    const data = await CartApi.getAll()
    cart.setCart(data)
    return { isAuthenticated: true, roles: user!.roles }
  } catch (e) {
    profile.clearProfile()
    cart.clearCart()
    return { isAuthenticated: false, roles: [] }
  }
}

export async function logout() {
  try {
    await SessionApi.logout()
    profileStore().clearProfile()
    CartStore().clearCart()
    router.push('/')
  } catch (e) {
    profileStore().clearProfile()
    CartStore().clearCart()
    router.push('/')
  }
}
