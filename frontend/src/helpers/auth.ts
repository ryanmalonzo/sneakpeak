import router from '@/router'
import { SessionApi } from '@/services/sessionApi'
import { profileStore } from '@/store/profile'

export async function checkAuth(): Promise<boolean> {
  // Verif si l'utilisateur est connecté
  const profile = profileStore()
  try {
    const user = await SessionApi.getProfile()
    profile.setProfile(user!)
    return true
  } catch (e) {
    profile.clearProfile()
    return false
  }
}

export async function logout() {
  try {
    await SessionApi.logout()
    profileStore().clearProfile()
    router.push('/')
    //TODO toaster
  } catch (e) {
    profileStore().clearProfile()
    router.push('/')
  }
}
