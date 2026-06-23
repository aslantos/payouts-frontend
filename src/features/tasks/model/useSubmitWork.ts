import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'
import type { SubmissionResponse } from '@/shared/types/api'

type SubmitWorkPayload = {
  taskId: number
  content: string
  attachments: string[]
}

export function useSubmitWork() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ taskId, content, attachments }: SubmitWorkPayload) => {
      const response = await http.post<SubmissionResponse>(`/tasks/${taskId}/submissions`, {
        content,
        attachments,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
