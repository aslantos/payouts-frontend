<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/model/authStore'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.clearToken()
  router.push('/login')
}
</script>

<template>
  <div class="p-8 flex items-center justify-between">
    <span class="text-2xl">Дашборд (/dashboard)</span>
    <button
      @click="handleLogout"
      class="px-4 py-2 text-sm font-semibold text-white bg-[#01978E] rounded-lg hover:bg-[#017d75] transition-colors"
    >
      Выйти
    </button>
  </div>
</template>