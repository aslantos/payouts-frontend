import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'
import { useAppToast } from '@/shared/lib/toast'
import type { SubmissionResponse } from '@/shared/types/api'

type SubmitWorkPayload = {
  taskId: number
  content: string
  attachments: string[]
}

export function useSubmitWork() {
  const queryClient = useQueryClient()
  const { success, handleError } = useAppToast()

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
      success('Работа отправлена на проверку!')
    },
    onError: handleError,
  })
}
