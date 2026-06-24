import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'
import { useAppToast } from '@/shared/lib/toast'
import type { PaymentResponse } from '@/shared/types/api'

export function useInitiatePayment() {
  const queryClient = useQueryClient()
  const { success, handleError } = useAppToast()

  return useMutation({
    mutationFn: async (taskId: number) => {
      const response = await http.post<PaymentResponse>(`/payments/tasks/${taskId}`, {})
      return response.data
    },
    onSuccess: (data) => {
      success(`Выплата инициирована! Транзакция: ${data.providerTxId}`)
      // Задача стала COMPLETED — обновляем список задач
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      // Список выплат пополнился новой записью
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
    onError: handleError,
  })
}
