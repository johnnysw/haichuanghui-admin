import { ref, reactive, onMounted } from "vue";
import type { InvestorQueryParams, BaseOption } from "../types/types";
import { getRegionList, getIndustryList, getFundingStageList, getInvestorTypeList } from "../api";

export function useInvestorFilter() {
  const loading = ref(false);
  
  // 筛选表单
  const filterForm = reactive<InvestorQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    field: "",
    stage: "",
    region: "",
    type: "",
    status: undefined
  });

  // 选项数据
  const regionOptions = ref<BaseOption[]>([]);
  const industryOptions = ref<BaseOption[]>([]);
  const stageOptions = ref<BaseOption[]>([]);
  const typeOptions = ref<BaseOption[]>([]);
  
  // 状态选项
  const statusOptions: BaseOption[] = [
    { label: "全部状态", value: "" },
    { label: "正常", value: 1 },
    { label: "审核中", value: 2 },
    { label: "已拒绝", value: 3 },
    { label: "禁用", value: 0 }
  ];

  // 认证状态选项
  const verifiedOptions: BaseOption[] = [
    { label: "全部认证", value: "" },
    { label: "已认证", value: "1" },
    { label: "未认证", value: "0" }
  ];

  // 获取选项数据
  const fetchOptions = async () => {
    loading.value = true;
    try {
      const [regionRes, industryRes, stageRes, typeRes] = await Promise.all([
        getRegionList(),
        getIndustryList(), 
        getFundingStageList(),
        getInvestorTypeList()
      ]);

      if (regionRes.success) regionOptions.value = regionRes.data;
      if (industryRes.success) industryOptions.value = industryRes.data;
      if (stageRes.success) stageOptions.value = stageRes.data;
      if (typeRes.success) typeOptions.value = typeRes.data;
    } catch (error) {
      console.error("获取选项数据失败:", error);
    } finally {
      loading.value = false;
    }
  };

  // 重置筛选条件
  const resetFilter = () => {
    Object.assign(filterForm, {
      page: 1,
      limit: 10,
      search: "",
      field: "",
      stage: "",
      region: "",
      type: "",
      status: undefined
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

  onMounted(() => {
    fetchOptions();
  });

  return {
    loading,
    filterForm,
    regionOptions,
    industryOptions,
    stageOptions,
    typeOptions,
    statusOptions,
    verifiedOptions,
    resetFilter,
    handleSearch,
    handleFilterChange
  };
}