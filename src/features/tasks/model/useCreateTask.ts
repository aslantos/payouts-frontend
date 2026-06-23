import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { http } from '@/shared/api/http'
import { useAppToast } from '@/shared/lib/toast'
import type { TaskResponse } from '@/shared/types/api'

type CreateTaskPayload = {
  title: string
  description: string
  budget: number
  deadline?: string
  assignedToId?: number | null
}

// datetime-local даёт "2026-06-26T16:00" — добавляем секунды и таймзону Алматы
function toAlmatyISO(raw: string): string {
  const withSeconds = raw.length === 16 ? raw + ':00' : raw
  return withSeconds + '+05:00'
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  const { success, handleError } = useAppToast()

  return useMutation({
    mutationFn: async (payload: CreateTaskPayload) => {
      const body = {
        ...payload,
        deadline: payload.deadline ? toAlmatyISO(payload.deadline) : null,
      }
      const response = await http.post<TaskResponse>('/tasks', body)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      success('Задача успешно создана!')
    },
    onError: handleError,
  })
}
