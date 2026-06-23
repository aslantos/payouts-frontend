<script setup lang="ts">
import { onMounted } from 'vue'
import type { AxiosError } from 'axios'
import { http } from '@/shared/api/http'
import { useAuthStore } from '@/features/auth/model/authStore'
import type { UserResponse } from '@/shared/types/api'

const authStore = useAuthStore()

onMounted(async () => {
  if (!authStore.token) return
  try {
    const response = await http.get<UserResponse>('/auth/me')
    authStore.setUser(response.data)
  } catch (err) {
    // 401 = токен истёк или невалидный → выход
    // 403 = Spring Security не пустил (проблема конфига бэка) → не трогаем токен
    const status = (err as AxiosError)?.response?.status
    if (status === 401) {
      authStore.clearToken()
    }
  }
})
</script>

<template>
  <RouterView />
</template>
