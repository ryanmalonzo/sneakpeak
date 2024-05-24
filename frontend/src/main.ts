import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/base.css'

import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config'
// @ts-ignore
import Aura from './presets/aura'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  unstyled: true,
  pt: {
    ...Aura,
    inputtext: {
      root: 'border border-sneakpeak-gray-50 rounded-full px-4 py-2'
    }
  }
})

// Register global components
app.component('Button', Button)
app.component('InputText', InputText)
app.component('Dialog', Dialog)

app.mount('#app')
