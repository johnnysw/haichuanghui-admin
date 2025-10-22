import { http } from "@/utils/http";
import type { PageResponse, Response } from "@/types/response";
import type {
  EventForm,
  EventInfo,
  EventListResponse,
  EventQueryParams,
  OptionItem,
} from "../types/types";

export const getEventList = (params: EventQueryParams) => {
  return http.request<PageResponse<EventListResponse>>("get", "/api/v1/admin/event", {
    params,
  });
};

export const getEventDetail = (id: number) => {
  return http.request<Response<EventInfo>>("get", `/api/v1/admin/event/${id}`);
};

export const createEvent = (data: EventForm) => {
  return http.request<Response<EventInfo>>("post", "/api/v1/admin/event", { data });
};

export const updateEvent = (id: number, data: EventForm) => {
  return http.request<Response<EventInfo>>("put", `/api/v1/admin/event/${id}`, { data });
};

export const deleteEvent = (id: number) => {
  return http.request<Response<null>>("delete", `/api/v1/admin/event/${id}`);
};

export const getEventTypes = () => {
  return http.request<Response<OptionItem[]>>("get", "/api/v1/event-types");
};

export const getRegionList = () => {
  return http.request<Response<OptionItem[]>>("get", "/api/v1/regions");
};

/**
 * 获取活动统计信息
 */
export const getEventStats = () => {
  return http.request<Response<{ totalViewCount: number; totalRegistrationCount: number }>>(
    "get",
    "/api/v1/admin/event/stats"
  );
};

