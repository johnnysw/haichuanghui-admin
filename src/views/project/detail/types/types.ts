// 项目状态字符串枚举
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
  pending_review: { text: "审核中", type: "warning" },
  approved: { text: "已通过", type: "success" },
  rejected: { text: "已拒绝", type: "danger" }
};

export const PROJECT_STATUS_OPTIONS: Array<{
  label: string;
  value: ProjectStatus;
}> = [
  { label: PROJECT_STATUS_MAP.draft.text, value: "draft" },
  { label: PROJECT_STATUS_MAP.pending_review.text, value: "pending_review" },
  { label: PROJECT_STATUS_MAP.approved.text, value: "approved" },
  { label: PROJECT_STATUS_MAP.rejected.text, value: "rejected" }
];

// 管理端项目详情类型（对齐 PC 端）
export interface AdminProjectDetail {
  id: number;
  name: string;
  title: string;
  companyName: string;
  logo: string | null;
  logoFileId: string | null;
  shortDescription: string;
  fullDescription?: string;
  description?: string;
  introduction?: string;
  industryId: number;
  industry?: {
    id: number;
    name: string;
  };
  location: string;
  regionId?: number;
  region?: {
    id: number;
    name: string;
  };
  foundingDate?: string;
  fundingStageId: number;
  fundingStage?: {
    id: number;
    name: string;
  };
  fundingAmount?: string | number;
  valuation?: string | number;
  fundingNeeds?: string;
  fundingHistory?: string;
  coreTechnology?: string;
  businessModel?: string;
  teamInfo?: string;
  developmentPlan?: string;
  marketAnalysis?: string;
  competitiveAdvantage?: string;
  contactPerson?: string;
  contactPosition?: string;
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
  address?: string;
  businessPlanUrl?: string;
  businessPlanFile?: {
    id: string;
    url?: string;
    filePath?: string;
    fileName?: string;
    originalName?: string;
    createdTime?: string;
  };
  presentationUrl?: string;
  presentationFile?: {
    id: string;
    url?: string;
    filePath?: string;
    fileName?: string;
    originalName?: string;
    createdTime?: string;
  };
  financialUrl?: string;
  otherDocumentUrls?: string;
  status: ProjectStatus;
  isRecommended: boolean;
  viewCount?: number;
  likeCount?: number;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: number;
    username: string;
    nickname: string;
  };
  user?: {
    id: number;
    username: string;
    nickname: string;
  };
  reviewer?: {
    id: number;
    username: string;
    nickname: string;
  } | null;
  reviewComment?: string;
  reviewTime?: string | null;
  files?: Array<{
    id: number;
    fileName: string;
    originalName: string;
    url: string;
    fileSize: number;
    mimeType: string;
    category: string;
    createdTime?: string;
  }>;
  tags?: Array<{
    id: number;
    name: string;
    color?: string;
    description?: string;
    weight?: number;
    isPrimary?: number;
    relationType?: number;
  }>;
}

// 审核请求参数
export interface ReviewParams {
  status: ProjectStatus;
  reviewerId: number;
  reviewComment?: string;
}

// 推荐请求参数
export interface RecommendParams {
  isRecommended: boolean;
}
