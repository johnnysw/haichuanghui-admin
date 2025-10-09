import { http } from "@/utils/http";
import type { Response, PageResponse } from "@/types/response";
import type { IncubatorItem, IncubatorQueryParams } from "../types/types";

export const getIncubatorList = (params: IncubatorQueryParams) => {
  return http.request<PageResponse<IncubatorItem[]>>("get", "/api/v1/admin/incubators", {
    params: {
      page: params.page,
      pageSize: params.pageSize,
      name: params.name,
      regionId: params.regionId,
      status: params.status,
      isRecommended: params.isRecommended,
    }
  });
};

export const getIncubatorDetail = (id: number) => {
  return http.request<Response<IncubatorItem>>("get", `/api/v1/admin/incubators/${id}`);
};

export const createIncubator = (data: Partial<IncubatorItem>) => {
  return http.request<Response<IncubatorItem>>("post", "/api/v1/admin/incubators", { data });
};

export const updateIncubator = (id: number, data: Partial<IncubatorItem>) => {
  return http.request<Response<IncubatorItem>>("put", `/api/v1/admin/incubators/${id}`, { data });
};

export const deleteIncubator = (id: number) => {
  return http.request<Response>("delete", `/api/v1/admin/incubators/${id}`);
};

export const getIndustryList = () => {
  return http.request<Response<Array<{ id: number; name: string }>>>("get", "/api/v1/industries");
};

export const getRegionList = () => {
  return http.request<Response<Array<{ id: number; name: string; code: string }>>>("get", "/api/v1/regions");
};

export const getCenterTypeList = () => {
  return http.request<Response<Array<{ id: number; name: string; code: string }>>>("get", "/api/v1/offshore-center-types");
};

