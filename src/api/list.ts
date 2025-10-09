// List API - 卡片列表相关接口
export interface ListItem {
  id: number;
  title: string;
  description: string;
  image?: string;
  status: number;
  createdTime: string;
}

export interface ListResponse {
  list: ListItem[];
  total: number;
}

// Mock 数据
const mockListData: ListItem[] = [
  {
    id: 1,
    title: "示例卡片1",
    description: "这是一个示例卡片描述",
    image: "https://via.placeholder.com/300x200",
    status: 1,
    createdTime: "2024-01-01 10:00:00"
  },
  {
    id: 2,
    title: "示例卡片2",
    description: "这是另一个示例卡片描述",
    image: "https://via.placeholder.com/300x200",
    status: 1,
    createdTime: "2024-01-02 11:00:00"
  }
];

export const getCardList = (
  params?: any
): Promise<{ code: number; data: ListResponse; message: string }> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          list: mockListData,
          total: mockListData.length
        },
        message: "获取成功"
      });
    }, 200);
  });
};
