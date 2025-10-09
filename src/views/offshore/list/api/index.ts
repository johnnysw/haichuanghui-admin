import type { 
  OffshoreCenter, 
  OffshoreCreateForm, 
  OffshoreListParams,
  ApiResponse, 
  PaginationResponse
} from "../types/types";
import { http } from "@/utils/http";
import type { Response, PageResponse } from "@/types/response";
import type {
  OffshoreCenterItem,
  OffshoreCenterDetail,
  OffshoreQueryParams,
  OffshoreSubmitPayload
} from "../types/types";

export const getOffshoreList = (params: OffshoreQueryParams) => {
  return http.request<PageResponse<OffshoreCenterItem[]>>(
    "get",
    "/api/v1/admin/offshore-centers",
    {
      params: {
        page: params.page,
        pageSize: params.pageSize,
        name: params.name,
        regionId: params.regionId,
        centerTypeId: params.centerTypeId,
        status: params.status,
        isRecommended: params.isRecommended,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder
      }
    }
  );
};

export const getOffshoreDetail = (id: number) => {
  return http.request<Response<OffshoreCenterDetail>>(
    "get",
    `/api/v1/admin/offshore-centers/${id}`
  );
};

export const createOffshore = (data: OffshoreSubmitPayload) => {
  return http.request<Response<OffshoreCenterDetail>>(
    "post",
    "/api/v1/admin/offshore-centers",
    { data }
  );
};

export const updateOffshore = (id: number, data: OffshoreSubmitPayload) => {
  return http.request<Response<OffshoreCenterDetail>>(
    "put",
    `/api/v1/admin/offshore-centers/${id}`,
    { data }
  );
};

export const deleteOffshore = (id: number) => {
  return http.request<Response>(
    "delete",
    `/api/v1/admin/offshore-centers/${id}`
  );
};

export const updateOffshoreStatus = (
  id: number,
  status: number,
  reason?: string
) => {
  return http.request<Response>("put", `/api/v1/admin/offshore-centers/${id}`, {
    data: { status, reason }
  });
};

export const getIndustryList = () => {
  return http.request<Response<Array<{ id: number; name: string }>>>(
    "get",
    "/api/v1/industries"
  );
};

export const getRegionList = () => {
  return http.request<
    Response<Array<{ id: number; name: string; code: string }>>
  >("get", "/api/v1/regions");
};

export const getCenterTypeList = () => {
  return http.request<
    Response<
      Array<{ id: number; name: string; code: string; description?: string }>
    >
  >("get", "/api/v1/offshore-center-types");
};

// 批量删除离岸中心
export const batchDeleteOffshore = (
  ids: number[]
): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟批量删除离岸中心:", ids);
      resolve({
        code: 200,
        success: true,
        message: `成功删除${ids.length}个离岸中心`,
        data: null
      });
    }, 800);
  });
};

// 批量更新离岸中心状态
export const batchUpdateOffshoreStatus = (
  ids: number[],
  status: number
): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟批量更新离岸中心状态:", ids, status);
      
      // 在模拟数据中批量更新状态
      ids.forEach(id => {
        const target = mockOffshoreData.find(item => item.id === id);
        if (target) {
          target.status = status;
          target.updatedTime = new Date().toISOString();
        }
      });
      
      resolve({
        code: 200,
        success: true,
        message: `成功更新${ids.length}个离岸中心的状态`,
        data: null
      });
    }, 800);
  });
};

// 推荐/取消推荐离岸中心
export const toggleOffshoreRecommend = (
  id: number,
  isRecommended: boolean
): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟切换离岸中心推荐状态:", id, isRecommended);
      
      // 在模拟数据中更新推荐状态
      const target = mockOffshoreData.find(item => item.id === id);
      if (target) {
        target.isRecommended = isRecommended;
        target.updatedTime = new Date().toISOString();
      }
      
      resolve({
        code: 200,
        success: true,
        message: isRecommended ? "推荐成功" : "取消推荐成功",
        data: null
      });
    }, 500);
  });
};
