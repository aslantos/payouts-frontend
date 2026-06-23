import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserResponse } from '@/shared/types/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('access_token'))

  const storedUser = localStorage.getItem('auth_user')
  const user = ref<UserResponse | null>(storedUser ? JSON.parse(storedUser) : null)

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('access_token', newToken)
  }

  function setUser(newUser: UserResponse) {
    user.value = newUser
    localStorage.setItem('auth_user', JSON.stringify(newUser))
  }

  function clearToken() {
    token.value = null
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('auth_user')
  }

  return { token, user, isAuthenticated, setToken, setUser, clearToken }
})
