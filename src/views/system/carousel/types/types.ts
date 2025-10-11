/**
 * 轮播图相关类型定义
 */

/**
 * 轮播图数据结构
 */
export interface Banner {
  id: number;
  title: string;
  image: string;
  url: string;
  description: string;
  sortOrder: number;
  status: number;
  createdTime: string;
  updatedTime: string;
}

/**
 * 轮播图表单数据
 */
export interface BannerForm {
  title: string;
  image: string;
  url: string;
  description: string;
  sortOrder: number;
  status: number;
}

/**
 * 轮播图查询参数
 */
export interface BannerQuery {
  page?: number;
  limit?: number;
  title?: string;
  status?: number | '';
}

/**
 * 默认表单数据
 */
export const defaultBannerForm: BannerForm = {
  title: '',
  image: '',
  url: '',
  description: '',
  sortOrder: 0,
  status: 1,
};
