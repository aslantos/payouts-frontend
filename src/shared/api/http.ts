import axios from 'axios'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? ''
    // Не редиректим при ошибке логина/регистрации — 401 там означает "неверный пароль"
    const isAuthMutation = url.includes('/auth/login') || url.includes('/auth/register')
    if (error.response?.status === 401 && !isAuthMutation) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('auth_user')
      // window.location вместо router.push — избегаем circular import (http → router → ... → http)
      // Полная перезагрузка при истёкшей сессии — сбрасывает все состояния чисто
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)