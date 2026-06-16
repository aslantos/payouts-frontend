import { useMutation } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'

type RegisterContractorResponse = {
  id: number
  username: string
  email: string
  role: string
  company: number | null
  is_self_employed: boolean
}

type RegisterContractorPayload = {
  username: string
  email: string
  password: string
  is_self_employed: boolean
}

export function useRegisterContractor() {
  return useMutation({
    mutationFn: async (payload: RegisterContractorPayload) => {
      const response = await http.post<RegisterContractorResponse>('/auth/register-contractor/', payload)
      return response.data
    },
  })
}
