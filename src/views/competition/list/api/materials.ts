import { http } from "@/utils/http";
import type { Response } from "@/types/response";
import type { 
  CompetitionMaterial, 
  CompetitionMaterialForm, 
  CompetitionMaterialQueryParams,
  CompetitionMaterialListResponse 
} from "../types/types";

/**
 * 获取竞赛资料列表
 */
export const getMaterials = (params: CompetitionMaterialQueryParams): Promise<Response<CompetitionMaterialListResponse>> => {
  return http.request<Response<CompetitionMaterialListResponse>>("get", "/api/v1/admin/competition-materials", { params });
};

/**
 * 获取竞赛资料详情
 */
export const getMaterial = (id: number): Promise<Response<CompetitionMaterial>> => {
  return http.request<Response<CompetitionMaterial>>("get", `/api/v1/admin/competition-materials/${id}`);
};

/**
 * 创建竞赛资料
 */
export const createMaterial = (competitionId: number, data: CompetitionMaterialForm): Promise<Response<CompetitionMaterial>> => {
  return http.request<Response<CompetitionMaterial>>("post", "/api/v1/admin/competition-materials", { 
    data: { ...data, competitionId } 
  });
};

/**
 * 更新竞赛资料
 */
export const updateMaterial = (id: number, data: Partial<CompetitionMaterialForm>): Promise<Response<CompetitionMaterial>> => {
  return http.request<Response<CompetitionMaterial>>("put", `/api/v1/admin/competition-materials/${id}`, { data });
};

/**
 * 删除竞赛资料
 */
export const deleteMaterial = (id: number): Promise<Response<null>> => {
  return http.request<Response<null>>("delete", `/api/v1/admin/competition-materials/${id}`);
};

/**
 * 批量删除竞赛资料
 */
export const batchDeleteMaterials = (ids: number[]): Promise<Response<null>> => {
  return http.request<Response<null>>("delete", "/api/v1/admin/competition-materials/batch", { 
    data: { ids } 
  });
};

/**
 * 更新竞赛资料排序
 */
export const updateMaterialsSort = (materials: Array<{ id: number; sortOrder: number }>): Promise<Response<null>> => {
  return http.request<Response<null>>("put", "/api/v1/admin/competition-materials/sort", { 
    data: { materials } 
  });
};

/**
 * 下载竞赛资料（增加下载统计）
 */
export const downloadMaterial = (id: number): Promise<Response<{ downloadUrl: string }>> => {
  return http.request<Response<{ downloadUrl: string }>>("post", `/api/v1/admin/competition-materials/${id}/download`);
};
