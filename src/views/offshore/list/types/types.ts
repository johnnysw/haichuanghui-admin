export interface PolicyFile {
  name: string;
  url: string;
  size?: number;
  type?: string;
}

export interface ImageFile {
  name: string;
  url: string;
  size?: number;
  type?: string;
}

export interface OffshoreCenter {
  id: number;
  name: string;
  location: string;
  type: string;
  description?: string;
  logo?: string;
  status: number; // 0: 禁用, 1: 启用, 2: 待审核
  isRecommended: boolean;
  createdTime: string;
  updatedTime: string;
  
  // 联系信息
  website?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  
  // 详细信息
  establishedDate?: string;
  areaSize?: number; // 面积大小(平方米)
  companyCount?: number; // 入驻企业数量
  graduatedCount?: number; // 毕业企业数量
  
  // 服务和政策
  services?: string[];
  policies?: PolicyFile[];
  images?: ImageFile[];
  
  // 统计信息
  viewCount?: number;
  favoriteCount?: number;
  
  // 审核相关
  reviewerId?: number;
  reviewTime?: string;
  reviewNote?: string;
}

export interface OffshoreCreateForm {
  name: string;
  location: string;
  type: string;
  description: string;
  website?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  establishedDate?: string;
  areaSize: number;
  companyCount: number;
  graduatedCount: number;
  services: string[];
  policies: PolicyFile[];
  images: ImageFile[];
}

export interface OffshoreListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  location?: string;
  type?: string;
  status?: number;
  isRecommended?: boolean;
  sortBy?: string;
  sortOrder?: string;
}

export interface ApiResponse<T = any> {
  code: number;
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginationResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface OffshoreStats {
  todayViews: number;
  totalViews: number;
  monthlyViews: number;
  applications: number;
  favorites: number;
}