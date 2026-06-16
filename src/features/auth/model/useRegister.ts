import { useMutation } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'

type RegisterResponse = {
  id: number
  username: string
  email: string
  role: string
  company: number | null
  is_self_employed: boolean
}

type RegisterPayload = {
  company_name: string
  bin: string
  username: string
  email: string
  password: string
}

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await http.post<RegisterResponse>('/auth/register/', payload)
      return response.data
    },
  })
}
