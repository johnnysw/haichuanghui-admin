// 项目查询参数
export interface ProjectQueryParams {
  pageNum?: number;
  pageSize?: number;
  name?: string;
  companyName?: string;
  industryId?: string;
  regionId?: string;
  fundingStageId?: string;
  status?: ProjectStatus;
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
  status: ProjectStatus;
  isRecommended: boolean;
  logoUrl?: string;
  images?: string[];
  businessPlanUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  socialMedia?: string;
}

// 项目状态（字符串枚举）
export type ProjectStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected";

// 项目状态映射
export const PROJECT_STATUS_MAP: Record<
  ProjectStatus,
  { text: string; type: "info" | "success" | "warning" | "danger" }
> = {
  draft: { text: "草稿", type: "info" },
  approved: { text: "已发布", type: "success" },
  pending_review: { text: "审核中", type: "warning" },
  rejected: { text: "已拒绝", type: "danger" }
};

export const PROJECT_STATUS_OPTIONS: Array<{
  label: string;
  value: ProjectStatus;
}> = [
  { label: PROJECT_STATUS_MAP.draft.text, value: "draft" },
  { label: PROJECT_STATUS_MAP.approved.text, value: "approved" },
  { label: PROJECT_STATUS_MAP.pending_review.text, value: "pending_review" },
  { label: PROJECT_STATUS_MAP.rejected.text, value: "rejected" }
];

// 项目详细信息
export interface ProjectInfo {
  id: number;
  name: string;
  companyName: string;
  shortDescription?: string;
  fullDescription?: string;
  description?: string;
  industryId: number;
  regionId: number;
  location?: string;
  fundingStageId: number;
  fundingAmount?: string;
  valuation?: string;
  fundingNeeds?: string;
  currentValuation?: string;
  introduction?: string;
  coreTechnology?: string;
  businessModel?: string;
  targetMarket?: string;
  financialSituation?: string;
  riskAssessment?: string;
  teamInfo?: string;
  fundingHistory?: string;
  developmentPlan?: string;
  marketAnalysis?: string;
  competitiveAdvantage?: string;
  foundingDate?: string;
  establishedDate?: string;
  teamSize?: number;
  registeredCapital?: string;
  founder?: string;
  founderPhone?: string;
  founderEmail?: string;
  creatorId: number;
  reviewerId?: number | null;
  status: ProjectStatus;
  isRecommended: boolean;
  logoUrl?: string;
  images?: string[];
  businessPlanUrl?: string;
  presentationUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  socialMedia?: string;
  viewCount?: number;
  likeCount?: number;
  favoriteCount?: number;
  reviewComment?: string | null;
  reviewTime?: string | null;
  createdTime: string;
  updatedTime: string;
  industry?: BaseOption;
  region?: BaseOption;
  fundingStage?: BaseOption;
  creator?: {
    id: number;
    username: string;
    nickname: string;
  };
  reviewer?: {
    id: number;
    username: string;
    nickname: string;
  } | null;
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
