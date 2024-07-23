<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import BasePage from '@/components/BasePage.vue'
import { profileStore } from '@/store/profile'
import MenuProfil from '@/components/profile/MenuProfil.vue'
import AddressForm from './AddressForm.vue'

const profile = profileStore()

const useSameAddress = ref(false)
const wasSetToTrue = ref(false)

const fetchedData = reactive({
  shipping: {},
  billing: {}
})

const name = computed(() => {
  return profile.profile?.firstName || profile.profile?.email
})

const handleUseSameAddress = (value: boolean) => {
  useSameAddress.value = value
}

const checkIfSameAddress = () => {
  if (wasSetToTrue.value) return

  // Check fetchedData.shipping and fetchedData.billing
  // If they are the same, set useSameAddress to true
  // Otherwise, set it to false
  const isSameAddress = JSON.stringify(fetchedData.shipping) === JSON.stringify(fetchedData.billing)
  useSameAddress.value = isSameAddress
  wasSetToTrue.value = isSameAddress
}

const storeData = (type: 'shipping' | 'billing', data: Object) => {
  fetchedData[type] = data
  checkIfSameAddress()
}
</script>

<template>
  <BasePage>
    <div class="flex flex-1 flex-col p-5 md:px-[100px] md:py-10">
      <div class="flex flex-col gap-30px md:flex-row md:gap-[100px]">
        <!-- Left -->
        <div class="order-2 flex flex-1 flex-col gap-5 md:order-1 md:gap-30px">
          <h2 class="text-2xl font-medium">Bonjour {{ name }}</h2>
          <p>Merci de vérifier que les informations ci-dessous sont à jour</p>

          <h2 class="text-2xl font-medium uppercase">Mes adresses</h2>

          <!-- Addresses -->
          <AddressForm
            type="shipping"
            header="livraison"
            @data="
              (data) => {
                storeData('shipping', data)
              }
            "
            :use-same-address="useSameAddress"
            @use-same-address="handleUseSameAddress"
          />
          <AddressForm
            v-if="!useSameAddress"
            type="billing"
            header="facturation"
            @data="
              (data) => {
                storeData('billing', data)
              }
            "
            :use-same-address="useSameAddress"
            @use-same-address="handleUseSameAddress"
          />
        </div>

        <!-- Right -->
        <MenuProfil />
      </div>
    </div>
  </BasePage>
</template>
