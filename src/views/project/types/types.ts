// 创业项目相关类型定义

export interface ProjectItem {
  id: number;
  name: string;
  description: string;
  industry: string;
  stage: string; // 项目阶段：idea-创意阶段, startup-初创阶段, growth-成长阶段, mature-成熟阶段
  founder: string;
  founderPhone: string;
  founderEmail: string;
  teamSize: number;
  location: string;
  establishedDate: string;
  registeredCapital: number; // 注册资金（万元）
  currentValuation: number; // 当前估值（万元）
  fundingNeeds: number; // 融资需求（万元）
  fundingStage: string; // 融资轮次：angel-天使轮, pre_a-Pre-A轮, a-A轮, b-B轮, c-C轮, ipo-IPO
  businessModel: string;
  targetMarket: string;
  competitiveAdvantage: string;
  financialSituation: string;
  riskAssessment: string;
  logo: string;
  images: string[];
  documents: string[]; // 相关文档
  status: number; // 0: 禁用, 1: 正常, 2: 审核中, 3: 已拒绝
  isRecommended: boolean;
  isFeatured: boolean; // 是否精选
  viewCount: number;
  favoriteCount: number;
  createdTime: string;
  updatedTime: string;
}

export interface ProjectListParams {
  page: number;
  pageSize: number;
  name?: string;
  industry?: string;
  stage?: string;
  fundingStage?: string;
  location?: string;
  status?: string;
  isRecommended?: string;
  isFeatured?: string;
}

export interface ProjectCreateForm {
  name: string;
  description: string;
  industry: string;
  stage: string;
  founder: string;
  founderPhone: string;
  founderEmail: string;
  teamSize: number;
  location: string;
  establishedDate: string;
  registeredCapital: number;
  currentValuation: number;
  fundingNeeds: number;
  fundingStage: string;
  businessModel: string;
  targetMarket: string;
  competitiveAdvantage: string;
  financialSituation: string;
  riskAssessment: string;
  logo: string;
  images: string[];
  documents: string[];
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

// 行业分类选项
export const INDUSTRY_OPTIONS = [
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
  { label: "社交网络", value: "social" },
  { label: "游戏娱乐", value: "gaming" },
  { label: "企业服务", value: "enterprise" },
  { label: "消费升级", value: "consumer" },
  { label: "其他", value: "other" }
];

// 项目阶段选项
export const STAGE_OPTIONS = [
  { label: "创意阶段", value: "idea" },
  { label: "初创阶段", value: "startup" },
  { label: "成长阶段", value: "growth" },
  { label: "成熟阶段", value: "mature" }
];

// 融资轮次选项
export const FUNDING_STAGE_OPTIONS = [
  { label: "种子轮", value: "seed" },
  { label: "天使轮", value: "angel" },
  { label: "Pre-A轮", value: "pre_a" },
  { label: "A轮", value: "a" },
  { label: "B轮", value: "b" },
  { label: "C轮", value: "c" },
  { label: "D轮及以后", value: "later" },
  { label: "IPO", value: "ipo" },
  { label: "暂不融资", value: "none" }
];

// 项目状态选项
export const PROJECT_STATUS_OPTIONS = [
  { label: "全部", value: "" },
  { label: "正常", value: "1" },
  { label: "审核中", value: "2" },
  { label: "已拒绝", value: "3" },
  { label: "禁用", value: "0" }
];