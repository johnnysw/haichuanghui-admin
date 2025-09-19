// 项目查询参数
export interface ProjectQueryParams {
  pageNum?: number;
  pageSize?: number;
  name?: string;
  companyName?: string;
  industryId?: string;
  regionId?: string;
  fundingStageId?: string;
  status?: string;
  isRecommended?: string;
}

// 项目表单数据
export interface ProjectForm {
  id?: number;
  name: string;
  companyName: string;
  shortDescription?: string;
  fullDescription?: string;
  description?: string;
  industryId?: number;
  regionId?: number;
  location?: string;
  fundingStageId?: number;
  fundingAmount?: string;
  valuation?: string;
  fundingNeeds?: string;
  introduction?: string;
  coreTechnology?: string;
  businessModel?: string;
  teamInfo?: string;
  fundingHistory?: string;
  developmentPlan?: string;
  marketAnalysis?: string;
  competitiveAdvantage?: string;
  foundingDate?: string;
  status: number;
  isRecommended: boolean;
  logoUrl?: string;
  images?: string[];
  businessPlanUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  socialMedia?: string;
}

// 项目状态枚举
export enum ProjectStatus {
  DRAFT = 0,        // 草稿
  PUBLISHED = 1,    // 已发布
  REVIEWING = 2,    // 审核中
  REJECTED = 3,     // 已拒绝
  ARCHIVED = 4      // 已归档
}

// 项目状态映射
export const PROJECT_STATUS_MAP = {
  [ProjectStatus.DRAFT]: { text: "草稿", type: "info" },
  [ProjectStatus.PUBLISHED]: { text: "已发布", type: "success" },
  [ProjectStatus.REVIEWING]: { text: "审核中", type: "warning" },
  [ProjectStatus.REJECTED]: { text: "已拒绝", type: "danger" },
  [ProjectStatus.ARCHIVED]: { text: "已归档", type: "info" }
} as const;

// 项目详细信息
export interface ProjectInfo {
  id: number;
  name: string;
  companyName: string;
  shortDescription: string;
  fullDescription: string;
  description: string;
  industryId: number;
  regionId: number;
  location: string;
  fundingStageId: number;
  fundingAmount: string;
  valuation: string;
  fundingNeeds: string;
  introduction: string;
  coreTechnology: string;
  businessModel: string;
  teamInfo: string;
  fundingHistory: string;
  developmentPlan: string;
  marketAnalysis: string;
  competitiveAdvantage: string;
  foundingDate: string;
  creatorId: number;
  reviewerId: number | null;
  status: number;
  isRecommended: boolean;
  logoUrl: string;
  images: string[];
  businessPlanUrl: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl: string;
  socialMedia: string;
  viewCount: number;
  likeCount: number;
  favoriteCount: number;
  reviewComment: string | null;
  reviewTime: string | null;
  createdTime: string;
  updatedTime: string;
  industry: BaseOption;
  region: BaseOption;
  fundingStage: BaseOption;
  creator: {
    id: number;
    username: string;
    nickname: string;
  };
}

// 基础选项类型
export interface BaseOption {
  id: number;
  name: string;
}

// 项目列表响应
export interface ProjectListResponse {
  list: ProjectInfo[];
  total: number;
  pageSize: number;
  currentPage: number;
}

// API响应包装
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 表单项属性类型
export type FormItemProps = ProjectForm;