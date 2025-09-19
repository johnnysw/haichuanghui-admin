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

export interface IncubatorCreateForm {
  name: string;
  location: string;
  type: string;
  description: string;
  website?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  establishedDate?: string;
  areaSize: number; // 面积大小(平方米)
  companyCount: number; // 入驻企业数量
  graduatedCount: number; // 毕业企业数量
  services: string[]; // 服务内容
  policies: PolicyFile[]; // 政策支持文件
  images: ImageFile[]; // 环境图片
}

export interface ApiResponse<T = any> {
  code: number;
  success: boolean;
  message?: string;
  data: T;
}