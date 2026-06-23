import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'
import type { ContractResponse } from '@/shared/types/api'

export function useContractDetail(id: Ref<number | null>) {
  return useQuery({
    queryKey: computed(() => ['contracts', id.value]),
    queryFn: async () => {
      const response = await http.get<ContractResponse>(`/contracts/${id.value}`)
      return response.data
    },
    enabled: computed(() => id.value !== null),
  })
}
