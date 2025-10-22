export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface BaseOption {
  label: string;
  value: string | number;
}

export interface ApiResponse<T = unknown> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T = unknown> {
  list: T[];
  total: number;
  page: number;
  limit: number;
  pageSize?: number;
  currentPage?: number;
}

export type UploadAttachment = {
  name: string;
  url?: string;
  size?: number;
  uid?: string;
  status?: "ready" | "uploading" | "success" | "fail";
  percentage?: number;
  raw?: File;
};

export interface NamedOption {
  id: number;
  name: string;
}

export enum InvestorStatus {
  DISABLED = 0,
  NORMAL = 1,
  REVIEWING = 2,
  REJECTED = 3
}

export type TagType =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "default";

export interface InvestorStatusInfo {
  label: string;
  type: TagType;
}

export const INVESTOR_STATUS_MAP: Record<InvestorStatus, InvestorStatusInfo> = {
  [InvestorStatus.DISABLED]: { label: "禁用", type: "danger" },
  [InvestorStatus.NORMAL]: { label: "正常", type: "success" },
  [InvestorStatus.REVIEWING]: { label: "审核中", type: "warning" },
  [InvestorStatus.REJECTED]: { label: "已拒绝", type: "danger" }
};

export interface InvestorQueryParams extends PaginationQuery {
  search?: string;
  region?: string;
  type?: string;
  field?: string;
  stage?: string;
  status?: string | number; // 0-禁用, 1-正常(已认证), 2-审核中, 3-已拒绝
  isFeatured?: string | number;
  isRecommended?: string | number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  createdTimeRange?: [string, string];
}

export interface UserSummary {
  id: number;
  username: string;
  realName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface InvestorInfo {
  id: number;
  userId?: number;
  reviewerId?: number;
  investmentInstitution: string;
  position: string;
  regionId?: number;
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
  status: InvestorStatus; // 0-禁用, 1-正常(已认证), 2-审核中, 3-已拒绝
  reviewComment?: string;
  reviewTime?: string;
  adminNotes?: string;
  isFeatured: boolean;
  isRecommended?: boolean;
  viewCount: number;
  createdTime: string;
  updatedTime: string;
  focusIndustries?: NamedOption[];
  preferredStages?: NamedOption[];
  preferredRegions?: NamedOption[];
  idDocuments?: UploadAttachment[];
  institutionDocuments?: UploadAttachment[];
  investmentDocuments?: UploadAttachment[];
  user?: UserSummary;
  reviewer?: UserSummary;
  region?: NamedOption;
  investorType?: NamedOption;
}

export type InvestorItem = InvestorInfo;

export interface InvestorReviewPayload {
  status: InvestorStatus;
  reviewComment?: string;
}
