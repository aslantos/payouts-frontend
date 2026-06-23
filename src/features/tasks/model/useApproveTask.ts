import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'
import { useAppToast } from '@/shared/lib/toast'
import type { TaskResponse } from '@/shared/types/api'

export function useApproveTask() {
  const queryClient = useQueryClient()
  const { success, handleError } = useAppToast()

  return useMutation({
    mutationFn: async (taskId: number) => {
      const response = await http.post<TaskResponse>(`/tasks/${taskId}/approve`, {})
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      success('Задача одобрена!')
    },
    onError: handleError,
  })
}
