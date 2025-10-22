import { message } from "@/utils/message";
import { ElMessageBox, ElTag } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, onMounted, reactive, h } from "vue";
import { useDateFormat } from "@vueuse/core";
import type { PaginationProps } from "@pureadmin/table";
import type { TableColumns } from "@pureadmin/table";
import { getProjectList, toggleProjectRecommendation, getProjectStats } from "../api";
import { useProjectFilter } from "./useProjectFilter";
import { useProjectActions } from "./useProjectActions";
import type { ProjectInfo, ProjectQueryParams } from "../types/types";
import { PROJECT_STATUS_MAP } from "../types/types";
import type { ProjectStatus } from "../types/types";

import Delete from "@iconify-icons/ep/delete";
import View from "@iconify-icons/ep/view";
import Star from "@iconify-icons/ep/star";
import StarFilled from "@iconify-icons/ep/star-filled";

export function useProjectTable() {
  const {
    form,
    formRef,
    industryOptions,
    regionOptions,
    fundingStageOptions,
    statusOptions,
    recommendationOptions,
    resetForm
  } = useProjectFilter();

  const { openDetail, handleDelete: handleDeleteAction } =
    useProjectActions(getProjectData);

  const dataList = ref<ProjectInfo[]>([]);
  const loading = ref(true);
  const isShow = ref(false);
  const selectedNum = ref(0);

  // 统计数据
  const stats = reactive({
    viewCount: 0,
    favoriteCount: 0
  });

  // 分页配置
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  // 表格列配置
  const columns: TableColumnList = [
    {
      type: "selection",
      width: 55,
      align: "left"
    },
    {
      label: "项目名称",
      prop: "name",
      minWidth: 150
    },
    {
      label: "企业名称",
      prop: "companyName",
      minWidth: 150
    },
    {
      label: "行业领域",
      prop: "industry",
      minWidth: 120,
      cellRenderer: ({ row }) => row.industry?.name || "-"
    },
    {
      label: "地区",
      prop: "region",
      minWidth: 100,
      cellRenderer: ({ row }) => row.region?.name || "-"
    },
    {
      label: "融资阶段",
      prop: "fundingStage",
      minWidth: 120,
      cellRenderer: ({ row }) => row.fundingStage?.name || "-"
    },
    {
      label: "融资金额",
      prop: "fundingAmount",
      minWidth: 120,
      cellRenderer: ({ row }) => row.fundingAmount || "-"
    },
    {
      label: "是否推荐",
      prop: "isRecommended",
      minWidth: 100,
      cellRenderer: ({ row }) => {
        return h(
          ElTag,
          {
            type: row.isRecommended ? "warning" : "info",
            effect: "light",
            size: "small"
          },
          {
            default: () => (row.isRecommended ? "已推荐" : "未推荐")
          }
        );
      }
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row }) => {
        const statusInfo = PROJECT_STATUS_MAP[row.status as ProjectStatus];
        if (!statusInfo) return "未知";

        return h(
          ElTag,
          {
            type: statusInfo.type,
            effect: "light",
            size: "small"
          },
          {
            default: () => statusInfo.text
          }
        );
      }
    },
    {
      label: "浏览量",
      prop: "viewCount",
      minWidth: 100,
      sortable: true,
      cellRenderer: ({ row }) => row.viewCount?.toLocaleString() || "0"
    },
    {
      label: "收藏数",
      prop: "favoriteCount",
      minWidth: 100,
      sortable: true,
      cellRenderer: ({ row }) => row.favoriteCount?.toLocaleString() || "0"
    },
    {
      label: "创建时间",
      prop: "createdAt",
      minWidth: 120,
      cellRenderer: ({ row }) => {
        if (!row.createdAt) return "-";
        const date = new Date(row.createdAt);
        if (Number.isNaN(date.getTime())) return "-";
        return useDateFormat(date, "YYYY-MM-DD").value;
      }
    },
    {
      label: "操作",
      fixed: "right",
      width: 240,
      slot: "operation"
    }
  ];

  // 获取项目列表
  // 刷新统计数据
  async function refreshStats() {
    try {
      const result = await getProjectStats();
      if (result.code === 200) {
        stats.viewCount = result.data.totalViewCount ?? 0;
        stats.favoriteCount = result.data.totalFavoriteCount ?? 0;
      }
    } catch (error) {
      console.error("获取项目统计信息失败:", error);
    }
  }

  async function getProjectData() {
    loading.value = true;
    try {
      const params: ProjectQueryParams = {
        pageNum: pagination.currentPage,
        pageSize: pagination.pageSize,
        name: form.name || undefined,
        companyName: form.companyName || undefined,
        industryId: form.industryId || undefined,
        regionId: form.regionId || undefined,
        fundingStageId: form.fundingStageId || undefined,
        status: form.status || undefined,
        isRecommended:
          form.isRecommended === "" ? undefined : form.isRecommended
      };

      const result = await getProjectList(params);
      if (result.code === 200) {
        dataList.value = result.data.list;
        pagination.total = result.data.total;
      } else {
        message("获取项目列表失败: " + result.message, { type: "error" });
      }

      // 刷新统计数据
      await refreshStats();
    } catch (error) {
      console.error("获取项目列表失败:", error);
      message("获取项目列表失败", { type: "error" });
    } finally {
      loading.value = false;
    }
  }

  // 搜索
  const onSearch = () => {
    pagination.currentPage = 1;
    getProjectData();
  };

  // 重置搜索表单
  const resetSearchForm = formEl => {
    resetForm(formEl);
    onSearch();
  };

  // 分页大小改变
  const handleSizeChange = (val: number) => {
    pagination.pageSize = val;
    getProjectData();
  };

  // 当前页改变
  const handleCurrentChange = (val: number) => {
    pagination.currentPage = val;
    getProjectData();
  };

  // 选择改变
  const handleSelectionChange = (val: ProjectInfo[]) => {
    selectedNum.value = val.length;
  };

  // 切换推荐状态
  const handleToggleRecommend = async (row: ProjectInfo) => {
    const newRecommended = !row.isRecommended;
    const action = newRecommended ? "推荐" : "取消推荐";

    try {
      await ElMessageBox.confirm(
        `确认要${action}项目"${row.name}"吗？`,
        "确认操作",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      const response = await toggleProjectRecommendation(
        row.id,
        newRecommended
      );
      if (response.code === 200) {
        row.isRecommended = newRecommended;
        message(`${action}成功`, { type: "success" });
      } else {
        message(`${action}失败: ${response.message}`, { type: "error" });
      }
    } catch (error) {
      if (error !== "cancel") {
        message(`${action}失败`, { type: "error" });
      }
    }
  };

  // 表格行样式 - 移除行着色，使用状态tag颜色标识
  const rowStyle = () => {
    return {};
  };

  // 直接使用actions中的函数，因为已经包含了刷新回调
  const handleDelete = handleDeleteAction;

  // 组件挂载时获取数据
  onMounted(() => {
    getProjectData();
  });

  return {
    form,
    formRef,
    isShow,
    loading,
    columns,
    dataList,
    pagination,
    selectedNum,
    stats,
    industryOptions,
    regionOptions,
    fundingStageOptions,
    statusOptions,
    recommendationOptions,
    onSearch,
    resetForm: resetSearchForm,
    openDetail,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleToggleRecommend,
    rowStyle,
    getProjectData // 导出刷新函数
  };
}
