export interface IncubatorItem {
  id: number;
  name: string;
  location?: string;
  type?: string;
  isRecommended?: boolean;
  status?: number; // 0 禁用 1 正常 2 审核中 3 已拒绝
  viewCount?: number;
  createdTime?: string;
  updatedTime?: string;
}

export interface IncubatorQueryParams {
  page: number;
  limit: number;
  name?: string;
  location?: string;
  type?: string;
  status?: string;
  recommended?: string;
}

export interface ApiResponse<T = any> {
  code: number;
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T = any> {
  list: T[];
  total: number;
  page: number;
  limit: number;
}
