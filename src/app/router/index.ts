import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/features/auth/model/authStore'
import AppLayout from '@/shared/ui/AppLayout.vue'
import LoginPage from '@/pages/login/LoginPage.vue'
import RegisterCompanyPage from '@/pages/register-company/RegisterCompanyPage.vue'
import HomePage from '@/pages/home/HomePage.vue'
import DashboardPage from '@/pages/dashboard/DashboardPage.vue'
import TasksPage from '@/pages/tasks/TasksPage.vue'
import ContractsPage from '@/pages/contracts/ContractsPage.vue'
import TemplatesPage from '@/pages/templates/TemplatesPage.vue'
import ProfilePage from '@/pages/profile/ProfilePage.vue'
// Старые страницы оставлены — спроси у пользователя, нужны ли они дальше
import PeoplePage from '@/pages/people/PeoplePage.vue'
import WorksPage from '@/pages/works/WorksPage.vue'
import ContractPage from '@/pages/contract/ContractPage.vue'
import CompanyPage from '@/pages/company/CompanyPage.vue'
import PayoutsPage from '@/pages/payouts/PayoutsPage.vue'
import TariffsPage from '@/pages/tariffs/TariffsPage.vue'

const routes = [
  // Публичные — без навбара
  { path: '/login', component: LoginPage },
  { path: '/register-company', component: RegisterCompanyPage },
  { path: '/', component: HomePage },

  // Приватные — внутри AppLayout (дочерние маршруты)
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: DashboardPage },
      { path: 'tasks', component: TasksPage },
      { path: 'contracts', component: ContractsPage },
      { path: 'templates', component: TemplatesPage },
      { path: 'profile', component: ProfilePage },
      // Старые маршруты — пока оставлены, уточни нужны ли
      { path: 'people', component: PeoplePage },
      { path: 'works', component: WorksPage },
      { path: 'contract', component: ContractPage },
      { path: 'company', component: CompanyPage },
      { path: 'payouts', component: PayoutsPage },
      { path: 'tariffs', component: TariffsPage },
    ],
  },
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
