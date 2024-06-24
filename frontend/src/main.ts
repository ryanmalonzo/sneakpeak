/* eslint-disable vue/no-reserved-component-names */
/* eslint-disable vue/multi-word-component-names */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/base.css'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Checkbox from 'primevue/checkbox'
// @ts-ignore
import vClickOutside from 'v-click-outside'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark-mode'
    }
  }
})

const { bind, unbind } = vClickOutside.directive

app.directive('click-outside', {
  mounted(el, bindling) {
    bind(el, { value: bindling.value })
  },
  beforeUnmount(el) {
    unbind(el)
  }
})

// Register global components
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Dialog', Dialog)
app.component('Checkbox', Checkbox)

app.mount('#app')
