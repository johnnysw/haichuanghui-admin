import { http } from '@/utils/http'
import type { PageResponse } from '@/types/response'
import type { MessageQueryParams, MessageThread } from '../types/types'

export const getAdminMessageThreads = (
  params: MessageQueryParams
): Promise<PageResponse<MessageThread>> => {
  return http.get<PageResponse<MessageThread>, any>('/api/v1/admin/messages', { params })
}

export const deleteAdminMessageThread = (id: number): Promise<any> => {
  return http.request<any>('delete', `/api/v1/admin/messages/${id}`)
}
