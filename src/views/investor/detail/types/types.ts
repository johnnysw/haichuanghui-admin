// 重新导出列表页面的类型定义
export * from "../../list/types/types";
import type { InvestorInfo } from "../../list/types/types";

// 投资人详情页面状态接口
export interface InvestorDetailState {
  loading: boolean;
  investor: InvestorInfo | null;
  notFound: boolean;
}

// 投资案例接口
export interface InvestmentCase {
  id: number;
  investorId: number;
  projectName: string;
  companyName: string;
  industry: string;
  stage: string;
  amount?: number;
  investmentDate: string;
  status: string;
  description?: string;
  logo?: string;
  website?: string;
}

// 审核记录接口
export interface ReviewRecord {
  id: number;
  investorId: number;
  reviewerId: number;
  status: number;
  comment: string;
  reviewTime: string;
  reviewer: {
    id: number;
    username: string;
    realName?: string;
  };
}