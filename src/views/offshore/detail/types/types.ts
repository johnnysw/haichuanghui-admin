import type { OffshoreCenter } from "../../list/types/types";

export interface PolicyFile {
  name: string;
  url: string;
  size?: number;
  type?: string;
}

export interface ImageFile {
  name: string;
  url: string;
  size?: number;
  type?: string;
}

export interface OffshoreDetail extends OffshoreCenter {
  description?: string;
  website?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  services?: string[];
  advantages?: string[];
  policies?: PolicyFile[]; // 政策支持文件
  images?: ImageFile[]; // 环境图片
  establishedDate?: string;
  areaSize?: number; // 面积大小(平方米)
  companyCount?: number; // 入驻企业数量
  graduatedCount?: number; // 毕业企业数量
  successStoryCount?: number; // 成功案例数量
  detailedIntro?: string; // 详细介绍(HTML)
}

export interface OffshoreStats {
  todayViews: number;
  totalViews: number;
  monthlyViews: number;
  applications: number;
  favorites: number;
}

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