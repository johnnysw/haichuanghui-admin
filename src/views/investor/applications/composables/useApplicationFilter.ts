import { ref, reactive } from "vue";
import type { ApplicationQueryParams, BaseOption } from "../types/types";

export function useApplicationFilter() {
  const loading = ref(false);
  
  // 筛选表单
  const filterForm = reactive<ApplicationQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    status: undefined,
    dateRange: [],
    reviewerId: undefined
  });

  // 状态选项
  const statusOptions: BaseOption[] = [
    { label: "全部状态", value: "" },
    { label: "待审核", value: 2 },
    { label: "已通过", value: 1 },
    { label: "已拒绝", value: 3 },
    { label: "草稿", value: 0 }
  ];

  // 审核员选项（模拟数据）
  const reviewerOptions: BaseOption[] = [
    { label: "全部审核员", value: "" },
    { label: "管理员", value: 1 },
    { label: "审核员1", value: 2 },
    { label: "审核员2", value: 3 }
  ];

  // 日期快捷选项
  const dateShortcuts = [
    {
      text: '今天',
      value: () => {
        const today = new Date();
        return [today, today];
      }
    },
    {
      text: '最近一周',
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        return [start, end];
      }
    },
    {
      text: '最近一月',
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        return [start, end];
      }
    },
    {
      text: '最近三月',
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        return [start, end];
      }
    }
  ];

  // 重置筛选条件
  const resetFilter = () => {
    Object.assign(filterForm, {
      page: 1,
      limit: 10,
      search: "",
      status: undefined,
      dateRange: [],
      reviewerId: undefined
    });
  };

  // 处理搜索
  const handleSearch = () => {
    filterForm.page = 1;
  };

  // 处理筛选变化
  const handleFilterChange = () => {
    filterForm.page = 1;
  };

  return {
    loading,
    filterForm,
    statusOptions,
    reviewerOptions,
    dateShortcuts,
    resetFilter,
    handleSearch,
    handleFilterChange
  };
}