import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/login/LoginPage.vue'
import DashboardPage from '@/pages/dashboard/DashboardPage.vue'
import PayoutDetailPage from '@/pages/payout-detail/PayoutDetailPage.vue'
import PayoutsPage from '@/pages/payouts/PayoutsPage.vue'
import TariffsPage from '@/pages/tariffs/TariffsPage.vue'
import UsersPage from '@/pages/users/UsersPage.vue'
import WorkLogNewPage from '@/pages/work-log-new/WorkLogNewPage.vue'
import WorkLogsPage from '@/pages/work-logs/WorkLogsPage.vue'
import WorkTypesPage from '@/pages/work-types/WorkTypesPage.vue'

const routes = [
  { path: '/login', component: LoginPage },
  { path: '/dashboard', component: DashboardPage },
  { path: '/payouts/:id', component: PayoutDetailPage },
  { path: '/payouts', component: PayoutsPage },
  { path: '/tariffs', component: TariffsPage },
  { path: '/users', component: UsersPage },
  { path: '/work-logs', component: WorkLogsPage },
  { path: '/work-logs/new', component: WorkLogNewPage},
  { path: '/work-types', component: WorkTypesPage },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
