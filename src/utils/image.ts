/**
 * 图片URL处理工具函数
 */

// 获取API基础URL
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
// 获取客户端API基础URL
const clientApiUrl = import.meta.env.VITE_CLIENT_API_URL || "";

/**
 * 将相对路径的图片URL转换为完整的URL
 * @param url 图片URL（可能是相对路径）
 * @returns 完整的图片URL
 */
export const getFullImageUrl = (url: string): string => {
  if (!url) return "";

  // 如果已经是完整URL，则直接返回
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // 如果是以/uploads开头的相对路径，则拼接API基础URL
  if (url.startsWith("/uploads")) {
    return `${apiBaseUrl}/public${url}`;
  }

  // 兼容性处理：如果是不带/的uploads开头，也要处理
  if (url.startsWith("uploads")) {
    return `${apiBaseUrl}/public/${url}`;
  }

  return url;
};

/**
 * 批量处理图片URL列表
 * @param urls 图片URL列表
 * @returns 处理后的完整URL列表
 */
export const getFullImageUrls = (urls: string[]): string[] => {
  return urls.filter(Boolean).map(url => getFullImageUrl(url));
};

/**
 * 将相对路径的图片URL转换为客户端完整的URL
 * @param url 图片URL（可能是相对路径）
 * @returns 完整的客户端图片URL
 */
export const getClientImageUrl = (url: string): string => {
  if (!url) return "";

  // 如果已经是完整URL，则直接返回
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // 确保URL路径正确拼接
  const baseUrl = clientApiUrl.endsWith('/') ? clientApiUrl.slice(0, -1) : clientApiUrl;
  const imagePath = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${imagePath}`;
};

/**
 * 批量处理客户端图片URL列表
 * @param urls 图片URL列表
 * @returns 处理后的完整客户端URL列表
 */
export const getClientImageUrls = (urls: string[]): string[] => {
  return urls.filter(Boolean).map(url => getClientImageUrl(url));
};
