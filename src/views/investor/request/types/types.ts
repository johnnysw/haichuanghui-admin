import type { PaginationQuery } from '../../list/types/types'

// 请求类型枚举
export enum RequestType {
  BP = 'bp',
  ONLINE_MEETING = 'online_meeting',
  OFFLINE_MEETING = 'offline_meeting'
}

// 请求状态枚举
export enum RequestStatus {
  PENDING = 0, // 待查看
  READ = 1 // 已查看
}

// 请求类型显示映射
export const REQUEST_TYPE_MAP = {
  [RequestType.BP]: { label: 'BP投递', type: 'primary' as const },
  [RequestType.ONLINE_MEETING]: { label: '线上会议', type: 'success' as const },
  [RequestType.OFFLINE_MEETING]: { label: '线下约见', type: 'warning' as const }
}

// 请求状态显示映射
export const REQUEST_STATUS_MAP = {
  [RequestStatus.PENDING]: { label: '待查看', type: 'warning' as const },
  [RequestStatus.READ]: { label: '已查看', type: 'info' as const }
}

// 统一的请求项接口
export interface InvestorRequestItem {
  id: string // 组合ID，如 bp_123, meeting_456
  originalId: number // 原始ID
  type: RequestType
  senderId: number
  senderName: string
  senderPhone?: string
  senderEmail?: string
  investorId: number
  investorName: string
  investorInstitution?: string
  // BP投递特有字段
  bpFileName?: string
  bpFileUrl?: string
  bpFileSize?: number
  // 会议请求特有字段
  subject?: string
  preferredTime?: string
  meetingType?: 1 | 2
  // 共同字段
  message?: string
  status: RequestStatus
  readTime?: string
  createdTime: string
  updatedTime?: string
}

// 查询参数
export interface RequestQueryParams extends PaginationQuery {
  type?: string // 请求类型筛选
  investorId?: number // 投资人筛选
  startDate?: string // 开始日期
  endDate?: string // 结束日期
  status?: number | string // 状态筛选
  search?: string // 搜索发送人或投资人姓名
}

