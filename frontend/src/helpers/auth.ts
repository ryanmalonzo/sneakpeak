import { SessionApi } from '@/services/sessionApi'
import { profileStore } from '@/store/profile'

export async function checkAuth() {
  // Verif si l'utilisateur est connecté
  const profile = profileStore()
  try {
    const user = await SessionApi.getProfile()
    profile.setProfile(user!)
  } catch (e) {
    profile.clearProfile()
  }
}
