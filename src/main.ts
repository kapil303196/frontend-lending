import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

import HomePage from './pages/HomePage.vue'
import FormPage from './pages/FormPage.vue'
import ThankYouPage from './pages/ThankYouPage.vue'
import AdminLoginPage from './pages/AdminLoginPage.vue'
import AdminOverviewPage from './pages/AdminOverviewPage.vue'
import AdminApplicationsPage from './pages/AdminApplicationsPage.vue'
import { useAuth } from './composables/useAuth'
import { useUserAuth } from './composables/useUserAuth'
// import LenderWelcome from './pages/LenderWelcome/LenderWelcome.vue'
import ThankYouNew from './pages/ThankYouNew/ThankYouNew.vue'
import UserLoginPage from './pages/UserLoginPage.vue'
import UserDashboardPage from './pages/UserDashboardPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/thank-you', component: ThankYouPage },
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
    { path: '/:uniqueId', component: FormPage },
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
    { path: '/form/:uniqueId', component: FormPage },
    // { path: '/:uniqueId', component: LenderWelcome }
  ]
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated, verifyToken } = useAuth()
  const { isAuthenticated: isUserAuthenticated, verifyToken: verifyUserToken } = useUserAuth()

  // Admin authentication
  if (to.meta.requiresAuth) {
    if (!isAuthenticated.value) {
      next('/admin/login')
      return
    }
    
    const isValid = await verifyToken()
    if (!isValid) {
      next('/admin/login')
      return
    }
  }

  // User authentication
  if (to.meta.requiresUserAuth) {
    if (!isUserAuthenticated.value) {
      next('/user/login')
      return
    }
    
    const isValid = await verifyUserToken()
    if (!isValid) {
      next('/user/login')
      return
    }
  }

  // Admin guest routes (login page)
  if (to.meta.requiresGuest && isAuthenticated.value) {
    next('/admin/dashboard')
    return
  }

  // User guest routes (login page)
  if (to.meta.requiresUserGuest && isUserAuthenticated.value) {
    next('/user/dashboard')
    return
  }

  next()
})

const app = createApp(App)
app.use(router)
app.mount('#app')

