import { useQuery } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'
import type { ContractTemplateResponse } from '@/shared/types/api'

export function useTemplates() {
  return useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const response = await http.get<ContractTemplateResponse[]>('/contracts/templates')
      return response.data
    },
  })
}
