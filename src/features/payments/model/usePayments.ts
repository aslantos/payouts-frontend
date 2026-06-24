import { useQuery } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'
import type { PaymentResponse } from '@/shared/types/api'

export function usePayments() {
  return useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const response = await http.get<PaymentResponse[]>('/payments')
      return response.data
    },
  })
}
