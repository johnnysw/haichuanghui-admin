import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { PaginationProps } from "@pureadmin/table";
import type {
  InvestorApplication,
  ApplicationQueryParams
} from "../types/types";
import { getApplicationList, getApplicationStats } from "../api";

export function useApplicationTable() {
  const loading = ref(false);
  const applicationList = ref<InvestorApplication[]>([]);
  const isShow = ref(false);

  // 筛选表单
  const filterForm = ref<ApplicationQueryParams>({
    page: 1,
    limit: 20,
    search: "",
    status: "",
    dateRange: null,
    reviewerId: undefined
  });

  // 分页配置
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 20,
    currentPage: 1,
    background: true,
    layout: "total, sizes, prev, pager, next, jumper"
  });

  // 统计数据
  const stats = ref({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    todaySubmitted: 0
  });

  // 状态选项
  const statusOptions = [
    { label: "全部状态", value: "" },
    { label: "待审核", value: "2" },
    { label: "审核通过", value: "1" },
    { label: "审核拒绝", value: "3" }
  ];

  // 表格列配置
  const columns: TableColumnList = [
    {
      label: "申请人",
      prop: "user",
      width: 180,
      formatter: (row: InvestorApplication) =>
        row.user?.realName || row.user?.username || "未知"
    },
    {
      label: "联系方式",
      prop: "contact",
      width: 150,
      formatter: (row: InvestorApplication) =>
        row.user?.phone || row.user?.email || "-"
    },
    {
      label: "投资机构",
      prop: "investmentInstitution",
      minWidth: 200,
      showOverflowTooltip: true
    },
    {
      label: "投资偏好",
      prop: "investmentPreference",
      width: 120,
      showOverflowTooltip: true
    },
    {
      label: "申请状态",
      prop: "status",
      width: 100,
      slot: "status"
    },
    {
      label: "申请时间",
      prop: "submittedTime",
      width: 180,
      formatter: (row: InvestorApplication) =>
        row.submittedTime?.slice(0, 19) || "-"
    },
    {
      label: "审核人",
      prop: "reviewer",
      width: 120,
      formatter: (row: InvestorApplication) =>
        row.reviewer?.realName || row.reviewer?.username || "-"
    },
    {
      label: "操作",
      fixed: "right",
      width: 220,
      slot: "operation"
    }
  ];

  // 获取状态类型
  const getStatusType = (status: number) => {
    const statusMap = {
      1: "success", // 审核通过
      2: "warning", // 待审核
      3: "danger" // 审核拒绝
    };
    return statusMap[status] || "info";
  };

  // 获取状态文本
  const getStatusText = (status: number) => {
    const statusMap = {
      1: "审核通过",
      2: "待审核",
      3: "审核拒绝"
    };
    return statusMap[status] || "未知";
  };

  // 获取申请列表数据
  const getApplicationData = async (
    params?: Partial<ApplicationQueryParams>
  ) => {
    try {
      loading.value = true;
      const queryParams = { ...filterForm.value, ...params };
      const response = await getApplicationList(queryParams);

      applicationList.value = response.data.list;
      pagination.total = response.data.total;
      pagination.currentPage = response.data.page;
    } catch (error) {
      console.error("获取申请列表失败:", error);
      ElMessage.error("获取申请列表失败");
    } finally {
      loading.value = false;
    }
  };

  // 获取统计数据
  const fetchStats = async () => {
    try {
      const { data } = await getApplicationStats();
      stats.value = data as any;
    } catch (error) {
      console.error("获取统计数据失败:", error);
    }
  };

  // 搜索
  const handleSearch = () => {
    filterForm.value.page = 1;
    pagination.currentPage = 1;
    getApplicationData();
  };

  // 重置
  const handleReset = (formRef: any) => {
    formRef?.resetFields();
    filterForm.value = {
      page: 1,
      limit: 20,
      search: "",
      status: "",
      dateRange: null,
      reviewerId: undefined
    };
    pagination.currentPage = 1;
    getApplicationData();
  };

  // 刷新
  const handleRefresh = () => {
    getApplicationData();
    fetchStats();
  };

  // 分页大小变化
  const handleSizeChange = (val: number) => {
    filterForm.value.limit = val;
    pagination.pageSize = val;
    getApplicationData();
  };

  // 页码变化
  const handleCurrentChange = (val: number) => {
    filterForm.value.page = val;
    pagination.currentPage = val;
    getApplicationData();
  };

  // 初始化数据
  onMounted(() => {
    getApplicationData();
    fetchStats();
  });

  return {
    loading,
    isShow,
    applicationList,
    filterForm,
    pagination,
    stats,
    statusOptions,
    columns,
    getStatusType,
    getStatusText,
    getApplicationData,
    fetchStats,
    handleSearch,
    handleReset,
    handleRefresh,
    handleSizeChange,
    handleCurrentChange
  };
}
