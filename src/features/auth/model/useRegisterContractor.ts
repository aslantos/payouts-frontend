import { useMutation } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'
import { useAuthStore } from '@/features/auth/model/authStore'
import { useAppToast } from '@/shared/lib/toast'
import type { AuthResponse } from '@/shared/types/api'

type RegisterContractorPayload = {
  userame: string // намеренная опечатка — именно так называется поле в Spring API
  email: string
  password: string
  selfEmployed: boolean
}

export function useRegisterContractor() {
  const authStore = useAuthStore()
  const { success, handleError } = useAppToast()

  return useMutation({
    mutationFn: async (payload: RegisterContractorPayload) => {
      const response = await http.post<AuthResponse>('/auth/register-contractor', payload)
      return response.data
    },
    onSuccess: (data) => {
      authStore.setToken(data.accessToken)
      authStore.setUser(data.user)
      success('Аккаунт успешно создан!')
    },
    onError: handleError,
  })
}
