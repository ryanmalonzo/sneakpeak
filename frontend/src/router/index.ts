import { createRouter, createWebHistory } from 'vue-router'
import EmailVerification from '../views/EmailVerification.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/verify-email',
      name: 'email_verification',
      component: EmailVerification
    },
  ]
})

export default router
