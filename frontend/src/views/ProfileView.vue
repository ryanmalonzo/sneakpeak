<script setup lang="ts">
import Password from 'primevue/password'
import BasePage from '@/components/BasePage.vue'
import FormRow from '@/components/profile/FormRow.vue'
import InputWithLabel from '@/components/profile/InputWithLabel.vue'
</script>

<template>
  <BasePage>
    <div class="flex flex-1 flex-col p-5 md:px-[100px] md:py-10">
      <div class="flex flex-col gap-30px md:flex-row md:gap-[100px]">
        <!-- Left -->
        <div class="order-2 flex flex-1 flex-col gap-5 md:order-1 md:gap-30px">
          <h2 class="text-2xl font-medium">Bonjour Fayssal</h2>
          <p>Merci de vérifier que les informations ci-dessous sont à jour</p>

          <!-- Personal Information -->
          <div class="flex flex-col gap-5 self-stretch md:gap-30px">
            <h2 class="text-2xl font-medium uppercase">Mes informations</h2>

            <FormRow>
              <InputWithLabel id="firstName" label="Prénom" />
              <InputWithLabel id="lastName" label="Nom" />
            </FormRow>

            <FormRow>
              <InputWithLabel id="phone" label="Téléphone" />
              <InputWithLabel id="email" label="Adresse mail" />
            </FormRow>

            <FormRow>
              <!-- Password -->
              <div class="flex flex-1 flex-col gap-1">
                <label for="password" class="uppercase">Mot de passe</label>
                <Password id="password" inputClass="flex-auto" />
              </div>

              <!-- Password confirmation -->
              <div class="flex flex-1 flex-col gap-1">
                <label for="passwordConfirm" class="uppercase">Confirmation du mot de passe</label>
                <Password id="passwordConfirm" inputClass="flex-auto" />
              </div>
            </FormRow>

            <Button
              label="Sauvegarder"
              severity="contrast"
              class="self-start !rounded-none !px-5 uppercase"
            />
          </div>
        </div>

        <!-- Right -->
        <div class="order-1 flex flex-col gap-5 md:order-2">
          <p class="text-2xl font-medium">Menu</p>

          <div class="flex flex-col gap-5 border border-black p-5">
            <RouterLink to="/profile" class="font-medium underline"
              >Mes informations personnelles</RouterLink
            >
            <RouterLink to="/profile" class="font-medium underline">Mes adresses</RouterLink>
            <RouterLink to="/profile" class="font-medium underline">Mes commandes</RouterLink>
            <RouterLink to="/logout" class="font-medium underline">Se déconnecter</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </BasePage>
</template>
