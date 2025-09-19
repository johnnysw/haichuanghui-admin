import type { IncubatorCreateForm, ApiResponse } from "./types";

// 模拟创建载体API
export const createIncubator = (data: IncubatorCreateForm): Promise<ApiResponse<{ id: number }>> => {
  return new Promise((resolve) => {
    console.log("创建载体:", data);
    
    // 模拟网络延迟
    setTimeout(() => {
      const mockId = Date.now(); // 使用时间戳作为模拟ID
      resolve({
        code: 200,
        success: true,
        message: "载体创建成功",
        data: { id: mockId }
      });
    }, 1000);
  });
};