import { ref, reactive, computed, h, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElAvatar, ElTag, ElLink } from "element-plus";
import { getInvestorList } from "../../api";
import { useInvestorFilter } from "./useInvestorFilter";
import { useInvestorActions } from "./useInvestorActions";
import type {
  InvestorInfo,
  InvestorQueryParams,
  NamedOption
} from "../../types/types";
import { INVESTOR_STATUS_MAP } from "../../types/types";
import type { PaginationProps } from "@pureadmin/table";

export function useInvestorTable() {
  const router = useRouter();
  const loading = ref(false);
  const investorList = ref<InvestorInfo[]>([]);
  const total = ref(0);
  const selectedRows = ref<InvestorInfo[]>([]);

  // 使用筛选器
  const {
    filterForm,
    formRef,
    regionOptions,
    industryOptions,
    stageOptions,
    statusOptions,
    resetForm
  } = useInvestorFilter();

  // 分页配置
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 50, 100]
  });

  // 获取投资人数据
  const getInvestorData = async () => {
    loading.value = true;
    try {
      const params: InvestorQueryParams = {
        page: pagination.currentPage,
        limit: pagination.pageSize,
        search: filterForm.search || undefined,
        region: filterForm.region || undefined,
        field: filterForm.field || undefined,
        stage: filterForm.stage || undefined,
        status:
          filterForm.status !== undefined && filterForm.status !== ""
            ? filterForm.status
            : undefined // 不传 status 则查询所有状态
      };

      const response = await getInvestorList(params);

      if (response.code === 200 && response.data) {
        investorList.value = response.data.list || [];
        total.value = response.data.total || 0;
        pagination.total = response.data.total || 0;
        pagination.currentPage = response.data.currentPage || 1;
        pagination.pageSize = response.data.pageSize || 10;
      } else {
        ElMessage.error(response.message || "获取投资人列表失败");
      }
    } catch (error) {
      console.error("获取投资人列表失败:", error);
      ElMessage.error("获取投资人列表失败");
    } finally {
      loading.value = false;
    }
  };

  // 使用操作函数
  const { handleToggleStatus } = useInvestorActions(getInvestorData);

  // 搜索
  const handleSearch = () => {
    pagination.currentPage = 1;
    getInvestorData();
  };

  // 重置
  const handleReset = () => {
    // 重置所有筛选条件为初始值
    filterForm.search = "";
    filterForm.region = "";
    filterForm.field = "";
    filterForm.stage = "";
    filterForm.status = undefined;

    pagination.currentPage = 1;
    getInvestorData();
  };

  // 筛选条件改变
  const handleFilterChange = () => {
    pagination.currentPage = 1;
    getInvestorData();
  };

  // 选择改变
  const handleSelectionChange = (rows: InvestorInfo[]) => {
    selectedRows.value = rows;
  };

  // 分页大小改变
  const handleSizeChange = (val: number) => {
    pagination.pageSize = val;
    pagination.currentPage = 1;
    getInvestorData();
  };

  // 当前页改变
  const handleCurrentChange = (val: number) => {
    pagination.currentPage = val;
    getInvestorData();
  };

  // 查看详情
  const openDetail = (row: InvestorInfo) => {
    router.push(`/investor/detail/${row.id}`);
  };

  // 构建完整图片 URL
  const getFullImageUrl = (url: string): string => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    // 如果已经包含 /public/，直接拼接 API 基础地址
    if (url.startsWith("/public/")) {
      return `${import.meta.env.VITE_API_BASE_URL}${url}`;
    }
    // 否则补充 /public 前缀
    return `${import.meta.env.VITE_API_BASE_URL}/public${url.startsWith("/") ? url : `/${url}`}`;
  };

  // 表格列定义
  const columns: TableColumnList = [
    {
      type: "index",
      width: 55,
      align: "center",
      fixed: "left"
    },
    {
      label: "头像",
      prop: "avatar",
      width: 60,
      cellRenderer: ({ row }) =>
        h(ElAvatar, {
          size: 32,
          src: row?.avatar ? getFullImageUrl(row.avatar) : undefined,
          alt: row?.name || "投资人"
        })
    },
    {
      label: "姓名",
      prop: "name",
      minWidth: 80
    },
    {
      label: "投资机构",
      prop: "investmentInstitution",
      minWidth: 120,
      showOverflowTooltip: true
    },
    {
      label: "职位",
      prop: "position",
      minWidth: 100,
      showOverflowTooltip: true
    },
    {
      label: "关注领域",
      prop: "focusIndustries",
      minWidth: 180,
      cellRenderer: ({ row }) => {
        if (row?.focusIndustries && row.focusIndustries.length > 0) {
          const industries = row.focusIndustries.slice(0, 3);
          const hasMore = row.focusIndustries.length > 3;

          const tags = [
            ...industries.map((industry: NamedOption) =>
              h(
                ElTag,
                {
                  key: industry.id,
                  size: "small",
                  type: "info",
                  effect: "light"
                },
                () => industry.name
              )
            )
          ];

          if (hasMore) {
            tags.push(
              h(
                ElTag,
                {
                  size: "small",
                  type: "info",
                  effect: "light"
                },
                () => `+${row.focusIndustries!.length - 3}`
              )
            );
          }

          return h(
            "div",
            {
              style: "display: flex; flex-wrap: wrap; gap: 4px;"
            },
            tags
          );
        }
        return "-";
      }
    },
    {
      label: "偏好阶段",
      prop: "preferredStages",
      minWidth: 160,
      cellRenderer: ({ row }) => {
        if (row?.preferredStages && row.preferredStages.length > 0) {
          const stages = row.preferredStages.slice(0, 3);
          const hasMore = row.preferredStages.length > 3;

          const tags = [
            ...stages.map((stage: NamedOption) =>
              h(
                ElTag,
                {
                  key: stage.id,
                  size: "small",
                  type: "success",
                  effect: "light"
                },
                () => stage.name
              )
            )
          ];

          if (hasMore) {
            tags.push(
              h(
                ElTag,
                {
                  size: "small",
                  type: "success",
                  effect: "light"
                },
                () => `+${row.preferredStages!.length - 3}`
              )
            );
          }

          return h(
            "div",
            {
              style: "display: flex; flex-wrap: wrap; gap: 4px;"
            },
            tags
          );
        }
        return "-";
      }
    },
    {
      label: "投资金额",
      prop: "investmentRangeText",
      minWidth: 120,
      cellRenderer: ({ row }) =>
        (row as any)?.investmentRangeText || row?.investmentRange || "-"
    },
    {
      label: "投资项目数",
      prop: "investmentCount",
      width: 100,
      align: "center",
      cellRenderer: ({ row }) => row?.investmentCount || 0
    },
    {
      label: "审核状态",
      prop: "status",
      minWidth: 80,
      align: "center",
      cellRenderer: ({ row }) => {
        const statusInfo =
          INVESTOR_STATUS_MAP[row?.status] ||
          ({ label: "未知", type: "info" } as any);
        return h(
          ElTag,
          {
            type: (statusInfo as any).type,
            effect: "light",
            size: "small"
          },
          () => (statusInfo as any).label
        );
      }
    },
    {
      label: "申请时间",
      prop: "createdTime",
      minWidth: 120,
      cellRenderer: ({ row }) => {
        if (!row?.createdTime) return "-";
        // 将 ISO 格式转换为日期（YYYY-MM-DD）
        const date = new Date(row.createdTime);
        return date
          .toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
          })
          .replace(/\//g, "-");
      }
    },
    {
      label: "操作",
      fixed: "right",
      width: 200,
      slot: "operation"
    }
  ];

  // 组件挂载时获取数据
  onMounted(() => {
    getInvestorData();
  });

  const isShow = ref(false);

  return {
    filterForm,
    formRef,
    loading,
    investorList,
    total,
    selectedRows,
    regionOptions,
    industryOptions,
    stageOptions,
    statusOptions,
    columns,
    pagination,
    isShow,
    handleSearch,
    handleReset,
    handleFilterChange,
    getInvestorData,
    handleSelectionChange,
    handleSizeChange,
    handleCurrentChange,
    openDetail,
    handleToggleStatus
  };
}
