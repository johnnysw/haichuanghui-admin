import { reactive, ref, onMounted } from "vue";
import { getRegionList, getIndustryList, getFundingStageList } from "../../api";
import type { BaseOption, InvestorQueryParams } from "../../types/types";
import { INVESTOR_STATUS_OPTIONS } from "../../types/types";

export function useInvestorFilter() {
  const filterForm = reactive<InvestorQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    field: "", // 关注行业 ID
    stage: "", // 偏好阶段 ID
    region: "", // 地区 ID
    status: undefined // 状态
  });

  const formRef = ref();
  const regionOptions = ref<BaseOption[]>([]);
  const industryOptions = ref<BaseOption[]>([]);
  const stageOptions = ref<BaseOption[]>([]);

  // 状态选项
  const statusOptions = INVESTOR_STATUS_OPTIONS;

  // 获取地区选项
  const fetchRegionOptions = async () => {
    try {
      const result = await getRegionList();
      if (result.code === 200) {
        regionOptions.value = result.data;
      }
    } catch (error) {
      console.error("获取地区失败:", error);
    }
  };

  // 获取行业选项
  const fetchIndustryOptions = async () => {
    try {
      const result = await getIndustryList();
      if (result.code === 200) {
        industryOptions.value = result.data;
      }
    } catch (error) {
      console.error("获取行业失败:", error);
    }
  };

  // 获取融资阶段选项
  const fetchStageOptions = async () => {
    try {
      const result = await getFundingStageList();
      if (result.code === 200) {
        stageOptions.value = result.data;
      }
    } catch (error) {
      console.error("获取融资阶段失败:", error);
    }
  };

  // 获取所有选项数据
  const fetchOptions = async () => {
    await Promise.all([
      fetchRegionOptions(),
      fetchIndustryOptions(),
      fetchStageOptions()
    ]);
  };

  // 组件挂载时获取选项数据
  onMounted(() => {
    fetchOptions();
  });

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
  };

  return {
    filterForm,
    formRef,
    regionOptions,
    industryOptions,
    stageOptions,
    statusOptions,
    resetForm,
    fetchOptions
  };
}
