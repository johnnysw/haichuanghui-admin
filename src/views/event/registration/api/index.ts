import { http } from "@/utils/http";
import type { Response, PageResponse } from "@/types/response";
import type {
  EventRegistrationListResponse,
  EventRegistrationQuery,
  EventRegistrationDetail,
} from "../types/types";

export const getEventRegistrations = (eventId: number, params: EventRegistrationQuery) => {
  return http.request<PageResponse<EventRegistrationListResponse>>(
    "get",
    `/api/v1/admin/event/${eventId}/registrations`,
    { params }
  );
};


