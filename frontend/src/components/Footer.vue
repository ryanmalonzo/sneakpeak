<script setup lang="ts">
const footerLinks = [
  { title: 'Produits', links: ['Homme', 'Femme', 'Enfant'] },
  { title: 'A propos', links: ['Notre histoire', 'Nos valeurs', 'Nos engagements'] },
  { title: 'Informations légales', links: ['Mentions légales', 'Conditions générales de vente', 'Politique de confidentialité'] },
  { title: 'Service client', links: ['Contactez-nous', 'FAQ', 'Livraison et retours'] }
]
</script>

<template>
  <footer class="flex p-30px items-start gap-30px flex-shrink-0 self-stretch bg-black">
    <!-- Main -->
    <div class="flex flex-col flex-start gap-30px flex-1 self-stretch">
      <!-- Footer text -->
      <div class="flex flex-col items-start gap-5 self-stretch">
        <p class="text-white font-medium">SneakPeak</p>
        <p class="text-sneakpeak-gray-500">SneakPeak est une plateforme fictive de vente de chaussures en ligne.</p>
      </div>

      <!-- Footer links -->
      <div class="flex items-start gap-50px flex-1 self-stretch">
        <template v-for="link in footerLinks">
          <div class="flex flex-col items-start gap-2.5 self-stretch">
            <p class="text-white font-medium">{{ link.title }}</p>
            <template v-for="sublink in link.links">
              <router-link :to="`/${sublink}`" class="text-sneakpeak-gray-500 hover:text-white">{{ sublink
                }}</router-link>
            </template>
          </div>
        </template>
      </div>
    </div>

    <!-- Blank space -->
    <!-- <div class="flex-1 self-stretch"></div> -->
  </footer>
</template>
