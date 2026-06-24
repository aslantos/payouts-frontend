import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'
import type { TaskResponse } from '@/shared/types/api'

export function useTaskDetail(id: Ref<number>) {
  return useQuery({
    queryKey: computed(() => ['tasks', id.value]),
    queryFn: async () => {
      const response = await http.get<TaskResponse>(`/tasks/${id.value}`)
      return response.data
    },
  })
}
