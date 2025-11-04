import { http } from "@/utils/http";
import type { Response, PageResponse } from "@/types/response";
import type {
  InvestorQueryParams,
  InvestorInfo,
  BaseOption
} from "../../types/types";

/**
 * 获取投资人列表
 */
export const getInvestorList = (
  params: InvestorQueryParams
): Promise<PageResponse<InvestorInfo>> => {
  return http.get<PageResponse<InvestorInfo>, any>("/api/v1/admin/investors", {
    params
  });
};

/**
 * 获取单个投资人详情
 */
export const getInvestorDetail = (
  id: number
): Promise<Response<InvestorInfo>> => {
  return http.get<Response<InvestorInfo>, any>(`/api/v1/admin/investors/${id}`);
};

/**
 * 切换投资人状态（禁用/恢复）
 */
export const toggleInvestorStatus = (
  id: number
): Promise<Response<{ status: number }>> => {
  return http.request<Response<{ status: number }>>(
    "put",
    `/api/v1/admin/investors/${id}/toggle-status`
  );
};

/**
 * 审核投资人（通过或拒绝）
 */
export const reviewInvestor = (
  id: number,
  payload: { status: 1 | 3; reviewComment?: string }
): Promise<Response<InvestorInfo>> => {
  return http.request<Response<InvestorInfo>>(
    "put",
    `/api/v1/admin/investors/${id}/review`,
    { data: payload }
  );
};

/**
 * 获取地区列表
 */
export const getRegionList = (): Promise<Response<BaseOption[]>> => {
  return http.get<Response<BaseOption[]>, any>("/api/v1/regions");
};

/**
 * 获取行业分类列表
 */
export const getIndustryList = (): Promise<Response<BaseOption[]>> => {
  return http.get<Response<BaseOption[]>, any>("/api/v1/industries");
};

/**
 * 获取融资阶段列表
 */
export const getFundingStageList = (): Promise<Response<BaseOption[]>> => {
  return http.get<Response<BaseOption[]>, any>("/api/v1/funding-stages");
};

/**
 * 获取投资人类型列表
 */
export const getInvestorTypeList = (): Promise<Response<BaseOption[]>> => {
  // TODO: 后续对接后端真实接口
  return Promise.resolve({
    code: 200,
    success: true,
    data: [
      { id: 1, name: "天使投资人" },
      { id: 2, name: "风险投资机构" },
      { id: 3, name: "私募股权基金" },
      { id: 4, name: "企业战略投资" },
      { id: 5, name: "其他" }
    ]
  } as Response<BaseOption[]>);
};

/**
 * 获取投资人统计信息
 */
export const getInvestorStats = () => {
  return http.request<Response<{
    totalInvestorCount: number;
    pendingReviewCount: number;
    monthlyGrowth: number;
  }>>(
    "get",
    "/api/v1/admin/investors/stats"
  );
};
