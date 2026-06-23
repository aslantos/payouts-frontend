import { useQuery } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'
import type { TaskResponse } from '@/shared/types/api'

export function useTasks() {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await http.get<TaskResponse[]>('/tasks')
      return response.data
    },
  })
}
