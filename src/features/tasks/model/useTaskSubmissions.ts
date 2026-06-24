import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'
import type { SubmissionResponse } from '@/shared/types/api'

export function useTaskSubmissions(taskId: Ref<number>, enabled: Ref<boolean>) {
  return useQuery({
    queryKey: computed(() => ['submissions', taskId.value]),
    queryFn: async () => {
      const response = await http.get<SubmissionResponse[]>(`/tasks/${taskId.value}/submissions`)
      return response.data
    },
    enabled,
  })
}
