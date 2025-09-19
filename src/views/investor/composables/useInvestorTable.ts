// 投资人表格相关逻辑

import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getInvestorList, deleteInvestor } from "../api";
import { 
  FOCUS_INDUSTRIES, 
  PREFERRED_STAGES, 
  INVESTOR_STATUS_OPTIONS 
} from "../types/types";
import type { InvestorItem, InvestorListParams } from "../types/types";
import type { PaginationProps } from "@pureadmin/table";

export function useInvestorTable() {
  const loading = ref(false);
  const dataList = ref<InvestorItem[]>([]);
  
  // 搜索表单
  const searchForm = reactive<Omit<InvestorListParams, 'page' | 'pageSize'>>({
    name: "",
    institution: "",
    location: "",
    focusIndustry: "",
    preferredStage: "",
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
      label: "头像",
      prop: "avatar",
      width: 80,
      slot: "avatar"
    },
    {
      label: "姓名",
      prop: "name",
      width: 100
    },
    {
      label: "所属机构",
      prop: "institution",
      minWidth: 150,
      showOverflowTooltip: true
    },
    {
      label: "职位",
      prop: "position",
      width: 120
    },
    {
      label: "地区",
      prop: "location",
      width: 120,
      showOverflowTooltip: true
    },
    {
      label: "投资范围",
      prop: "investmentRange",
      width: 120
    },
    {
      label: "关注行业",
      prop: "focusIndustries",
      width: 150,
      slot: "focusIndustries"
    },
    {
      label: "偏好阶段",
      prop: "preferredStages",
      width: 130,
      slot: "preferredStages"
    },
    {
      label: "投资项目",
      prop: "investmentCount",
      width: 100,
      formatter: (row: InvestorItem) => `${row.investmentCount}个`
    },
    {
      label: "认证状态",
      prop: "verified",
      width: 100,
      slot: "verified"
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
      const params: InvestorListParams = {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        ...searchForm
      };
      
      const { data } = await getInvestorList(params);
      dataList.value = data.list;
      pagination.total = data.total;
    } catch (error) {
      console.error("获取投资人数据失败:", error);
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

  // 删除投资人
  const handleDelete = async (row: InvestorItem) => {
    try {
      await ElMessageBox.confirm(
        `确认删除投资人"${row.name}"吗？`,
        "删除确认",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      await deleteInvestor(row.id);
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
    const option = FOCUS_INDUSTRIES.find(item => item.value === industry);
    return option ? option.label : industry;
  };

  // 获取阶段标签
  const getStageLabel = (stage: string) => {
    const option = PREFERRED_STAGES.find(item => item.value === stage);
    return option ? option.label : stage;
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
      consumer: "success",
      enterprise: "primary",
      other: "info"
    };
    return typeMap[industry] || "info";
  };

  // 获取阶段标签类型
  const getStageTagType = (stage: string) => {
    const typeMap = {
      seed: "info",
      angel: "primary",
      pre_a: "primary",
      a: "success",
      b: "success", 
      c: "warning",
      later: "warning",
      ipo: "danger"
    };
    return typeMap[stage] || "info";
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
    industryOptions: FOCUS_INDUSTRIES,
    stageOptions: PREFERRED_STAGES,
    statusOptions: INVESTOR_STATUS_OPTIONS,
    getData,
    handleSearch,
    handleReset,
    handleSizeChange,
    handleCurrentChange,
    handleDelete,
    getIndustryLabel,
    getStageLabel,
    getStatusInfo,
    getIndustryTagType,
    getStageTagType,
    formatDateTime
  };
}