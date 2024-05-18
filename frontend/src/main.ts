import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import App from './App.vue'
import 'primeicons/primeicons.css'
import './assets/base.css'
import Aura from './presets/aura'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, { unstyled: true, pt: Aura })

app.mount('#app')
