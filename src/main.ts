import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Pages
import HomePage from './pages/HomePage.vue'
import FormPage from './pages/FormPage.vue'
import AdminLoginPage from './pages/AdminLoginPage.vue'
import AdminOverviewPage from './pages/AdminOverviewPage.vue'
import AdminApplicationsPage from './pages/AdminApplicationsPage.vue'
import DealerLoginPage from './pages/DealerLoginPage.vue'
import DealerOffersPage from './pages/DealerOffersPage.vue'
import ThankYouNew from './pages/ThankYouNew/ThankYouNew.vue'
import UserLoginPage from './pages/UserLoginPage.vue'
import UserDashboardPage from './pages/UserDashboardPage.vue'
import LenderWelcome from './pages/LenderWelcome/LenderWelcome.vue'

// Auth composables
import { useAuth } from './composables/useAuth'
import { useUserAuth } from './composables/useUserAuth'
import { useDealerAuth } from './composables/useDealerAuth'

// Router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Public
    { path: '/', component: HomePage },
    { path: '/thank-you', component: ThankYouNew },
    { path: '/form/:uniqueId', component: FormPage },
    { path: '/:uniqueId', component: LenderWelcome },

    // Admin
    {
      path: '/admin/login',
      component: AdminLoginPage,
      meta: { requiresGuest: true }
    },
    {
      path: '/admin/dashboard',
      component: AdminOverviewPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin/applications',
      component: AdminApplicationsPage,
      meta: { requiresAuth: true }
    },

    // User
    {
      path: '/user/login',
      component: UserLoginPage,
      meta: { requiresUserGuest: true }
    },
    {
      path: '/user/dashboard',
      component: UserDashboardPage,
      meta: { requiresUserAuth: true }
    },

    // Dealer
    {
      path: '/mcalending/login',
      component: DealerLoginPage,
      meta: { requiresDealerGuest: true }
    },
    {
      path: '/mcalending',
      component: DealerOffersPage,
      meta: { requiresDealerAuth: true }
    }
  ]
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, verifyToken } = useAuth()
  const { isAuthenticated: isUserAuthenticated, verifyToken: verifyUserToken } = useUserAuth()
  const { isAuthenticated: isDealerAuthenticated, verifyToken: verifyDealerToken } = useDealerAuth()

  // Admin protected routes
  if (to.meta.requiresAuth) {
    if (!isAuthenticated.value || !(await verifyToken())) {
      return next('/admin/login')
    }
  }

  // User protected routes
  if (to.meta.requiresUserAuth) {
    if (!isUserAuthenticated.value || !(await verifyUserToken())) {
      return next('/user/login')
    }
  }

  // Dealer protected routes
  if (to.meta.requiresDealerAuth) {
    if (!isDealerAuthenticated.value || !(await verifyDealerToken())) {
      return next('/mcalending/login')
    }
  }

  // Admin guest routes
  if (to.meta.requiresGuest && isAuthenticated.value) {
    return next('/admin/dashboard')
  }

  // User guest routes
  if (to.meta.requiresUserGuest && isUserAuthenticated.value) {
    return next('/user/dashboard')
  }

  // Dealer guest routes
  if (to.meta.requiresDealerGuest && isDealerAuthenticated.value) {
    return next('/mcalending')
  }

  next()
})

// App init
const app = createApp(App)
app.use(router)
app.mount('#app')
