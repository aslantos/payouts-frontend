import { useToast } from 'vue-toastification'
import axios from 'axios'

export function useAppToast() {
  const toast = useToast()

  function success(message: string) {
    toast.success(message)
  }

  function error(message: string) {
    toast.error(message)
  }

  function info(message: string) {
    toast.info(message)
  }

  function handleError(err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      if (status === 403)      error('У вас нет прав для этого действия')
      else if (status === 400) error(err.response?.data?.error ?? 'Проверьте введённые данные')
      else if (status === 404) error('Данные не найдены')
      else if (status === 500) error('Ошибка сервера. Попробуйте позже')
      else                     error('Ошибка. Попробуйте снова')
    } else {
      error('Нет соединения с сервером')
    }
  }

  return { success, error, info, handleError }
}
