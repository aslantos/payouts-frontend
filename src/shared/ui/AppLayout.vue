<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/features/auth/model/authStore'

const route = useRoute()
const authStore = useAuthStore()

// Меняется автоматически при изменении authStore.user.role —
// computed «следит» за реактивным значением из Pinia
const navLinks = computed(() => {
  if (authStore.user?.role === 'CONTRACTOR') {
    return [
      { label: 'Доступные задачи', path: '/tasks' },
      { label: 'Мои договоры', path: '/contracts' },
      { label: 'Профиль', path: '/profile' },
    ]
  }
  return [
    { label: 'Задачи', path: '/tasks' },
    { label: 'Договоры', path: '/contracts' },
    { label: 'Шаблоны', path: '/templates' },
    { label: 'Выплаты', path: '/payouts' },
    { label: 'Профиль', path: '/profile' },
  ]
})

const avatarLetter = computed(() =>
  authStore.user?.email?.[0]?.toUpperCase() ?? '?'
)

function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <header class="bg-white shadow-sm px-6 py-3">
      <div class="flex items-center justify-between">

        <!-- Левая часть: логотип + навигация -->
        <div class="flex items-center gap-6">

          <!-- Логотип -->
          <RouterLink to="/dashboard" class="shrink-0">
            <div class="w-9 h-9 rounded-lg bg-[#01978E] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.6676 0C18.1164 0.0264099 17.0024 0.281706 16.2633 0.739478L6.13352 5.326L0.501254 11.8044C-0.685582 13.3537 0.157697 16.3469 3.86396 14.4277L7.92419 9.90284C13.0776 6.14471 23.5925 7.86928 18.6057 15.4137C16.1592 19.7802 17.3044 21.9106 20.4588 22.8085L21.8955 18.7238C24.3837 13.9876 29.027 13.1337 28.8396 9.31302L40 9.99087L39.8959 0.123246L19.6676 0ZM14.0354 9.10174C12.2239 9.07533 10.4436 9.70917 9.15266 10.6247L5.08203 15.1496C6.19599 15.8979 7.32036 15.4929 8.43432 14.5862C9.74608 15.1496 10.7663 14.2781 11.5992 12.535C11.9428 11.3466 12.4529 10.5103 14.0354 9.10174ZM5.74832 17.5529C5.70668 17.5529 5.65462 17.5529 5.61298 17.5617C5.26942 17.6233 4.8634 17.9315 4.59272 18.6357C4.31162 19.34 4.24916 20.3436 4.49902 21.4176C4.74888 22.4828 5.26942 23.3895 5.85243 23.9529C6.41461 24.5075 6.93515 24.666 7.27871 24.6044C7.63268 24.5515 8.02829 24.2346 8.29898 23.5392C8.58007 22.8349 8.65294 21.8225 8.40308 20.7573C8.14281 19.6833 7.62227 18.7766 7.04967 18.222C6.54995 17.729 6.09188 17.5529 5.74832 17.5529ZM14.3477 26.9548C13.5252 26.9637 12.4945 27.1837 11.4847 27.5975C10.3291 28.0817 9.42335 28.7507 8.93404 29.367C8.44473 29.9744 8.40308 30.4322 8.55925 30.7051C8.71541 30.9692 9.17349 31.2244 10.048 31.2597C10.9225 31.3037 12.0989 31.1012 13.2545 30.617C14.4101 30.1328 15.3159 29.4726 15.8052 28.8564C16.2945 28.2489 16.3361 27.7824 16.18 27.5183C16.0238 27.2454 15.5657 26.9989 14.6912 26.9637C14.5767 26.9548 14.4726 26.9548 14.3477 26.9548ZM4.18669 35.3708C3.69738 35.3796 3.24972 35.4412 2.8541 35.5381C1.96918 35.7582 1.45905 36.1543 1.29248 36.6209C1.11549 37.0963 1.29248 37.6597 1.8859 38.2671C2.48973 38.8657 3.49958 39.4379 4.74888 39.7549C5.98777 40.0718 7.19543 40.063 8.09076 39.8341C8.98609 39.614 9.49622 39.2179 9.6628 38.7513C9.82937 38.2759 9.6628 37.7125 9.05897 37.1051C8.46555 36.5064 7.4557 35.9342 6.2064 35.6173C5.49846 35.4412 4.81134 35.362 4.18669 35.3708Z" fill="white"/>
              </svg>
            </div>
          </RouterLink>

          <!-- Навигация -->
          <nav class="flex items-center gap-1">
            <RouterLink
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              :class="[
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                isActive(link.path)
                  ? 'bg-[#01978E] text-white'
                  : 'text-gray-600 hover:text-[#01978E]',
              ]"
            >
              {{ link.label }}
            </RouterLink>
          </nav>
        </div>

        <!-- Правая часть: колокольчик + аватар -->
        <div class="flex items-center gap-2 shrink-0">
          <button class="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          <RouterLink
            to="/profile"
            class="w-8 h-8 rounded-md bg-[#01978E] text-white text-xs font-semibold flex items-center justify-center hover:opacity-80 transition-opacity"
          >
            {{ avatarLetter }}
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- Контент страницы -->
    <main>
      <RouterView />
    </main>
  </div>
</template>
