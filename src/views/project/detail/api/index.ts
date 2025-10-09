import { http } from "@/utils/http";
import type {
  AdminProjectDetail,
  ReviewParams,
  RecommendParams
} from "../types/types";

// API 响应类型
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 获取项目详情
 */
export function getProjectDetail(
  id: number
): Promise<ApiResponse<AdminProjectDetail>> {
  return http.get(`/api/v1/admin/projects/${id}`);
}

/**
 * 审核项目
 */
export function reviewProject(
  id: number,
  params: ReviewParams
): Promise<ApiResponse<AdminProjectDetail>> {
  return http.post(`/api/v1/admin/projects/${id}/review`, { data: params });
}

/**
 * 切换项目推荐状态
 */
export function toggleProjectRecommendation(
  id: number,
  params: RecommendParams
): Promise<ApiResponse<AdminProjectDetail>> {
  return http.post(`/api/v1/admin/projects/${id}/recommend`, { data: params });
}

/**
 * 更新项目信息
 */
export function updateProject(
  id: number,
  data: Partial<AdminProjectDetail>
): Promise<ApiResponse<AdminProjectDetail>> {
  return http.request<ApiResponse<AdminProjectDetail>>(
    "put",
    `/api/v1/admin/projects/${id}`,
    { data }
  );
}
