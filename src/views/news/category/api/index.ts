import type { 
  NewsCategory, 
  CategoryCreateForm, 
  CategoryListParams,
  ApiResponse, 
  PaginationResponse
} from "../types/types";

// 模拟分类数据
const mockCategoryData: NewsCategory[] = [
  {
    id: 1,
    name: "重大活动",
    code: "major_events",
    description: "重要活动和会议资讯",
    icon: "ri:calendar-event-line",
    displayOrder: 1,
    level: 1,
    path: "1",
    isActive: true,
    isNavigation: true,
    articleCount: 15,
    status: 1,
    createdTime: "2024-01-01T00:00:00Z",
    updatedTime: "2024-03-01T00:00:00Z"
  },
  {
    id: 2,
    name: "政策动态",
    code: "policy_news",
    description: "政府政策和法规动态",
    icon: "ri:government-line",
    displayOrder: 2,
    level: 1,
    path: "2",
    isActive: true,
    isNavigation: true,
    articleCount: 28,
    status: 1,
    createdTime: "2024-01-01T00:00:00Z",
    updatedTime: "2024-03-01T00:00:00Z"
  },
  {
    id: 3,
    name: "行业报告",
    code: "industry_reports",
    description: "行业研究报告和数据分析",
    icon: "ri:bar-chart-line",
    displayOrder: 3,
    level: 1,
    path: "3",
    isActive: true,
    isNavigation: true,
    articleCount: 42,
    status: 1,
    createdTime: "2024-01-01T00:00:00Z",
    updatedTime: "2024-03-01T00:00:00Z"
  },
  {
    id: 4,
    name: "行业动态",
    code: "industry_news",
    description: "各行业最新动态和趋势",
    icon: "ri:line-chart-line",
    displayOrder: 4,
    level: 1,
    path: "4",
    isActive: true,
    isNavigation: true,
    articleCount: 56,
    status: 1,
    createdTime: "2024-01-01T00:00:00Z",
    updatedTime: "2024-03-01T00:00:00Z"
  },
  {
    id: 5,
    name: "技术前沿",
    code: "tech_frontier",
    description: "前沿技术和创新应用",
    icon: "ri:rocket-line",
    displayOrder: 5,
    level: 1,
    path: "5",
    isActive: true,
    isNavigation: true,
    articleCount: 33,
    status: 1,
    createdTime: "2024-01-01T00:00:00Z",
    updatedTime: "2024-03-01T00:00:00Z"
  },
  {
    id: 6,
    name: "企业服务",
    code: "business_service",
    description: "企业服务相关资讯",
    icon: "ri:building-line",
    displayOrder: 6,
    level: 1,
    path: "6",
    isActive: false,
    isNavigation: false,
    articleCount: 12,
    status: 0,
    createdTime: "2024-02-15T00:00:00Z",
    updatedTime: "2024-02-15T00:00:00Z"
  },
  {
    id: 7,
    name: "投融资",
    code: "investment",
    description: "投融资相关资讯",
    icon: "ri:money-dollar-circle-line",
    displayOrder: 7,
    level: 1,
    path: "7",
    isActive: true,
    isNavigation: false,
    articleCount: 23,
    status: 1,
    createdTime: "2024-01-15T00:00:00Z",
    updatedTime: "2024-03-01T00:00:00Z"
  },
  {
    id: 8,
    name: "人才发展",
    code: "talent_development",
    description: "人才培养和发展相关资讯",
    icon: "ri:user-star-line",
    displayOrder: 8,
    level: 1,
    path: "8",
    isActive: true,
    isNavigation: true,
    articleCount: 18,
    status: 1,
    createdTime: "2024-01-20T00:00:00Z",
    updatedTime: "2024-03-01T00:00:00Z"
  },
  {
    id: 9,
    name: "国际合作",
    code: "international_cooperation",
    description: "国际合作与交流资讯",
    icon: "ri:global-line",
    displayOrder: 9,
    level: 1,
    path: "9",
    isActive: false,
    isNavigation: false,
    articleCount: 8,
    status: 2,
    reviewComment: "分类定位不够明确，需要重新调整",
    reviewTime: "2024-02-20T00:00:00Z",
    createdTime: "2024-02-10T00:00:00Z",
    updatedTime: "2024-02-20T00:00:00Z"
  },
  {
    id: 10,
    name: "创新创业",
    code: "innovation_entrepreneurship",
    description: "创新创业相关资讯和政策",
    icon: "ri:lightbulb-line",
    displayOrder: 10,
    level: 1,
    path: "10",
    isActive: true,
    isNavigation: true,
    articleCount: 37,
    status: 1,
    createdTime: "2024-01-05T00:00:00Z",
    updatedTime: "2024-03-01T00:00:00Z"
  }
];

// 获取分类列表
export const getCategoryList = (params: CategoryListParams): Promise<ApiResponse<PaginationResponse<NewsCategory>>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      let filteredData = [...mockCategoryData];
      
      // 名称搜索
      if (params.name) {
        const name = params.name.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.name.toLowerCase().includes(name)
        );
      }
      
      // 代码搜索
      if (params.code) {
        const code = params.code.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.code.toLowerCase().includes(code)
        );
      }
      
      // 状态筛选
      if (params.status !== undefined) {
        filteredData = filteredData.filter(item => item.status === params.status);
      }
      
      // 启用状态筛选
      if (params.isActive !== undefined) {
        filteredData = filteredData.filter(item => item.isActive === params.isActive);
      }
      
      // 父级分类筛选
      if (params.parentId !== undefined) {
        filteredData = filteredData.filter(item => item.parentId === params.parentId);
      }
      
      // 层级筛选
      if (params.level !== undefined) {
        filteredData = filteredData.filter(item => item.level === params.level);
      }
      
      // 导航显示筛选
      if (params.isNavigation !== undefined) {
        filteredData = filteredData.filter(item => item.isNavigation === params.isNavigation);
      }
      
      // 排序
      const sortBy = params.sortBy || 'displayOrder';
      const sortOrder = params.sortOrder || 'asc';
      filteredData.sort((a, b) => {
        let aValue = a[sortBy as keyof NewsCategory];
        let bValue = b[sortBy as keyof NewsCategory];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'desc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
        }
        return 0;
      });
      
      // 分页
      const page = params.page || 1;
      const pageSize = params.pageSize || 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const list = filteredData.slice(start, end);
      
      resolve({
        code: 200,
        success: true,
        message: "获取分类列表成功",
        data: {
          list,
          total: filteredData.length,
          page,
          pageSize
        }
      });
    }, 300);
  });
};

// 创建分类
export const createCategory = (formData: CategoryCreateForm): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟创建分类:", formData);
      
      // 模拟添加到数据中
      const newCategory: NewsCategory = {
        id: Date.now(), // 模拟生成ID
        ...formData,
        level: formData.parentId ? 2 : 1, // 简单的层级判断
        path: formData.parentId ? `${formData.parentId},${Date.now()}` : `${Date.now()}`,
        articleCount: 0,
        status: 0, // 新创建的分类默认为待审核状态
        createdTime: new Date().toISOString(),
        updatedTime: new Date().toISOString()
      };
      mockCategoryData.push(newCategory);
      
      resolve({
        code: 200,
        success: true,
        message: "分类创建成功",
        data: null
      });
    }, 1000);
  });
};

// 更新分类
export const updateCategory = (id: number, formData: Partial<CategoryCreateForm>): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟更新分类:", id, formData);
      
      // 在模拟数据中更新
      const target = mockCategoryData.find(item => item.id === id);
      if (target) {
        Object.assign(target, formData, { updatedTime: new Date().toISOString() });
      }
      
      resolve({
        code: 200,
        success: true,
        message: "分类更新成功",
        data: null
      });
    }, 1000);
  });
};

// 删除分类
export const deleteCategory = (id: number): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟删除分类:", id);
      
      // 从模拟数据中删除
      const index = mockCategoryData.findIndex(item => item.id === id);
      if (index > -1) {
        mockCategoryData.splice(index, 1);
      }
      
      resolve({
        code: 200,
        success: true,
        message: "分类删除成功",
        data: null
      });
    }, 500);
  });
};

// 批量删除分类
export const batchDeleteCategory = (ids: number[]): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟批量删除分类:", ids);
      
      // 从模拟数据中批量删除
      ids.forEach(id => {
        const index = mockCategoryData.findIndex(item => item.id === id);
        if (index > -1) {
          mockCategoryData.splice(index, 1);
        }
      });
      
      resolve({
        code: 200,
        success: true,
        message: "批量删除成功",
        data: null
      });
    }, 1000);
  });
};

// 切换启用状态
export const toggleCategoryActive = (id: number, isActive: boolean): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟切换分类启用状态:", id, isActive);
      
      // 在模拟数据中更新启用状态
      const target = mockCategoryData.find(item => item.id === id);
      if (target) {
        target.isActive = isActive;
        target.updatedTime = new Date().toISOString();
      }
      
      resolve({
        code: 200,
        success: true,
        message: isActive ? "启用成功" : "禁用成功",
        data: null
      });
    }, 500);
  });
};

// 切换导航显示状态
export const toggleCategoryNavigation = (id: number, isNavigation: boolean): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟切换分类导航显示状态:", id, isNavigation);
      
      // 在模拟数据中更新导航显示状态
      const target = mockCategoryData.find(item => item.id === id);
      if (target) {
        target.isNavigation = isNavigation;
        target.updatedTime = new Date().toISOString();
      }
      
      resolve({
        code: 200,
        success: true,
        message: isNavigation ? "显示导航成功" : "取消导航成功",
        data: null
      });
    }, 500);
  });
};

// 更新分类状态
export const updateCategoryStatus = (id: number, status: number, reviewComment?: string): Promise<ApiResponse<null>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("模拟更新分类状态:", id, status, reviewComment);
      
      // 在模拟数据中更新状态
      const target = mockCategoryData.find(item => item.id === id);
      if (target) {
        target.status = status;
        target.reviewTime = new Date().toISOString();
        target.updatedTime = new Date().toISOString();
        if (reviewComment) {
          target.reviewComment = reviewComment;
        }
      }
      
      resolve({
        code: 200,
        success: true,
        message: "状态更新成功",
        data: null
      });
    }, 500);
  });
};

// 获取分类树（用于父级分类选择）
export const getCategoryTree = (): Promise<ApiResponse<NewsCategory[]>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      // 过滤出已审核通过的一级分类
      const topLevelCategories = mockCategoryData.filter(item => 
        item.level === 1 && item.status === 1
      );
      
      resolve({
        code: 200,
        success: true,
        message: "获取分类树成功",
        data: topLevelCategories
      });
    }, 200);
  });
};