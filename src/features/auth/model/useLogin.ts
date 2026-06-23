import { useMutation } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'
import { useAuthStore } from '@/features/auth/model/authStore'
import type { AuthResponse } from '@/shared/types/api'

type LoginPayload = {
  email: string
  password: string
}

export function useLogin() {
  const authStore = useAuthStore()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const response = await http.post<AuthResponse>('/auth/login', payload)
      return response.data
    },
    onSuccess: (data) => {
      authStore.setToken(data.accessToken)
      authStore.setUser(data.user)
    },
  })
}
