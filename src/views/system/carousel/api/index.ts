import { http } from "@/utils/http";
import type { Response } from "@/types/response";
import type { Banner, BannerForm, BannerQuery } from "../types/types";

// 分页响应类型
interface ListResponse<T> {
  list: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 获取轮播图列表
 */
export const getBannerList = (
  params: BannerQuery
): Promise<Response<ListResponse<Banner>>> => {
  return http.get<Response<ListResponse<Banner>>, any>(
    "/api/v1/admin/banners",
    { params }
  );
};

/**
 * 获取轮播图详情
 */
export const getBannerDetail = (id: number): Promise<Response<Banner>> => {
  return http.get<Response<Banner>, any>(`/api/v1/admin/banners/${id}`);
};

/**
 * 创建轮播图
 */
export const createBanner = (data: BannerForm): Promise<Response<Banner>> => {
  return http.post<Response<Banner>>("/api/v1/admin/banners", { data });
};

/**
 * 更新轮播图
 */
export const updateBanner = (
  id: number,
  data: Partial<BannerForm>
): Promise<Response<Banner>> => {
  return http.request<Response<Banner>>(
    "put",
    `/api/v1/admin/banners/${id}`,
    { data }
  );
};

/**
 * 删除轮播图
 */
export const deleteBanner = (id: number): Promise<Response<null>> => {
  return http.request<Response<null>>(
    "delete",
    `/api/v1/admin/banners/${id}`
  );
};

/**
 * 更新轮播图状态
 */
export const updateBannerStatus = (
  id: number,
  status: number
): Promise<Response<Banner>> => {
  return http.request<Response<Banner>>(
    "patch",
    `/api/v1/admin/banners/${id}/status`,
    { data: { status } }
  );
};

/**
 * 更新轮播图排序
 */
export const updateBannerSort = (
  id: number,
  sortOrder: number
): Promise<Response<Banner>> => {
  return http.request<Response<Banner>>(
    "patch",
    `/api/v1/admin/banners/${id}/sort`,
    { data: { sortOrder } }
  );
};
