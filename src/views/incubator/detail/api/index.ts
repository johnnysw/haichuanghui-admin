import { http } from "@/utils/http";
import type { Response } from "@/types/response";
import type { IncubatorDetail } from "../types/types";

const API_PREFIX = "/api/v1/admin/incubators";

export const getIncubatorDetail = (id: number) => {
  return http.request<Response<IncubatorDetail>>("get", `${API_PREFIX}/${id}`);
};

export const updateIncubatorStatus = (
  id: number,
  status: number,
  reason?: string
) => {
  return http.request<Response<null>>("put", `${API_PREFIX}/${id}`, {
    data: { status, reason }
  });
};
