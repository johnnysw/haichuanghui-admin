import { http } from "@/utils/http";
import type { Competition } from "@/types/competition";

// 获取创业大赛列表
export const getCompetitionList = (params: Competition.CompetitionQueryParams) => {
  return http.request<{
    code: number;
    message: string;
    data: {
      list: Competition.CompetitionInfo[];
      total: number;
      page: number;
      limit: number;
    };
  }>("get", "/api/v1/admin/competition", { params });
};

// 获取单个创业大赛详情
export const getCompetitionDetail = (id: number) => {
  return http.request<{
    code: number;
    message: string;
    data: Competition.CompetitionInfo;
  }>("get", `/api/v1/admin/competition/${id}`);
};

// 创建创业大赛
export const createCompetition = (data: Competition.CompetitionForm) => {
  return http.request<{
    code: number;
    message: string;
    data: Competition.CompetitionInfo;
  }>("post", "/api/v1/admin/competition", { data });
};

// 更新创业大赛
export const updateCompetition = (id: number, data: Competition.CompetitionForm) => {
  return http.request<{
    code: number;
    message: string;
    data: Competition.CompetitionInfo;
  }>("put", `/api/v1/admin/competition/${id}`, { data });
};

// 删除创业大赛
export const deleteCompetition = (id: number) => {
  return http.request<{
    code: number;
    message: string;
    data: null;
  }>("delete", `/api/v1/admin/competition/${id}`);
};

// 审核创业大赛
export const reviewCompetition = (id: number, data: { status: number; reviewComment?: string }) => {
  return http.request<{
    code: number;
    message: string;
    data: Competition.CompetitionInfo;
  }>("post", `/api/v1/admin/competition/${id}/review`, { data });
};

// 推荐/取消推荐创业大赛
export const recommendCompetition = (id: number, data: { isRecommended: boolean }) => {
  return http.request<{
    code: number;
    message: string;
    data: Competition.CompetitionInfo;
  }>("post", `/api/v1/admin/competition/${id}/recommend`, { data });
};

// 获取行业领域列表
export const getIndustryList = () => {
  return http.request<{
    code: number;
    message: string;
    data: Array<{ id: number; name: string }>;
  }>("get", "/api/v1/industries");
};

// 获取地区列表
export const getRegionList = () => {
  return http.request<{
    code: number;
    message: string;
    data: Array<{ id: number; name: string; code: string }>;
  }>("get", "/api/v1/regions");
};