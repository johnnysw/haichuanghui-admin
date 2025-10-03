import { http } from "@/utils/http";
import type { Response } from "@/types/response";
import type {
  RegistrationQueryParams,
  RegistrationListResponse,
  RegistrationDetail,
} from "../types/types";

export const getCompetitionRegistrations = (
  competitionId: number,
  params: RegistrationQueryParams
) => {
  return http.request<Response<RegistrationListResponse>>(
    "get",
    `/api/v1/admin/competition/${competitionId}/registrations`,
    { params }
  );
};

export const getRegistrationDetail = (id: number) => {
  return http.request<Response<RegistrationDetail>>(
    "get",
    `/api/v1/admin/competition-registration/${id}`
  );
};

export const updateRegistrationStatus = (
  id: number,
  status: number,
  reviewComment?: string
) => {
  const data: Record<string, unknown> = { status };
  if (reviewComment !== undefined) {
    data.reviewComment = reviewComment;
  }
  return http.request<Response<RegistrationDetail>>(
    "post",
    `/api/v1/admin/competition-registration/${id}/status`,
    { data }
  );
};