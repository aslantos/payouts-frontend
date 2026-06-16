import { useMutation } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'
import { useAuthStore } from '@/features/auth/model/authStore'

type LoginResponse = {
  access_token?: string
  access?: string
  token?: string
}

type LoginPayload = {
  username: string
  password: string
}

export function useLogin() {
  const authStore = useAuthStore()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await http.post<LoginResponse>('/auth/login/', payload)
      const token = response.data.access_token ?? response.data.access ?? response.data.token
      if (!token) {
        throw new Error('Сервер не вернул токен')
      }
      return token
    },
    onSuccess: (token) => {
      authStore.setToken(token)
    },
  })
}