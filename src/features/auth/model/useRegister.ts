import { useMutation } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'
import { useAuthStore } from '@/features/auth/model/authStore'
import type { AuthResponse } from '@/shared/types/api'

type RegisterPayload = {
  companyName: string
  bin: string
  email: string
  password: string
}

export function useRegister() {
  const authStore = useAuthStore()

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await http.post<AuthResponse>('/auth/register', payload)
      return response.data
    },
    onSuccess: (data) => {
      authStore.setToken(data.accessToken)
      authStore.setUser(data.user)
    },
  })
}
