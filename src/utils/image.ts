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
  if (!url) return getDefaultImage();

  // 如果已经是完整URL，则直接返回
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // 处理以/public开头的路径
  if (url.startsWith('/public')) {
    return `${apiBaseUrl}${url}`;
  }

  // 如果是以/uploads开头的相对路径，则拼接API基础URL
  if (url.startsWith('/uploads')) {
    return `${apiBaseUrl}/public${url}`;
  }

  // 兼容性处理：如果是不带/的uploads开头，也要处理
  if (url.startsWith('uploads')) {
    return `${apiBaseUrl}/public/${url}`;
  }

  // 默认情况下，添加/public前缀
  return `${apiBaseUrl}/public${url.startsWith('/') ? url : `/${url}`}`;
};

/**
 * 创建SVG占位图片
 */
const createSvgPlaceholder = (width: number, height: number, bgColor: string, textColor: string, text: string): string => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>
  `;
  // 使用encodeURIComponent代替btoa来处理中文字符
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

/**
 * 获取默认占位图片
 */
export const getDefaultImage = (): string => {
  return createSvgPlaceholder(300, 200, "#f0f0f0", "#666666", "暂无图片");
};

/**
 * 根据路径获取合适的占位图片
 */
export const getPlaceholderImage = (path: string): string => {
  if (path.includes("logo")) {
    return createSvgPlaceholder(120, 120, "#4f46e5", "#ffffff", "LOGO");
  }
  if (path.includes("project")) {
    return createSvgPlaceholder(400, 300, "#10b981", "#ffffff", "项目图片");
  }
  if (path.includes("business-plan")) {
    return createSvgPlaceholder(200, 260, "#ef4444", "#ffffff", "商业计划书");
  }
  return createSvgPlaceholder(300, 200, "#6b7280", "#ffffff", "图片");
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
