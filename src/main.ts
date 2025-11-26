import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

import HomePage from './pages/HomePage.vue'
import FormPage from './pages/FormPage.vue'
import ThankYouPage from './pages/ThankYouPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/thank-you', component: ThankYouPage },
    { path: '/:uniqueId', component: FormPage }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')

