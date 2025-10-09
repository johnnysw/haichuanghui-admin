// 活动基础信息接口
export interface Event {
  id: number;
  title: string;
  description?: string;
  type: string;
  organizer: string;
  poster?: string;
  location: string;
  address: string;
  startTime: string;
  endTime: string;
  registrationStartTime?: string;
  registrationEndTime?: string;
  maxParticipants?: number;
  participantCount: number;
  status: number; // 0: 报名中, 1: 进行中, 2: 已结束, 3: 已取消
  isRecommended: boolean;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  requirements?: string;
  agenda?: string;
  benefits?: string;
  tags?: string[];
  createdTime: string;
  updatedTime: string;
}

// 活动创建表单接口
export interface EventCreateForm {
  title: string;
  description?: string;
  type: string;
  organizer: string;
  poster?: string;
  location: string;
  address: string;
  startTime: string;
  endTime: string;
  registrationStartTime?: string;
  registrationEndTime?: string;
  maxParticipants?: number;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  requirements?: string;
  agenda?: string;
  benefits?: string;
  tags?: string[];
}

// 活动列表查询参数接口
export interface EventListParams {
  page?: number;
  pageSize?: number;
  title?: string;
  type?: string;
  organizer?: string;
  status?: number;
  isRecommended?: boolean;
  location?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: keyof Event;
  sortOrder?: "asc" | "desc";
}

// API 响应基础接口
export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

// 分页响应接口
export interface PaginationResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 状态信息接口
export interface StatusInfo {
  label: string;
  type: "success" | "info" | "warning" | "danger" | "primary";
}

// 活动统计接口
export interface EventStats {
  totalEvents: number;
  ongoingEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalParticipants: number;
  recommendedEvents: number;
}
