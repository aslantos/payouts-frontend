import { useMutation } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'
import { useAuthStore } from '@/features/auth/model/authStore'

type LoginResponse = {
  access_token: string
}

type LoginPayload = {
  email: string
  password: string
}

export function useLogin() {
  const authStore = useAuthStore()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await http.post<LoginResponse>('/auth/login', payload)
      return response.data
    },
    onSuccess: (data) => {
      authStore.setToken(data.access_token)
    },
  })
}