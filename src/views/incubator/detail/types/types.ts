import type { IncubatorItem } from "../../list/types/types";

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

export interface IncubatorDetail extends IncubatorItem {
  description?: string;
  detailedIntro?: string;
  environmentShowcase?: string;
  residentEnterprises?: string;
  serviceContent?: string;
  policySupport?: string;
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
  totalViews?: number;
  favorites?: number;
}
