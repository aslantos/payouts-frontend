import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/features/auth/model/authStore'
import LoginPage from '@/pages/login/LoginPage.vue'
import RegisterCompanyPage from '@/pages/register-company/RegisterCompanyPage.vue'
import DashboardPage from '@/pages/dashboard/DashboardPage.vue'
import PayoutDetailPage from '@/pages/payout-detail/PayoutDetailPage.vue'
import PayoutsPage from '@/pages/payouts/PayoutsPage.vue'
import TariffsPage from '@/pages/tariffs/TariffsPage.vue'
import UsersPage from '@/pages/users/UsersPage.vue'
import WorkLogNewPage from '@/pages/work-log-new/WorkLogNewPage.vue'
import WorkLogsPage from '@/pages/work-logs/WorkLogsPage.vue'
import WorkTypesPage from '@/pages/work-types/WorkTypesPage.vue'
import HomePage from '@/pages/home/HomePage.vue'


const routes = [
  { path: '/login', component: LoginPage },
  { path: '/register-company', component: RegisterCompanyPage },
  { path: '/dashboard', component: DashboardPage, meta: { requiresAuth: true } },
  { path: '/payouts/:id', component: PayoutDetailPage, meta: { requiresAuth: true } },
  { path: '/payouts', component: PayoutsPage, meta: { requiresAuth: true } },
  { path: '/tariffs', component: TariffsPage, meta: { requiresAuth: true } },
  { path: '/users', component: UsersPage, meta: { requiresAuth: true } },
  { path: '/work-logs', component: WorkLogsPage, meta: { requiresAuth: true } },
  { path: '/work-logs/new', component: WorkLogNewPage, meta: { requiresAuth: true } },
  { path: '/work-types', component: WorkTypesPage, meta: { requiresAuth: true } },
  {path: '/', component: HomePage}
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }

  if (to.path === '/login' && authStore.isAuthenticated) {
    return '/dashboard'
  }
})
