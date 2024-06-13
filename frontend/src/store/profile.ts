import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { IProfile } from '@/services/sessionApi'

export const profileStore = defineStore('profile', () => {
  const profile: Ref<IProfile | undefined> = ref()

  const setProfile = (newProfile: IProfile) => {
    profile.value = newProfile
  }
  const clearProfile = () => {
    profile.value = undefined
  }

  return { profile, setProfile, clearProfile }
})
