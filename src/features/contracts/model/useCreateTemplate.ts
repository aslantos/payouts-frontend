import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'
import type { ContractTemplateResponse } from '@/shared/types/api'

type CreateTemplatePayload = {
  name: string
  bodyTemplate: string
}

export function useCreateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateTemplatePayload) => {
      const response = await http.post<ContractTemplateResponse>('/contracts/templates', payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
    },
  })
}
