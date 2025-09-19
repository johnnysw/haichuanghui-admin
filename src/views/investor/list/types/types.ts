// 投资人相关类型定义

export interface InvestorItem {
  id: number;
  name: string;
  avatar: string;
  institution: string;
  position: string;
  location: string;
  investmentRange: string; // 投资范围：如"100万-500万"
  focusIndustries: string[];
  preferredStages: string[];
  phone: string;
  email: string;
  bio: string;
  description: string;
  investmentCount: number; // 投资项目数量
  successfulExits: number; // 成功退出项目数量
  verified: boolean;
  status: number; // 0: 禁用, 1: 正常, 2: 审核中, 3: 已拒绝
  isRecommended: boolean;
  isFeatured: boolean;
  createdTime: string;
  updatedTime: string;
}

export interface InvestorListParams {
  page: number;
  pageSize: number;
  name?: string;
  institution?: string;
  location?: string;
  focusIndustry?: string;
  preferredStage?: string;
  status?: string;
  isRecommended?: string;
  isFeatured?: string;
}

export interface InvestorCreateForm {
  name: string;
  avatar: string;
  institution: string;
  position: string;
  location: string;
  investmentRange: string;
  focusIndustries: string[];
  preferredStages: string[];
  phone: string;
  email: string;
  bio: string;
  description: string;
  verified: boolean;
  status: number;
  isRecommended: boolean;
  isFeatured: boolean;
}
  investorTypeId?: number;
  location?: string;
  investmentAmountMin?: number;
  investmentAmountMax?: number;
  description?: string;
  investmentPreference?: string;
  institutionInfo?: string;
  investmentCount: number;
  successfulExits: number;
  activeMonths: number;
  responseRate: number;
  avgResponseTime?: string;
  investmentCases?: string;
  bio?: string;
  verified: boolean;
  status: number;
  reviewComment?: string;
  reviewTime?: string;
  isFeatured: boolean;
  viewCount: number;
  createdTime: string;
  updatedTime: string;
  user?: {
    id: number;
    username: string;
    email: string;
    phone?: string;
    avatar?: string;
    realName?: string;
  };
  reviewer?: {
    id: number;
    username: string;
    realName?: string;
  };
  region?: {
    id: number;
    name: string;
  };
  investorType?: {
    id: number;
    name: string;
  };
  focusIndustries?: Array<{
    id: number;
    name: string;
  }>;
  preferredStages?: Array<{
    id: number;
    name: string;
  }>;
  preferredRegions?: Array<{
    id: number;
    name: string;
  }>;
}

// 投资人状态枚举
export enum InvestorStatus {
  DISABLED = 0,    // 禁用
  NORMAL = 1,      // 正常
  REVIEWING = 2,   // 审核中
  REJECTED = 3     // 已拒绝
}

// 投资人状态映射
export const INVESTOR_STATUS_MAP = {
  [InvestorStatus.DISABLED]: { label: '禁用', color: 'danger' },
  [InvestorStatus.NORMAL]: { label: '正常', color: 'success' },
  [InvestorStatus.REVIEWING]: { label: '审核中', color: 'warning' },
  [InvestorStatus.REJECTED]: { label: '已拒绝', color: 'danger' }
} as const;

// 基础选项接口
export interface BaseOption {
  label: string;
  value: string | number;
}

// API响应接口
export interface ApiResponse<T = any> {
  code: number;
  success: boolean;
  data: T;
  message: string;
}

// 分页响应接口
export interface PaginatedResponse<T = any> {
  list: T[];
  total: number;
  page: number;
  limit: number;
}

// 分页响应接口
export interface PaginatedResponse<T = any> {
  list: T[];
  total: number;
  page: number;
  limit: number;
}