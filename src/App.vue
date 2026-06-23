<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { AxiosError } from 'axios'
import { http } from '@/shared/api/http'
import { useAuthStore } from '@/features/auth/model/authStore'
import type { UserResponse } from '@/shared/types/api'

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  if (!authStore.token) return
  try {
    const response = await http.get<UserResponse>('/auth/me')
    authStore.setUser(response.data)
  } catch (err) {
    // 401 = токен истёк → чистим и редиректим на логин
    // 403 = Spring Security (проблема конфига бэка) → не трогаем токен
    if ((err as AxiosError)?.response?.status === 401) {
      authStore.clearToken()
      router.push('/login')
    }
  }
})
</script>

<template>
  <RouterView />
</template>
