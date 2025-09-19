// 项目表格相关逻辑

import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getProjectList, deleteProject } from "../api";
import { 
  INDUSTRY_OPTIONS, 
  STAGE_OPTIONS, 
  FUNDING_STAGE_OPTIONS, 
  PROJECT_STATUS_OPTIONS 
} from "../types/types";
import type { ProjectItem, ProjectListParams } from "../types/types";
import type { PaginationProps } from "@pureadmin/table";

export function useProjectTable() {
  const loading = ref(false);
  const dataList = ref<ProjectItem[]>([]);
  
  // 搜索表单
  const searchForm = reactive<Omit<ProjectListParams, 'page' | 'pageSize'>>({
    name: "",
    industry: "",
    stage: "",
    fundingStage: "",
    location: "",
    status: "",
    isRecommended: "",
    isFeatured: ""
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
      label: "项目LOGO",
      prop: "logo",
      width: 100,
      slot: "logo"
    },
    {
      label: "项目名称",
      prop: "name",
      minWidth: 180,
      showOverflowTooltip: true
    },
    {
      label: "行业分类",
      prop: "industry",
      width: 120,
      slot: "industry"
    },
    {
      label: "项目阶段",
      prop: "stage",
      width: 100,
      slot: "stage"
    },
    {
      label: "融资轮次",
      prop: "fundingStage",
      width: 100,
      slot: "fundingStage"
    },
    {
      label: "创始人",
      prop: "founder",
      width: 100
    },
    {
      label: "团队规模",
      prop: "teamSize",
      width: 100,
      formatter: (row: ProjectItem) => `${row.teamSize}人`
    },
    {
      label: "项目地区",
      prop: "location",
      width: 120,
      showOverflowTooltip: true
    },
    {
      label: "融资需求",
      prop: "fundingNeeds",
      width: 120,
      slot: "fundingNeeds"
    },
    {
      label: "浏览量",
      prop: "viewCount",
      width: 80
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
      label: "精选",
      prop: "isFeatured",
      width: 80,
      slot: "isFeatured"
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
      const params: ProjectListParams = {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        ...searchForm
      };
      
      const { data } = await getProjectList(params);
      dataList.value = data.list;
      pagination.total = data.total;
    } catch (error) {
      console.error("获取项目数据失败:", error);
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

  // 删除项目
  const handleDelete = async (row: ProjectItem) => {
    try {
      await ElMessageBox.confirm(
        `确认删除项目"${row.name}"吗？`,
        "删除确认",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      await deleteProject(row.id);
      ElMessage.success("删除成功");
      getData();
    } catch (error) {
      if (error !== "cancel") {
        console.error("删除失败:", error);
        ElMessage.error("删除失败");
      }
    }
  };

  // 获取行业标签
  const getIndustryLabel = (industry: string) => {
    const option = INDUSTRY_OPTIONS.find(item => item.value === industry);
    return option ? option.label : industry;
  };

  // 获取阶段标签
  const getStageLabel = (stage: string) => {
    const option = STAGE_OPTIONS.find(item => item.value === stage);
    return option ? option.label : stage;
  };

  // 获取融资轮次标签
  const getFundingStageLabel = (fundingStage: string) => {
    const option = FUNDING_STAGE_OPTIONS.find(item => item.value === fundingStage);
    return option ? option.label : fundingStage;
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

  // 获取行业标签类型
  const getIndustryTagType = (industry: string) => {
    const typeMap = {
      ai: "primary",
      bigdata: "success",
      cloud: "info",
      iot: "warning",
      blockchain: "danger",
      energy: "success",
      biotech: "primary",
      materials: "info",
      manufacturing: "warning",
      ecommerce: "",
      fintech: "primary",
      edtech: "success",
      media: "warning",
      social: "info",
      gaming: "danger",
      enterprise: "primary",
      consumer: "success",
      other: "info"
    };
    return typeMap[industry] || "info";
  };

  // 获取阶段标签类型
  const getStageTagType = (stage: string) => {
    const typeMap = {
      idea: "info",
      startup: "primary",
      growth: "success",
      mature: "warning"
    };
    return typeMap[stage] || "info";
  };

  // 获取融资轮次标签类型
  const getFundingStageTagType = (fundingStage: string) => {
    const typeMap = {
      seed: "info",
      angel: "primary",
      pre_a: "primary",
      a: "success",
      b: "success", 
      c: "warning",
      later: "warning",
      ipo: "danger",
      none: "info"
    };
    return typeMap[fundingStage] || "info";
  };

  // 格式化金额
  const formatAmount = (amount: number) => {
    if (amount >= 10000) {
      return `${(amount / 10000).toFixed(1)}亿`;
    } else {
      return `${amount}万`;
    }
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
    industryOptions: INDUSTRY_OPTIONS,
    stageOptions: STAGE_OPTIONS,
    fundingStageOptions: FUNDING_STAGE_OPTIONS,
    statusOptions: PROJECT_STATUS_OPTIONS,
    getData,
    handleSearch,
    handleReset,
    handleSizeChange,
    handleCurrentChange,
    handleDelete,
    getIndustryLabel,
    getStageLabel,
    getFundingStageLabel,
    getStatusInfo,
    getIndustryTagType,
    getStageTagType,
    getFundingStageTagType,
    formatAmount,
    formatDateTime
  };
}