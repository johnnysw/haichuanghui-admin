import type { ApiResponse, PaginatedResponse, IncubatorItem, IncubatorQueryParams } from "../types/types";

// 本地模拟数据（可替换为真实接口）
const mockIncubators: IncubatorItem[] = [
  { id: 1, name: "深圳创新孵化器", location: "深圳", type: "科技园", status: 1, isRecommended: true, viewCount: 1200, createdTime: "2024-01-01 10:00:00" },
  { id: 2, name: "杭州未来科技城", location: "杭州", type: "science-park", status: 1, isRecommended: false, viewCount: 2250, createdTime: "2024-01-03 09:30:00" },
  { id: 3, name: "北京创客空间", location: "北京", type: "创业园", status: 2, isRecommended: false, viewCount: 560, createdTime: "2024-01-05 08:20:00" },
];

export const getIncubatorList = (params: IncubatorQueryParams): Promise<ApiResponse<PaginatedResponse<IncubatorItem>>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let data = [...mockIncubators];
      if (params.name) data = data.filter(i => i.name.includes(params.name as string));
      if (params.location) data = data.filter(i => (i.location || "").includes(params.location as string));
      if (params.status !== undefined && params.status !== "") data = data.filter(i => String(i.status) === String(params.status));
      if (params.recommended !== undefined && params.recommended !== "") data = data.filter(i => String(!!i.isRecommended) === (params.recommended === "1" ? "true" : "false"));

      const start = (params.page - 1) * params.limit;
      const end = start + params.limit;
      const list = data.slice(start, end);
      resolve({ code: 200, success: true, data: { list, total: data.length, page: params.page, limit: params.limit }, message: "ok" });
    }, 200);
  });
};

export const deleteIncubator = (id: number): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockIncubators.findIndex(i => i.id === id);
      if (index !== -1) mockIncubators.splice(index, 1);
      resolve({ code: 200, success: true, data: null, message: "删除成功" });
    }, 200);
  });
};

