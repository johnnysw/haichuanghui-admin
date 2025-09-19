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

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface PaginationResponse<T = any> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
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

// 投资人状态选项
export const INVESTOR_STATUS_OPTIONS = [
  { label: "全部", value: "" },
  { label: "正常", value: "1" },
  { label: "审核中", value: "2" },
  { label: "已拒绝", value: "3" },
  { label: "禁用", value: "0" }
];