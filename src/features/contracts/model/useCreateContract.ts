import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'
import { useAppToast } from '@/shared/lib/toast'
import type { ContractResponse } from '@/shared/types/api'

type ContractPayload = {
  contractor_id: number
  subject: string
  amount: string
}

export function useCreateContract() {
  const queryClient = useQueryClient()
  const { success, handleError } = useAppToast()

  return useMutation({
    mutationFn: async (payload: ContractPayload) => {
      const response = await http.post<ContractResponse>('/contracts', payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      success('Договор создан!')
    },
    onError: handleError,
  })
}
