import type {
  OffshoreCenterDetail,
  OffshoreStats
} from "../../list/types/types";

export type { OffshoreCenterDetail, OffshoreStats };

export interface StatusInfo {
  label: string;
  type: "success" | "warning" | "danger" | "info";
}

export interface TypeInfo {
  label: string;
  color: string;
  bgColor: string;
}

export interface ApiResponse<T = any> {
  code: number;
  success: boolean;
  message?: string;
  data: T;
}
