// 重新导出基础类型
export * from "../../list/types/types";

// 投资人申请查询参数
export interface ApplicationQueryParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  dateRange?: string[] | null;
  reviewerId?: number;
}

// 投资人申请信息
export interface InvestorApplication {
  id: number;
  userId: number;
  investmentInstitution: string;
  regionId?: number;
  investorTypeId?: number;
  location?: string;
  investmentAmountMin?: number;
  investmentAmountMax?: number;
  description?: string;
  investmentPreference?: string;
  institutionInfo?: string;
  bio?: string;
  status: number;
  reviewerId?: number;
  reviewComment?: string;
  reviewTime?: string;
  submittedTime: string;
  updatedTime: string;
  user: {
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
  documents?: ApplicationDocument[];
}

// 申请文档
export interface ApplicationDocument {
  id: number;
  applicationId: number;
  type: string; // 'identity' | 'institution' | 'investment' | 'other'
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadTime: string;
  status: string; // 'pending' | 'approved' | 'rejected'
  comment?: string;
}

// 申请状态枚举
export enum ApplicationStatus {
  PENDING = 2,     // 待审核
  APPROVED = 1,    // 已通过
  REJECTED = 3,    // 已拒绝
  DRAFT = 0        // 草稿
}

// 申请状态映射
export const APPLICATION_STATUS_MAP = {
  [ApplicationStatus.DRAFT]: { label: '草稿', color: 'info' },
  [ApplicationStatus.APPROVED]: { label: '已通过', color: 'success' },
  [ApplicationStatus.PENDING]: { label: '待审核', color: 'warning' },
  [ApplicationStatus.REJECTED]: { label: '已拒绝', color: 'danger' }
} as const;

// 文档类型映射
export const DOCUMENT_TYPE_MAP = {
  'identity': { label: '身份证明', icon: 'el-icon-user', color: 'primary' },
  'institution': { label: '机构证明', icon: 'el-icon-office-building', color: 'success' },
  'investment': { label: '投资证明', icon: 'el-icon-money', color: 'warning' },
  'other': { label: '其他材料', icon: 'el-icon-document', color: 'info' }
} as const;

// 申请表单
export interface ApplicationForm {
  id?: number;
  userId: number;
  investmentInstitution: string;
  regionId?: number;
  investorTypeId?: number;
  location?: string;
  investmentAmountMin?: number;
  investmentAmountMax?: number;
  description?: string;
  investmentPreference?: string;
  institutionInfo?: string;
  bio?: string;
  focusIndustries?: number[];
  preferredStages?: number[];
  preferredRegions?: number[];
}

// 审核表单
export interface ReviewForm {
  status: number;
  comment: string;
  documentReviews?: {
    documentId: number;
    status: string;
    comment?: string;
  }[];
}