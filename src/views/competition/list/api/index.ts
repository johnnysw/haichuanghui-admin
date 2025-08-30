import { http } from "@/utils/http";
import type { Response, PageResponse } from "@/types/response";
import type { CompetitionQueryParams, CompetitionInfo, CompetitionForm } from "../types/types";

// 获取创业大赛列表
export const getCompetitionList = (params: CompetitionQueryParams) => {
  return http.request<PageResponse<CompetitionInfo[]>>("get", "/api/v1/admin/competition", { params });
};

// 获取单个创业大赛详情
export const getCompetitionDetail = (id: number) => {
  return http.request<Response<CompetitionInfo>>("get", `/api/v1/admin/competition/${id}`);
};

// 创建创业大赛
export const createCompetition = (data: CompetitionForm) => {
  return http.request<Response<CompetitionInfo>>("post", "/api/v1/admin/competition", { data });
};

// 更新创业大赛
export const updateCompetition = (id: number, data: CompetitionForm) => {
  return http.request<Response<CompetitionInfo>>("put", `/api/v1/admin/competition/${id}`, { data });
};

// 删除创业大赛
export const deleteCompetition = (id: number) => {
  return http.request<Response<null>>("delete", `/api/v1/admin/competition/${id}`);
};

// 审核创业大赛
export const reviewCompetition = (id: number, data: { status: number; reviewComment?: string }) => {
  return http.request<Response<CompetitionInfo>>("post", `/api/v1/admin/competition/${id}/review`, { data });
};

// 推荐/取消推荐创业大赛
export const recommendCompetition = (id: number, data: { isRecommended: boolean }) => {
  return http.request<Response<CompetitionInfo>>("post", `/api/v1/admin/competition/${id}/recommend`, { data });
};

// 获取行业领域列表
export const getIndustryList = () => {
  return http.request<Response<Array<{ id: number; name: string }>>>("get", "/api/v1/industries");
};

// 获取地区列表
export const getRegionList = () => {
  return http.request<Response<Array<{ id: number; name: string; code: string }>>>("get", "/api/v1/regions");
};