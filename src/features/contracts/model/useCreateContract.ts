import { useMutation } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'

type ContractPayload = {
  contractor_id: number
  subject: string
  amount: string
}

type ContractResponse = {
  id: number
  contract_number: string
}

export function useCreateContract() {
  return useMutation({
    mutationFn: async (payload: ContractPayload) => {
      const response = await http.post<ContractResponse>('/contracts', payload)
      return response.data
    },
  })
}
