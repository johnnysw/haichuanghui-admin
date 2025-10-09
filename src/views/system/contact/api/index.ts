import { http } from "@/utils/http";
import type { Response } from "@/types/response";
import type { ContactFormModel, ContactInfo } from "../types/types";

/**
 * 获取联系方式配置
 */
export const getContactInfo = (): Promise<Response<ContactInfo>> => {
  return http.get<Response<ContactInfo>, any>("/api/v1/admin/system/contact");
};

/**
 * 更新联系方式配置
 */
export const updateContactInfo = (
  data: ContactFormModel
): Promise<Response<ContactInfo>> => {
  return http.request<Response<ContactInfo>>(
    "put",
    "/api/v1/admin/system/contact",
    { data }
  );
};
