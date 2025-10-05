import { http } from "@/utils/http";
import type { Response, PageResponse } from "@/types/response";
import type {
  ProjectQueryParams,
  ProjectForm,
  ProjectInfo,
  BaseOption,
  ProjectStatus
} from "../types/types";

/**
 * 获取项目列表
 */
export const getProjectList = (params: ProjectQueryParams): Promise<PageResponse<ProjectInfo>> => {
  return http.get<PageResponse<ProjectInfo>, any>("/api/v1/admin/projects", { params });
};

/**
 * 获取单个项目详情
 */
export const getProjectDetail = (id: number): Promise<Response<ProjectInfo>> => {
  return http.get<Response<ProjectInfo>, any>(`/api/v1/admin/projects/${id}`);
};

/**
 * 创建项目
 */
export const createProject = (data: ProjectForm): Promise<Response<ProjectInfo>> => {
  return http.post<Response<ProjectInfo>, ProjectForm>("/api/v1/admin/projects", { data });
};

/**
 * 更新项目
 */
export const updateProject = (id: number, data: Partial<ProjectForm>): Promise<Response<ProjectInfo>> => {
  return http.request<Response<ProjectInfo>>("put", `/api/v1/admin/projects/${id}`, { data });
};

/**
 * 删除项目
 */
export const deleteProject = (id: number): Promise<Response<null>> => {
  return http.request<Response<null>>("delete", `/api/v1/admin/projects/${id}`);
};

/**
 * 审核项目
 */
export const reviewProject = (
  id: number,
  status: ProjectStatus,
  reviewComment?: string
): Promise<Response<ProjectInfo>> => {
  return http.post<Response<ProjectInfo>, any>(`/api/v1/admin/projects/${id}/review`, {
    data: { status, reviewComment }
  });
};

/**
 * 推荐/取消推荐项目
 */
export const toggleProjectRecommendation = (
  id: number,
  isRecommended: boolean
): Promise<Response<ProjectInfo>> => {
  return http.post<Response<ProjectInfo>, any>(`/api/v1/admin/projects/${id}/recommend`, {
    data: { isRecommended }
  });
};

/**
 * 获取行业分类列表
 */
export const getIndustryList = (): Promise<Response<BaseOption[]>> => {
  return http.get<Response<BaseOption[]>, any>("/api/v1/industries");
};

/**
 * 获取地区列表
 */
export const getRegionList = (): Promise<Response<BaseOption[]>> => {
  return http.get<Response<BaseOption[]>, any>("/api/v1/regions");
};

/**
 * 获取融资阶段列表
 */
export const getFundingStageList = (): Promise<Response<BaseOption[]>> => {
  return http.get<Response<BaseOption[]>, any>("/api/v1/funding-stages");
};
