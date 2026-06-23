import { useQuery } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'
import type { ContractResponse } from '@/shared/types/api'

export function useContracts() {
  return useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const response = await http.get<ContractResponse[]>('/contracts')
      return response.data
    },
  })
}
