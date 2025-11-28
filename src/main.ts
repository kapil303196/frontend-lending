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
import { useAuth } from './composables/useAuth'
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
      path: '/admin/dashboard', 
      component: AdminOverviewPage,
      meta: { requiresAuth: true }
    },
    { 
      path: '/admin/applications', 
      component: AdminApplicationsPage,
      meta: { requiresAuth: true }
    },
    { path: '/form/:uniqueId', component: FormPage },
    { path: '/:uniqueId', component: LenderWelcome }
  ]
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, verifyToken } = useAuth()

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

  if (to.meta.requiresGuest && isAuthenticated.value) {
    next('/admin/dashboard')
    return
  }

  next()
})

const app = createApp(App)
app.use(router)
app.mount('#app')

