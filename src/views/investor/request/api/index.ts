import { http } from '@/utils/http'
import type { PageResponse } from '@/types/response'
import type { RequestQueryParams, InvestorRequestItem } from '../types/types'

/**
 * 获取投资人请求列表（BP投递 + 会议请求）
 */
export const getInvestorRequestList = (
  params: RequestQueryParams
): Promise<PageResponse<InvestorRequestItem>> => {
  return http.get<PageResponse<InvestorRequestItem>, any>(
    '/api/v1/admin/investor-requests',
    { params }
  )
}

/**
 * 更新投资人请求状态
 */
export const updateRequestStatus = (data: {
  id: string
  type: string
  status: number
}): Promise<any> => {
  return http.put<any, any>('/api/v1/admin/investor-requests/status', { data })
}

