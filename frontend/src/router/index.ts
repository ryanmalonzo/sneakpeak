import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SneakerView from '@/views/SneakerView.vue'
import EmailVerificationView from '../views/EmailVerificationView.vue'
import SearchView from '@/views/SearchView.vue'
import CartView from '@/views/CartView.vue'
import CheckoutView from '@/views/CheckoutView.vue'
import CheckoutSuccessView from '@/views/CheckoutSuccessView.vue'
import CheckoutCancelView from '@/views/CheckoutCancelView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import ProfileView from '@/views/profile/ProfileView.vue'
import CGUView from '@/views/legal/CGUView.vue'
import { checkAuth } from '@/helpers/auth'
import BasePageAdminView from '@/views/admin/BasePageAdminView.vue'
import CGVView from '@/views/legal/CGVView.vue'
import OrdersView from '@/views/profile/OrdersView.vue'
import DetailOrderView from '@/views/profile/DetailOrderView.vue'
import PDCView from '@/views/legal/PDCView.vue'
import PCookiesView from '@/views/legal/PCookiesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/verify-email',
      name: 'email_verification',
      component: EmailVerificationView
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView
    },
    {
      path: '/sneakers/:slugSneaker',
      name: 'sneakers',
      component: SneakerView
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView
    },
    {
      path: '/checkout',
      children: [
        {
          path: '',
          name: 'checkout',
          component: CheckoutView
        },
        {
          path: 'success/:reference',
          name: 'success',
          component: CheckoutSuccessView
        },
        {
          path: 'cancel/:reference',
          name: 'cancel',
          component: CheckoutCancelView
        }
      ]
    },
    {
      path: '/reset-password',
      name: 'reset_password',
      component: ResetPasswordView
    },
    {
      path: '/legal',
      children: [
        { path: 'cgu', name: 'cgu', component: CGUView },
        { path: 'cgv', name: 'cgv', component: CGVView },
        {
          path: 'politique-de-confidentialite',
          name: 'politique-de-confidentialite',
          component: PDCView
        },
        { path: 'politique-de-cookies', name: 'politique-de-cookies', component: PCookiesView }
      ]
    },
    {
      path: '/profile',
      children: [
        {
          path: '',
          name: 'profile',
          component: () => ProfileView
        },
        {
          path: 'addresses',
          name: 'addresses',
          component: () => import('@/views/profile/AddressesView.vue')
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => OrdersView
        },
        {
          path: 'orders/:reference',
          name: 'order',
          component: () => DetailOrderView
        }
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      redirect: '/admin/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'admin_dashboard',
          component: BasePageAdminView
        },
        {
          path: 'sneakers',
          children: [
            {
              path: '',
              name: 'admin_sneakers',
              component: () => import('@/views/admin/SneakersAdminView.vue')
            },
            {
              path: 'add',
              name: 'admin_sneakers_add',
              component: () => import('@/views/admin/forms/SneakerForm.vue')
            },
            {
              path: ':id',
              name: 'admin_sneakers_edit',
              component: () => import('@/views/admin/forms/SneakerForm.vue')
            }
          ]
        },
        {
          path: 'categories',
          children: [
            {
              path: '',
              name: 'admin_categories',
              component: () => import('@/views/admin/CategoriesAdminView.vue')
            },
            {
              path: 'add',
              name: 'admin_categories_add',
              component: () => import('@/views/admin/forms/CategoryForm.vue')
            },
            {
              path: ':id',
              name: 'admin_categories_edit',
              component: () => import('@/views/admin/forms/CategoryForm.vue')
            }
          ]
        },
        {
          path: 'brands',
          children: [
            {
              path: '',
              name: 'admin_brands',
              component: () => import('@/views/admin/BrandsAdminView.vue')
            },
            {
              path: 'add',
              name: 'admin_brands_add',
              component: () => import('@/views/admin/forms/BrandForm.vue')
            },
            {
              path: ':id',
              name: 'admin_brands_edit',
              component: () => import('@/views/admin/forms/BrandForm.vue')
            }
          ]
        },
        {
          path: 'colors',
          children: [
            {
              path: '',
              name: 'admin_colors',
              component: () => import('@/views/admin/ColorsAdminView.vue')
            },
            {
              path: 'add',
              name: 'admin_colors_add',
              component: () => import('@/views/admin/forms/ColorForm.vue')
            },
            {
              path: ':id',
              name: 'admin_colors_edit',
              component: () => import('@/views/admin/forms/ColorForm.vue')
            }
          ]
        },
        {
          path: 'variants',
          children: [
            {
              path: '',
              name: 'admin_variants',
              component: () => import('@/views/admin/VariantsAdminView.vue')
            },
            {
              path: 'add',
              name: 'admin_variants_add',
              component: () => import('@/views/admin/forms/VariantForm.vue')
            },
            {
              path: ':id',
              name: 'admin_variants_edit',
              component: async () => {
                const { isAuthenticated, roles } = await checkAuth()
                if (isAuthenticated && roles.includes('ADMIN')) {
                  return import('@/views/admin/forms/VariantForm.vue')
                } else {
                  return import('@/views/admin/forms/StoreForm.vue')
                }
              }
            }
          ]
        },
        {
          path: 'orders',
          children: [
            {
              path: '',
              name: 'admin_orders',
              component: () => import('@/views/admin/OrdersAdminView.vue')
            },
            {
              path: ':id',
              name: 'admin_orders_edit',
              component: () => import('@/views/admin/forms/OrderForm.vue')
            }
          ]
        },
        {
          path: 'store',
          name: 'store',
          component: () => import('@/views/admin/StoreAdminView.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not_found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

const publicRoutes = [
  'home',
  'email_verification',
  'search',
  'sneakers',
  'reset_password',
  'cgu',
  'cgv',
  'politique-de-confidentialite',
  'politique-de-cookies'
]

const adminRoutes = [
  'admin_dashboard',
  'admin_categories',
  'admin_categories_add',
  'admin_categories_edit',
  'admin_brands',
  'admin_brands_add',
  'admin_brands_edit',
  'admin_sneakers',
  'admin_sneakers_add',
  'admin_sneakers_edit',
  'admin_colors',
  'admin_colors_add',
  'admin_colors_edit',
  'admin_orders',
  'admin_orders_edit',
  'admin_variants',
  'admin_variants_add',
  'admin_variants_edit'
]

const storeRoutes = ['admin_store', 'admin_dashboard', 'admin_variants_edit', 'store']

router.beforeEach(async (to) => {
  const { isAuthenticated, roles } = await checkAuth()

  if (!publicRoutes.includes(to.name as string) && !isAuthenticated) {
    router.push('/')
  }
  if (!roles.includes('ADMIN') && adminRoutes.includes(to.name as string)) {
    router.push('/')
  }

  if (
    !roles.includes('ADMIN') &&
    !roles.includes('STORE_KEEPER') &&
    (adminRoutes.includes(to.name as string) || storeRoutes.includes(to.name as string))
  ) {
    router.push('/')
  }

  return true
})

export default router
