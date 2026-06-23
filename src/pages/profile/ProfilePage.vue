<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/model/authStore'
import BaseButton from '@/shared/ui/BaseButton.vue'
import type { UserRole } from '@/shared/types/api'

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

function handleLogout() {
  authStore.clearToken()
  router.push('/login')
}

type RoleConfig = { label: string; cls: string }

const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  ADMIN:      { label: 'Администратор', cls: 'bg-indigo-100 text-indigo-700' },
  MANAGER:    { label: 'Менеджер',      cls: 'bg-blue-100 text-blue-700' },
  ACCOUNTANT: { label: 'Бухгалтер',     cls: 'bg-orange-100 text-orange-700' },
  CONTRACTOR: { label: 'Подрядчик',     cls: 'bg-[#01978E]/10 text-[#01978E]' },
}

const roleConfig = computed<RoleConfig>(() =>
  user.value?.role
    ? (ROLE_CONFIG[user.value.role] ?? { label: user.value.role, cls: 'bg-gray-100 text-gray-600' })
    : { label: '—', cls: 'bg-gray-100 text-gray-600' }
)
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto flex flex-col gap-6">
    <h1 class="text-2xl font-bold text-gray-800">Профиль</h1>

    <!-- Нет данных — на случай если user null после перезагрузки до onMounted -->
    <div
      v-if="!user"
      class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-400"
    >
      Загружаем данные профиля...
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">

      <!-- Email + Роль -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs text-gray-400 mb-0.5">Email</p>
          <p class="text-gray-800 font-medium">{{ user.email }}</p>
        </div>
        <span :class="['shrink-0 text-xs font-medium px-2.5 py-1 rounded-full', roleConfig.cls]">
          {{ roleConfig.label }}
        </span>
      </div>

      <!-- Компания (если есть — роль компании) -->
      <div v-if="user.company" class="border-t border-gray-100 pt-4">
        <p class="text-xs text-gray-400 mb-2">Компания</p>
        <p class="text-gray-800 font-semibold">{{ user.company.name }}</p>
        <p class="text-sm text-gray-500 mt-0.5">БИН: {{ user.company.bin }}</p>
      </div>

      <!-- Статус занятости (только для подрядчика) -->
      <div v-if="user.role === 'CONTRACTOR'" class="border-t border-gray-100 pt-4">
        <p class="text-xs text-gray-400 mb-1">Форма занятости</p>
        <p class="text-sm text-gray-700 font-medium">
          {{ user.selfEmployed ? 'Самозанятый' : 'Физическое лицо' }}
        </p>
      </div>

      <!-- Кнопка выхода -->
      <div class="border-t border-gray-100 pt-4">
        <BaseButton class="w-full" @click="handleLogout">
          Выйти из аккаунта
        </BaseButton>
      </div>

    </div>
  </div>
</template>
