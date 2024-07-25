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
import AboutView from '@/views/legal/AboutView.vue'
import ValeurView from '@/views/legal/ValeurView.vue'
import EngagementView from '@/views/legal/EngagementView.vue'
import AddressesView from '@/views/profile/AddressesView.vue'
import SneakersAdminView from '@/views/admin/SneakersAdminView.vue'
import SneakerForm from '@/views/admin/forms/SneakerForm.vue'
import CategoriesAdminView from '@/views/admin/CategoriesAdminView.vue'
import CategoryForm from '@/views/admin/forms/CategoryForm.vue'
import BrandsAdminView from '@/views/admin/BrandsAdminView.vue'
import BrandForm from '@/views/admin/forms/BrandForm.vue'
import ColorsAdminView from '@/views/admin/ColorsAdminView.vue'
import ColorForm from '@/views/admin/forms/ColorForm.vue'
import VariantsAdminView from '@/views/admin/VariantsAdminView.vue'
import VariantForm from '@/views/admin/forms/VariantForm.vue'
import OrdersAdminView from '@/views/admin/OrdersAdminView.vue'
import OrderForm from '@/views/admin/forms/OrderForm.vue'
import StoreAdminView from '@/views/admin/StoreAdminView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import StoreForm from '@/views/admin/forms/StoreForm.vue'

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
        { path: 'politique-de-cookies', name: 'politique-de-cookies', component: PCookiesView },
        {
          path: 'notre-histoire',
          name: 'notre-histoire',
          component: AboutView
        },
        {
          path: 'nos-valeurs',
          name: 'nos-valeurs',
          component: ValeurView
        },
        {
          path: 'nos-engagements',
          name: 'nos-engagements',
          component: EngagementView
        }
      ]
    },
    {
      path: '/profile',
      children: [
        {
          path: '',
          name: 'profile',
          component: ProfileView
        },
        {
          path: 'addresses',
          name: 'addresses',
          component: AddressesView
        },
        {
          path: 'orders',
          name: 'orders',
          component: OrdersView
        },
        {
          path: 'orders/:reference',
          name: 'order',
          component: DetailOrderView
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
              component: SneakersAdminView
            },
            {
              path: 'add',
              name: 'admin_sneakers_add',
              component: SneakerForm
            },
            {
              path: ':id',
              name: 'admin_sneakers_edit',
              component: SneakerForm
            }
          ]
        },
        {
          path: 'categories',
          children: [
            {
              path: '',
              name: 'admin_categories',
              component: CategoriesAdminView
            },
            {
              path: 'add',
              name: 'admin_categories_add',
              component: CategoryForm
            },
            {
              path: ':id',
              name: 'admin_categories_edit',
              component: CategoryForm
            }
          ]
        },
        {
          path: 'brands',
          children: [
            {
              path: '',
              name: 'admin_brands',
              component: BrandsAdminView
            },
            {
              path: 'add',
              name: 'admin_brands_add',
              component: BrandForm
            },
            {
              path: ':id',
              name: 'admin_brands_edit',
              component: BrandForm
            }
          ]
        },
        {
          path: 'colors',
          children: [
            {
              path: '',
              name: 'admin_colors',
              component: ColorsAdminView
            },
            {
              path: 'add',
              name: 'admin_colors_add',
              component: ColorForm
            },
            {
              path: ':id',
              name: 'admin_colors_edit',
              component: ColorForm
            }
          ]
        },
        {
          path: 'variants',
          children: [
            {
              path: '',
              name: 'admin_variants',
              component: VariantsAdminView
            },
            {
              path: 'add',
              name: 'admin_variants_add',
              component: VariantForm
            },
            {
              path: ':id',
              name: 'admin_variants_edit',
              component: async () => {
                const { isAuthenticated, roles } = await checkAuth()
                if (isAuthenticated && roles.includes('ADMIN')) {
                  return VariantForm
                } else {
                  return StoreForm
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
              component: OrdersAdminView
            },
            {
              path: ':id',
              name: 'admin_orders_edit',
              component: OrderForm
            }
          ]
        },
        {
          path: 'store',
          name: 'store',
          component: StoreAdminView
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not_found',
      component: NotFoundView
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
  'admin_variants_add'
]

const storeRoutes = ['admin_store', 'admin_dashboard', 'admin_variants_edit', 'store']

router.beforeEach(async (to) => {
  const { isAuthenticated, roles } = await checkAuth()

  // Si l'utilisateur n'est pas authentifié et qu'il tente d'accéder à une route protégée (non publique)
  if (!publicRoutes.includes(to.name as string) && !isAuthenticated) {
    router.push('/')
  }

  // Ne pas autoriser les utilisateurs non-admin à accéder aux routes d'admin
  if (!roles.includes('ADMIN') && adminRoutes.includes(to.name as string)) {
    router.push('/')
  }

  // Ne pas autoriser les utilisateurs non-admin et non-store_keeper à accéder aux routes de store et admin
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
