import { http } from "@/utils/http";
import type { Response } from "@/types/response"; // 导入项目中定义的 Response 类型

/** 通用上传API基础路径 */
const UPLOAD_BASE_URL = "/api/v1/admin/upload";

/** 图片上传接口地址 */
const IMAGE_UPLOAD_URL = `${UPLOAD_BASE_URL}/image`;
/** 通用文件上传接口地址 */
const FILE_UPLOAD_URL = `${UPLOAD_BASE_URL}/file`;

/** 通用文件上传返回结果类型 (可用于图片和文件) */
export interface FileUploadResult {
  filename: string; // 服务器存储的文件名 (相对路径)
  originalName: string; // 原始文件名
  size: number;
  url: string; // 可访问的 URL (完整路径)
}

/**
 * 上传图片 (返回通用响应格式)
 * @param file File 对象
 * @param module 可选，模块名称 (例如: "competition")，用于后端动态生成目录
 * @returns Promise<Response<FileUploadResult>> // 使用导入的 Response 类型
 */
export const uploadImage = (
  file: File,
  module?: string // 模块参数
): Promise<Response<FileUploadResult>> => {
  const formData = new FormData();
  formData.append("file", file);
  
  // 如果传入了 module，则添加到 FormData 中
  if (module) {
    formData.append("module", module);
  }

  // 调用 http.post，期望返回通用的 Response 格式，其 data 字段包含 FileUploadResult
  return http.post<Response<FileUploadResult>, FormData>( // 更新响应类型泛型
    IMAGE_UPLOAD_URL,
    { data: formData }, // 保持现有 http 工具的调用习惯，将 formData 包装在 data 中
    {
      headers: {
        'Content-Type': 'multipart/form-data' // 显式设置 Header
      }
    }
  );
};

/**
 * 上传通用文件
 * @param file File 对象
 * @param module 可选，模块名称 (例如: "competition")，用于后端动态生成目录
 * @returns Promise<Response<FileUploadResult>> // 也更新为返回通用响应格式
 */
export const uploadFile = (
  file: File,
  module?: string // 模块参数
): Promise<Response<FileUploadResult>> => { // 更新返回类型
  const formData = new FormData();
  formData.append("file", file); // 后端 Controller 默认读取 "file"
  
  // 如果传入了 module，则添加到 FormData 中
  if (module) {
    formData.append("module", module);
  }

  // 参照 uploadImage 的调用方式
  return http.post<Response<FileUploadResult>, FormData>( // 更新响应类型泛型
    FILE_UPLOAD_URL,
    { data: formData }, // 将 formData 包装在 data 属性中
    {
      headers: {
        'Content-Type': 'multipart/form-data' // 显式设置 Header
      }
    }
  );
};
