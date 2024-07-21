<script setup lang="ts">
const footerLinks = [
  {
    title: 'Produits',
    links: [
      {
        title: 'Promotions',
        link: '#'
      },
      {
        title: 'Marques',
        link: '#'
      },
      {
        title: 'Catégories',
        link: '#'
      }
    ]
  },
  {
    title: 'A propos',
    links: [
      {
        title: 'Notre histoire',
        link: '#'
      },
      {
        title: 'Nos valeurs',
        link: '#'
      },
      {
        title: 'Nos engagements',
        link: '#'
      }
    ]
  },
  {
    title: 'Informations légales',
    links: [
      {
        title: "Conditions générales d'utilisation",
        link: '/legal/cgu'
      },
      {
        title: 'Conditions générales de vente',
        link: '/legal/cgv'
      },
      {
        title: 'Politique de confidentialité',
        link: '#'
      },
      {
        title: 'Politique des cookies',
        link: '/legal/politique-de-cookies'
      }
    ]
  },
  {
    title: 'Service client',
    links: [
      {
        title: 'Contactez-nous',
        link: '#'
      },
      {
        title: 'FAQ',
        link: '#'
      },
      {
        title: 'Livraison et retours',
        link: '/legal/cgv'
      }
    ]
  }
]
</script>

<template>
  <footer class="flex flex-shrink-0 items-start gap-30px self-stretch bg-black p-30px">
    <!-- Main -->
    <div class="flex-start flex flex-1 flex-col gap-30px self-stretch">
      <!-- Footer text -->
      <div class="flex flex-col items-start gap-5 self-stretch">
        <p class="font-medium text-white">SneakPeak</p>
        <p class="text-sneakpeak-gray-500">
          SneakPeak est une plateforme fictive de vente de chaussures en ligne.
        </p>
      </div>

      <!-- Footer links -->
      <div class="flex flex-1 flex-col items-start gap-5 self-stretch md:flex-row md:gap-50px">
        <template v-for="link in footerLinks" :key="link.title">
          <div class="flex flex-col items-start gap-2.5 self-stretch">
            <p class="font-medium text-white">{{ link.title }}</p>
            <template v-for="sublink in link.links" :key="sublink">
              <router-link :to="sublink.link" class="text-sneakpeak-gray-500 hover:text-white">{{
                sublink.title
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
