import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // токен, при старте берём из localStorage (если был сохранён)
  const token = ref<string | null>(localStorage.getItem('access_token'))

  // вычисляемое: залогинен, если токен есть
  const isAuthenticated = computed(() => !!token.value)

  // сохранить токен (при логине)
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('access_token', newToken)
  }

  // удалить токен (при логауте)
  function clearToken() {
    token.value = null
    localStorage.removeItem('access_token')
  }

  return { token, isAuthenticated, setToken, clearToken }
})