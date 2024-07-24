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
        link: '/legal/notre-histoire',
      },
      {
        title: 'Nos valeurs',
        link: '/legal/nos-valeurs',
      },
      {
        title: 'Nos engagements',
        link: '/legal/nos-engagements',
      }
    ]
  },
  {
    title: 'Informations légales',
    links: [
      {
        title: "Conditions générales d'utilisation",
        link: '/legal/cgu',
        target: '_blank'
      },
      {
        title: 'Conditions générales de vente',
        link: '/legal/cgv',
        target: '_blank'
      },
      {
        title: 'Politique de confidentialité',
        link: '/legal/politique-de-confidentialite',
        target: '_blank'
      },
      {
        title: 'Politique de cookies',
        link: '/legal/politique-de-cookies',
        target: '_blank'
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
        link: '/legal/cgv',
        target: '_blank'
      }
    ]
  }
]
</script>

<template>
  <footer class="flex flex-shrink-0  gap-30px self-stretch bg-black p-30px flex-col items-center ">
    <!-- Main -->
    <div class="flex-start flex-1 gap-30px self-stretch flex justify-between max-md:flex-col">
      <!-- Footer text -->
      <div class="flex flex-col items-start gap-5 self-stretch">
        <p class="font-medium text-white">SneakPeak</p>
        <p class="text-sneakpeak-gray-500">
          SneakPeak est une plateforme fictive de vente de chaussures en ligne.
        </p>
      </div>

      <!-- Footer links -->
      <div class="flex flex-1 flex-col items-start gap-5 self-stretch md:flex-row md:gap-50px justify-evenly">
        <template v-for="link in footerLinks" :key="link.title">
          <div class="flex flex-col items-start gap-2.5 self-stretch">
            <p class="font-medium text-white">{{ link.title }}</p>
            <template v-for="sublink in link.links" :key="sublink">
              <router-link :to="sublink.link" :target="sublink.target || '_self'"
                class="text-sneakpeak-gray-500 hover:text-white">{{ sublink.title }}</router-link>
            </template>
          </div>
        </template>
      </div>


    </div>
    <div class="flex flex-col items-start gap-5 self-center">
      <p class="text-sm font-medium text-white">© 2024 SneakPeak. Tous droits réservés.</p>
    </div>
  </footer>
</template>
