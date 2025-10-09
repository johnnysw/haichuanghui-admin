// 投资人相关类型定义

/** 基础选项类型 */
export interface BaseOption {
  id: number;
  name: string;
}

/** 命名选项类型（用于关联数据） */
export interface NamedOption {
  id: number;
  name: string;
}

/** 投资人状态枚举 */
export enum InvestorStatus {
  DISABLED = 0, // 禁用
  NORMAL = 1, // 正常
  REVIEWING = 2, // 审核中
  REJECTED = 3 // 已拒绝
}

/** 投资人状态信息映射 */
export interface InvestorStatusInfo {
  label: string;
  type: "success" | "warning" | "danger" | "info";
}

export const INVESTOR_STATUS_MAP: Record<InvestorStatus, InvestorStatusInfo> = {
  [InvestorStatus.DISABLED]: { label: "禁用", type: "danger" },
  [InvestorStatus.NORMAL]: { label: "正常", type: "success" },
  [InvestorStatus.REVIEWING]: { label: "审核中", type: "warning" },
  [InvestorStatus.REJECTED]: { label: "已拒绝", type: "danger" }
};

/** 分页查询参数基础接口 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

/** 投资人查询参数 */
export interface InvestorQueryParams extends PaginationQuery {
  search?: string; // 搜索关键词（姓名/机构）
  region?: string; // 地区 ID
  type?: string; // 投资人类型 ID
  field?: string; // 关注行业 ID
  stage?: string; // 偏好阶段 ID
  status?: string | number; // 状态：0-禁用, 1-正常(已认证), 2-审核中, 3-已拒绝
  isFeatured?: string; // 是否精选
  isRecommended?: string; // 是否推荐
  sortField?: string; // 排序字段
  sortOrder?: string; // 排序方式
  createdTimeRange?: string[]; // 创建时间范围
}

/** 投资人信息（对齐后端 formatInvestor 返回结构） */
export interface InvestorInfo {
  id: number;
  userId?: number;

  // 用户基础信息
  user?: {
    id: number;
    username: string;
    email?: string;
    phone?: string;
    realName?: string;
    nickname?: string;
    avatar?: string;
    lastLoginTime?: string;
    loginIp?: string;
  };

  // 投资人核心信息
  name: string;
  avatar?: string;
  coverImage?: string;
  investmentInstitution?: string;
  position?: string;
  location?: string;

  // 投资范围
  investmentAmountMin?: number;
  investmentAmountMax?: number;
  investmentRange?: string; // 格式化后的投资范围（旧字段）
  investmentRangeText?: string; // 格式化后的投资范围（新字段，如 "500万 - 5000万"）

  // 描述信息
  description?: string;
  investmentPreference?: string;
  institutionInfo?: string;
  bio?: string;
  investmentCases?: string; // 投资案例（富文本HTML）
  certificationFiles?: CertificationFiles; // 认证文件

  // 联系方式
  phone?: string;
  email?: string;
  wechat?: string;
  website?: string;

  // 关联数据（作为 NamedOption 数组）
  region?: NamedOption;
  investorType?: NamedOption;
  focusIndustries?: NamedOption[];
  preferredStages?: NamedOption[];
  preferredRegions?: NamedOption[];

  // 统计数据
  investmentCount?: number;
  successfulExits?: number;
  activeMonths?: number;
  responseRate?: number;
  avgResponseTime?: string;
  viewCount?: number;
  followCount?: number;

  // 状态字段（status: 0-禁用, 1-正常(已认证), 2-审核中, 3-已拒绝）
  status: InvestorStatus;
  isFeatured?: boolean;
  isRecommended?: boolean;

  // 审核信息
  reviewerId?: number;
  reviewer?: {
    id: number;
    username: string;
    nickname?: string;
  };
  reviewComment?: string;
  reviewTime?: string;

  // 时间戳
  createdTime?: string;
  updatedTime?: string;
}

export interface ApiResponse<T = any> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T = any> {
  list: T[];
  total: number;
  pageSize: number;
  currentPage: number;
}

// 关注行业选项
export const FOCUS_INDUSTRIES = [
  { label: "人工智能", value: "ai" },
  { label: "大数据", value: "bigdata" },
  { label: "云计算", value: "cloud" },
  { label: "物联网", value: "iot" },
  { label: "区块链", value: "blockchain" },
  { label: "新能源", value: "energy" },
  { label: "生物医药", value: "biotech" },
  { label: "新材料", value: "materials" },
  { label: "智能制造", value: "manufacturing" },
  { label: "电子商务", value: "ecommerce" },
  { label: "金融科技", value: "fintech" },
  { label: "教育科技", value: "edtech" },
  { label: "文娱传媒", value: "media" },
  { label: "消费升级", value: "consumer" },
  { label: "企业服务", value: "enterprise" },
  { label: "其他", value: "other" }
];

// 偏好投资阶段选项
export const PREFERRED_STAGES = [
  { label: "种子轮", value: "seed" },
  { label: "天使轮", value: "angel" },
  { label: "Pre-A轮", value: "pre_a" },
  { label: "A轮", value: "a" },
  { label: "B轮", value: "b" },
  { label: "C轮", value: "c" },
  { label: "D轮及以后", value: "later" },
  { label: "IPO", value: "ipo" }
];

// 投资人状态选项（用于筛选下拉框）
export const INVESTOR_STATUS_OPTIONS = [
  { label: "全部状态", value: "" },
  { label: "正常", value: 1 },
  { label: "审核中", value: 2 },
  { label: "已拒绝", value: 3 },
  { label: "禁用", value: 0 }
];

// 认证文件信息
export interface FileInfo {
  fileId: string;
  filePath: string;
  fileName: string;
  originalName?: string;
  fileSize?: number;
  fileType?: string;
}

// 认证文件集合
export interface CertificationFiles {
  idCardFile?: FileInfo;
  idCardBackFile?: FileInfo;
  institutionCertFile?: FileInfo;
  investmentCaseFile?: FileInfo;
  assetProofFile?: FileInfo;
  workProofFile?: FileInfo;
  resumeFile?: FileInfo;
}
