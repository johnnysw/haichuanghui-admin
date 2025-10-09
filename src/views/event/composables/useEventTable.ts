// 活动表格相关逻辑

import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getEventList, deleteEvent } from "../api";
import { EVENT_CATEGORIES, EVENT_STATUS_OPTIONS } from "../types/types";
import type { EventItem, EventListParams } from "../types/types";
import type { PaginationProps } from "@pureadmin/table";

export function useEventTable() {
  const loading = ref(false);
  const dataList = ref<EventItem[]>([]);

  // 搜索表单
  const searchForm = reactive<Omit<EventListParams, "page" | "pageSize">>({
    title: "",
    location: "",
    category: "",
    status: "",
    isRecommended: "",
    organizer: ""
  });

  // 分页配置
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 50, 100]
  });

  // 表格列配置
  const columns: TableColumnList = [
    {
      label: "ID",
      prop: "id",
      width: 70
    },
    {
      label: "活动封面",
      prop: "coverImage",
      width: 100,
      slot: "coverImage"
    },
    {
      label: "活动标题",
      prop: "title",
      minWidth: 200,
      showOverflowTooltip: true
    },
    {
      label: "活动分类",
      prop: "category",
      width: 120,
      slot: "category"
    },
    {
      label: "活动地点",
      prop: "location",
      width: 150,
      showOverflowTooltip: true
    },
    {
      label: "主办方",
      prop: "organizer",
      width: 150,
      showOverflowTooltip: true
    },
    {
      label: "开始时间",
      prop: "startTime",
      width: 160,
      slot: "startTime"
    },
    {
      label: "报名人数",
      prop: "participants",
      width: 120,
      slot: "participants"
    },
    {
      label: "状态",
      prop: "status",
      width: 100,
      slot: "status"
    },
    {
      label: "推荐",
      prop: "isRecommended",
      width: 80,
      slot: "isRecommended"
    },
    {
      label: "创建时间",
      prop: "createdTime",
      width: 160,
      slot: "createdTime"
    },
    {
      label: "操作",
      fixed: "right",
      width: 200,
      slot: "operation"
    }
  ];

  // 获取数据
  const getData = async () => {
    loading.value = true;
    try {
      const params: EventListParams = {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        ...searchForm
      };

      const { data } = await getEventList(params);
      dataList.value = data.list;
      pagination.total = data.total;
    } catch (error) {
      console.error("获取活动数据失败:", error);
      ElMessage.error("获取数据失败");
    } finally {
      loading.value = false;
    }
  };

  // 搜索
  const handleSearch = () => {
    pagination.currentPage = 1;
    getData();
  };

  // 重置搜索表单
  const handleReset = () => {
    Object.keys(searchForm).forEach(key => {
      searchForm[key] = "";
    });
    pagination.currentPage = 1;
    getData();
  };

  // 分页处理
  const handleSizeChange = (size: number) => {
    pagination.pageSize = size;
    pagination.currentPage = 1;
    getData();
  };

  const handleCurrentChange = (page: number) => {
    pagination.currentPage = page;
    getData();
  };

  // 删除活动
  const handleDelete = async (row: EventItem) => {
    try {
      await ElMessageBox.confirm(`确认删除活动"${row.title}"吗？`, "删除确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });

      await deleteEvent(row.id);
      ElMessage.success("删除成功");
      getData();
    } catch (error) {
      if (error !== "cancel") {
        console.error("删除失败:", error);
        ElMessage.error("删除失败");
      }
    }
  };

  // 获取活动分类标签
  const getCategoryLabel = (category: string) => {
    const option = EVENT_CATEGORIES.find(item => item.value === category);
    return option ? option.label : category;
  };

  // 获取状态信息
  const getStatusInfo = (status: number) => {
    const statusMap = {
      0: { label: "禁用", color: "danger", type: "danger" },
      1: { label: "正常", color: "success", type: "success" },
      2: { label: "审核中", color: "warning", type: "warning" },
      3: { label: "已拒绝", color: "danger", type: "danger" }
    };
    return statusMap[status] || { label: "未知", color: "info", type: "info" };
  };

  // 格式化时间
  const formatDateTime = (dateTime: string) => {
    return dateTime.replace(/:\d{2}$/, ""); // 移除秒数
  };

  // 初始化
  onMounted(() => {
    getData();
  });

  return {
    loading,
    dataList,
    searchForm,
    pagination,
    columns,
    categoryOptions: EVENT_CATEGORIES,
    statusOptions: EVENT_STATUS_OPTIONS,
    getData,
    handleSearch,
    handleReset,
    handleSizeChange,
    handleCurrentChange,
    handleDelete,
    getCategoryLabel,
    getStatusInfo,
    formatDateTime
  };
}
