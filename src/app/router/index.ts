import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/login/LoginPage.vue'
import DashboardPage from '@/pages/dashboard/DashboardPage.vue'

const routes = [
  { path: '/login', component: LoginPage },
  { path: '/dashboard', component: DashboardPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})