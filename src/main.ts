import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

import HomePage from './pages/HomePage.vue'
import FormPage from './pages/FormPage.vue'
// import ThankYouPage from './pages/ThankYouPage.vue'
import AdminLoginPage from './pages/AdminLoginPage.vue'
import AdminOverviewPage from './pages/AdminOverviewPage.vue'
import AdminApplicationsPage from './pages/AdminApplicationsPage.vue'
import DealerLoginPage from './pages/DealerLoginPage.vue'
import DealerOffersPage from './pages/DealerOffersPage.vue'
import { useAuth } from './composables/useAuth'
import { useDealerAuth } from './composables/useDealerAuth'
import LenderWelcome from './pages/LenderWelcome/LenderWelcome.vue'
import ThankYouNew from './pages/ThankYouNew/ThankYouNew.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    // { path: '/thank-you', component: ThankYouPage },
    { path: '/thank-you', component: ThankYouNew },
    { 
      path: '/admin/login', 
      component: AdminLoginPage,
      meta: { requiresGuest: true }
    },
    {
      path: '/mcalending/login',
      component: DealerLoginPage,
      meta: { requiresDealerGuest: true }
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
    {
      path: '/mcalending',
      component: DealerOffersPage,
      meta: { requiresDealerAuth: true }
    },
    { path: '/form/:uniqueId', component: FormPage },
    { path: '/:uniqueId', component: LenderWelcome }
  ]
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, verifyToken } = useAuth()
  const { isAuthenticated: isDealerAuthenticated, verifyToken: verifyDealerToken } = useDealerAuth()

  if (to.meta.requiresAuth) {
    // Check if user is authenticated
    if (!isAuthenticated.value) {
      next('/admin/login')
      return
    }
    
    // Verify token is still valid
    const isValid = await verifyToken()
    if (!isValid) {
      next('/admin/login')
      return
    }
  }

  if (to.meta.requiresDealerAuth) {
    if (!isDealerAuthenticated.value) {
      next('/mcalending/login')
      return
    }

    const isValidDealer = await verifyDealerToken()
    if (!isValidDealer) {
      next('/mcalending/login')
      return
    }
  }

  if (to.meta.requiresGuest && isAuthenticated.value) {
    next('/admin/dashboard')
    return
  }

  if (to.meta.requiresDealerGuest && isDealerAuthenticated.value) {
    next('/mcalending')
    return
  }

  next()
})

const app = createApp(App)
app.use(router)
app.mount('#app')

