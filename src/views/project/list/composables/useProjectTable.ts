import dayjs from "dayjs";
import { message } from "@/utils/message";
import { ElMessageBox, ElTag } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref, onMounted, reactive, h } from "vue";
import { PaginationProps } from "@pureadmin/table";
import type { TableColumns } from "@pureadmin/table";
import { getProjectList, reviewProject, toggleProjectRecommendation } from "../api";
import { useProjectFilter } from "./useProjectFilter";
import { useProjectActions } from "./useProjectActions";
import type { ProjectInfo, ProjectQueryParams } from "../types/types";
import { PROJECT_STATUS_MAP, ProjectStatus } from "../types/types";

import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import View from "@iconify-icons/ep/view";
import Star from "@iconify-icons/ep/star";
import StarFilled from "@iconify-icons/ep/star-filled";
import Check from "@iconify-icons/ep/check";
import Close from "@iconify-icons/ep/close";

export function useProjectTable() {
  const {
    form,
    formRef,
    industryOptions,
    regionOptions,
    fundingStageOptions,
    resetForm
  } = useProjectFilter();

  const {
    openDetail,
    handleDelete: handleDeleteAction,
    openDialog: openDialogAction
  } = useProjectActions(getProjectData);

  const dataList = ref<ProjectInfo[]>([]);
  const loading = ref(true);
  const isShow = ref(false);
  const selectedNum = ref(0);

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
      label: "序号",
      type: "index",
      width: 70
    },
    {
      label: "项目名称",
      prop: "name",
      minWidth: 150,
      cellRenderer: ({ row }) => h(
        "el-link",
        {
          class: "link-primary",
          underline: false,
          type: "primary",
          onClick: () => openDetail(row)
        },
        row.name
      )
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
      cellRenderer: ({ row }) => row.viewCount?.toLocaleString() || "0"
    },
    {
      label: "创建时间",
      prop: "createdTime",
      minWidth: 180,
      formatter: ({ createdTime }) =>
        dayjs(createdTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 280,
      slot: "operation"
    }
  ];

  // 获取项目列表
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
        isRecommended: form.isRecommended === "" ? undefined : form.isRecommended
      };

      const result = await getProjectList(params);
      if (result.code === 200) {
        dataList.value = result.data.list;
        pagination.total = result.data.total;
      } else {
        message("获取项目列表失败: " + result.message, { type: "error" });
      }
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
  const resetSearchForm = (formEl) => {
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

      const response = await toggleProjectRecommendation(row.id, newRecommended);
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

  // 审核项目
  const handleReview = async (row: ProjectInfo, status: number) => {
    let reviewComment = "";
    
    if (status === ProjectStatus.REJECTED) {
      try {
        const { value } = await ElMessageBox.prompt(
          "请输入拒绝原因：",
          "拒绝项目",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputPattern: /^.{1,200}$/,
            inputErrorMessage: "拒绝原因长度应在1-200个字符之间"
          }
        );
        reviewComment = value;
      } catch {
        return;
      }
    }

    try {
      const result = await reviewProject(row.id, status, reviewComment);
      if (result.code === 200) {
        row.status = status;
        if (reviewComment) {
          row.reviewComment = reviewComment;
        }
        message("审核成功", { type: "success" });
      } else {
        message("审核失败: " + result.message, { type: "error" });
      }
    } catch (error) {
      message("审核失败", { type: "error" });
    }
  };

  // 表格行样式 - 移除行着色，使用状态tag颜色标识
  const rowStyle = () => {
    return {};
  };

  // 直接使用actions中的函数，因为已经包含了刷新回调
  const handleDelete = handleDeleteAction;
  const openDialog = openDialogAction;

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
    industryOptions,
    regionOptions,
    fundingStageOptions,
    onSearch,
    resetForm: resetSearchForm,
    openDialog,
    openDetail,
    handleDelete,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange,
    handleToggleRecommend,
    handleReview,
    rowStyle,
    getProjectData // 导出刷新函数
  };
}