import { isAxiosError } from 'axios'

export const httpStatus = (e: unknown): number | undefined => (isAxiosError(e) ? e.response?.status : undefined)

export const isServiceDown = (e: unknown): boolean => {
  const status = httpStatus(e)
  return status === undefined || status === 502 || status === 503 || status === 504 || status === 500
}

const MESSAGES: Record<number, string> = {
  400: 'Проверьте заполнение полей',
  401: 'Сессия истекла — войдите заново',
  403: 'Действие доступно только создателю услуги',
  404: 'Не найдено',
  409: 'Черновик уже существует',
}

export const errorMessage = (e: unknown): string => {
  const status = httpStatus(e)
  if (status && MESSAGES[status]) return MESSAGES[status]
  return isServiceDown(e) ? 'Сервис недоступен' : 'Ошибка запроса'
}
