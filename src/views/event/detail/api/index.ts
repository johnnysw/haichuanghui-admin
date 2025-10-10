import { http } from "@/utils/http";
import type { Response } from "@/types/response";
import type { EventInfo } from "../../list/types/types";

export const getEventDetail = (id: number) => {
  return http.request<Response<EventInfo>>("get", `/api/v1/admin/event/${id}`);
};

