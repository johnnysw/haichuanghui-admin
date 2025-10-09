export interface IncubatorItem {
  id: number;
  name: string;
  logo?: string;
  location?: string;
  regionId?: number;
  region?: {
    id: number;
    name: string;
    code?: string;
  } | null;
  centerTypeId?: number;
  centerType?: {
    id: number;
    name: string;
    code?: string;
    color?: string;
  } | null;
  industryIds?: number[];
  industries?: Array<{
    id: number;
    name: string;
  }>;
  isRecommended?: boolean;
  status?: number; // 1 正常 2 已下线 3 禁用
  area?: number;
  settledCompaniesCount?: number;
  viewCount?: number;
  createdTime?: string;
  updatedTime?: string;
}

export interface IncubatorQueryParams {
  page: number;
  pageSize: number;
  name?: string;
  regionId?: number | string;
  status?: number | string;
  isRecommended?: number | string;
}

export interface PageResponseData<T = any> {
  list: T[];
  total: number;
  pageSize: number;
  currentPage: number;
}
