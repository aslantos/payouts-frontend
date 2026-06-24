<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '@/shared/api/http'
import { useAuthStore } from '@/features/auth/model/authStore'
import type { UserResponse } from '@/shared/types/api'

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  try {
    if (authStore.token) {
      const response = await http.get<UserResponse>('/auth/me')
      authStore.setUser(response.data)
    }
  } catch (error: any) {
  // Только 401 = невалидный токен → разлогинить
  if (error?.response?.status === 401) {
    authStore.clearToken()
    router.push('/login')
  }
  // 403, 500, сеть и т.д. — токен есть, просто /me недоступен
  // НЕ разлогиниваем, продолжаем как залогиненный
} finally {
  authStore.setReady()
}
})
</script>

<template>
  <RouterView />
</template>
