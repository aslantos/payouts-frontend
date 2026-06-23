import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'
import type { ContractResponse } from '@/shared/types/api'

export function useSignContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (contractId: number) => {
      const response = await http.post<ContractResponse>(`/contracts/${contractId}/sign`, {})
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
    },
  })
}
