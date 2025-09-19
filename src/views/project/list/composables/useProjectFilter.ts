import { reactive, ref, onMounted } from "vue";
import { getIndustryList, getRegionList, getFundingStageList } from "../api";
import type { BaseOption } from "../types/types";

export function useProjectFilter() {
  const form = reactive({
    name: "",
    companyName: "",
    industryId: "",
    regionId: "",
    fundingStageId: "",
    status: "",
    isRecommended: ""
  });

  const formRef = ref();
  const industryOptions = ref<BaseOption[]>([]);
  const regionOptions = ref<BaseOption[]>([]);
  const fundingStageOptions = ref<BaseOption[]>([]);

  // 获取行业领域选项
  const fetchIndustryOptions = async () => {
    try {
      const result = await getIndustryList();
      if (result.code === 200) {
        industryOptions.value = result.data.map(item => ({
          id: item.id,
          name: item.name
        }));
      }
    } catch (error) {
      console.error("获取行业领域失败:", error);
    }
  };

  // 获取地区选项
  const fetchRegionOptions = async () => {
    try {
      const result = await getRegionList();
      if (result.code === 200) {
        regionOptions.value = result.data.map(item => ({
          id: item.id,
          name: item.name
        }));
      }
    } catch (error) {
      console.error("获取地区失败:", error);
    }
  };

  // 获取融资阶段选项
  const fetchFundingStageOptions = async () => {
    try {
      const result = await getFundingStageList();
      if (result.code === 200) {
        fundingStageOptions.value = result.data.map(item => ({
          id: item.id,
          name: item.name
        }));
      }
    } catch (error) {
      console.error("获取融资阶段失败:", error);
    }
  };

  // 组件挂载时获取选项数据
  onMounted(() => {
    fetchIndustryOptions();
    fetchRegionOptions();
    fetchFundingStageOptions();
  });

  const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
  };

  return {
    form,
    formRef,
    industryOptions,
    regionOptions,
    fundingStageOptions,
    resetForm
  };
}