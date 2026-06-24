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
  } catch {
    // /auth/me вернул ошибку (401, 403, 500, сеть) → токен недействителен
    authStore.clearToken()
    router.push('/login')
  } finally {
    // Всегда сигнализируем guard'у что сессия восстановлена (или сброшена)
    authStore.setReady()
  }
})
</script>

<template>
  <RouterView />
</template>
