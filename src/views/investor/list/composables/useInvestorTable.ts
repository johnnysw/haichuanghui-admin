import { ref, reactive, onMounted, h } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox, ElAvatar, ElLink, ElTag } from "element-plus";
import type { PaginationProps, TableColumns } from "@pureadmin/table";
import { getInvestorList } from "../api";
import type { InvestorInfo, InvestorQueryParams } from "../types/types";
import { INVESTOR_STATUS_MAP } from "../types/types";

export function useInvestorTable() {
  const router = useRouter();
  
  // 表单数据
  const filterForm = reactive<InvestorQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    region: "",
    type: "",
    status: ""
  });

  // 状态
  const loading = ref(false);
  const investorList = ref<InvestorInfo[]>([]);
  const total = ref(0);
  const selectedRows = ref<InvestorInfo[]>([]);
  const isShow = ref(false);

  // 查看详情 - 提前定义
  const openDetail = (row: InvestorInfo) => {
    router.push(`/investor/detail/${row.id}`);
  };

  // 分页配置
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 50, 100]
  });

  // 选项数据
  const regionOptions = ref([
    { label: "北京", value: "1" },
    { label: "上海", value: "2" },
    { label: "深圳", value: "3" },
    { label: "杭州", value: "4" },
    { label: "广州", value: "5" }
  ]);

  const typeOptions = ref([
    { label: "机构投资者", value: "1" },
    { label: "个人投资者", value: "2" }
  ]);

  const statusOptions = ref([
    { label: "待审核", value: "2" },
    { label: "已认证", value: "1" },
    { label: "已拒绝", value: "3" },
    { label: "草稿", value: "0" }
  ]);

  // 表格列定义
  const columns = [
    {
      label: "勾选列",
      type: "selection" as const,
      width: 55,
      align: "left" as const
    },
    {
      label: "序号",
      type: "index" as const,
      width: 70
    },
    {
      label: "头像",
      prop: "user.avatar",
      width: 60,
      cellRenderer: ({ row }) => h(ElAvatar, {
        size: 32,
        src: row.user?.avatar,
        alt: row.user?.realName || "投资人"
      })
    },
    {
      label: "姓名",
      prop: "user.realName",
      minWidth: 80,
      cellRenderer: ({ row }) => h(ElLink, {
        type: "primary",
        underline: false,
        onClick: () => openDetail(row)
      }, () => row.user?.realName || row.user?.username || "-")
    },
    {
      label: "手机号",
      prop: "user.phone",
      minWidth: 110,
      cellRenderer: ({ row }) => {
        const phone = row.user?.phone;
        if (!phone) return "-";
        return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
      }
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
      minWidth: 80,
      cellRenderer: ({ row }) => {
        const positionMap: Record<string, string> = {
          "partner": "合伙人",
          "director": "投资总监", 
          "manager": "投资经理",
          "analyst": "投资分析师",
          "other": "其他"
        };
        return positionMap[row.position] || row.position || "-";
      }
    },
    {
      label: "地区",
      prop: "location",
      minWidth: 60
    },
    {
      label: "类型",
      prop: "investorType.name",
      minWidth: 80,
      cellRenderer: ({ row }) => row.investorType?.name || "-"
    },
    {
      label: "投资金额",
      prop: "investmentAmount",
      minWidth: 100,
      cellRenderer: ({ row }) => {
        const min = row.investmentAmountMin;
        const max = row.investmentAmountMax;
        if (!min && !max) return "-";
        if (min && max) return `${min}-${max}万`;
        if (min) return `${min}万+`;
        return `${max}万内`;
      }
    },
    {
      label: "关注领域",
      prop: "focusIndustries",
      minWidth: 180,
      cellRenderer: ({ row }) => {
        if (row.focusIndustries && row.focusIndustries.length > 0) {
          const industries = row.focusIndustries.slice(0, 3);
          const hasMore = row.focusIndustries.length > 3;
          const tags = [
            ...industries.map(industry => h(ElTag, {
              key: industry.id,
              size: "small",
              type: "info",
              effect: "light"
            }, () => industry.name))
          ];
          
          if (hasMore) {
            tags.push(h(ElTag, {
              size: "small",
              type: "info", 
              effect: "light"
            }, () => `+${row.focusIndustries.length - 3}`));
          }
          
          return h("div", { style: "display: flex; flex-wrap: wrap; gap: 4px;" }, tags);
        }
        return "-";
      }
    },
    {
      label: "认证状态",
      prop: "verified",
      minWidth: 80,
      align: "center",
      cellRenderer: ({ row }) => {
        return h(ElTag, {
          type: row.verified ? "success" : "warning",
          effect: "light",
          size: "small"
        }, () => row.verified ? "已认证" : "未认证");
      }
    },
    {
      label: "审核状态",
      prop: "status",
      minWidth: 80,
      align: "center",
      cellRenderer: ({ row }) => {
        const statusInfo = INVESTOR_STATUS_MAP[row.status] || { label: "未知", color: "info" };
        return h(ElTag, {
          type: statusInfo.color,
          effect: "light",
          size: "small"
        }, () => statusInfo.label);
      }
    },
    {
      label: "浏览量",
      prop: "viewCount",
      minWidth: 60,
      align: "center"
    },
    {
      label: "创建时间",
      prop: "createdTime",
      minWidth: 110,
      cellRenderer: ({ row }) => 
        row.createdTime ? row.createdTime.replace(/:\d{2}$/, "") : "-"
    },
    {
      label: "操作",
      fixed: "right",
      width: 300,
      minWidth: 300,
      slot: "operation"
    }
  ];

  // 获取投资人数据
  const getInvestorData = async (params: InvestorQueryParams) => {
    loading.value = true;
    try {
      const response = await getInvestorList(params);
      if (response.success) {
        investorList.value = response.data.list;
        total.value = response.data.total;
        pagination.total = response.data.total;
        pagination.currentPage = params.page || 1;
        pagination.pageSize = params.limit || 10;
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

  // 搜索
  const handleSearch = () => {
    filterForm.page = 1;
    getInvestorData(filterForm);
  };

  // 重置
  const handleReset = () => {
    Object.assign(filterForm, {
      page: 1,
      limit: 10,
      search: "",
      region: "",
      type: "",
      status: ""
    });
    getInvestorData(filterForm);
  };

  // 筛选条件变化
  const handleFilterChange = () => {
    filterForm.page = 1;
    getInvestorData(filterForm);
  };

  // 分页大小变化
  const handleSizeChange = (size: number) => {
    filterForm.limit = size;
    filterForm.page = 1;
    getInvestorData(filterForm);
  };

  // 当前页变化
  const handleCurrentChange = (page: number) => {
    filterForm.page = page;
    getInvestorData(filterForm);
  };

  // 选择变化
  const handleSelectionChange = (selection: InvestorInfo[]) => {
    selectedRows.value = selection;
  };

  // 打开对话框
  const openDialog = (row?: InvestorInfo) => {
    console.log("打开对话框", row);
    // 这里可以触发自定义事件或调用父组件方法
  };

  // 删除
  const handleDelete = async (row: InvestorInfo) => {
    try {
      await ElMessageBox.confirm(
        `确认要删除投资人"${row.user?.realName || row.user?.username}"吗？`,
        "确认删除",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );
      
      // 这里调用删除API
      console.log("删除投资人:", row);
      ElMessage.success("删除成功");
      getInvestorData(filterForm);
    } catch (error) {
      if (error !== "cancel") {
        ElMessage.error("删除失败");
      }
    }
  };

  // 初始化
  onMounted(() => {
    getInvestorData(filterForm);
  });

  return {
    filterForm,
    loading,
    investorList,
    total,
    selectedRows,
    regionOptions,
    typeOptions,
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
    openDialog,
    handleDelete
  };
}