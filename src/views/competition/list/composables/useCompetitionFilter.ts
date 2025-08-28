import { reactive, ref, onMounted } from "vue";
import { getIndustryList, getRegionList } from "../api";
import type { Competition } from "@/types/competition";

export function useCompetitionFilter() {
  const form = reactive({
    title: "",
    industryId: "",
    regionId: "",
    status: ""
  });
  const formRef = ref();
  const industryOptions = ref<Array<{ id: number; name: string }>>([]);
  const regionOptions = ref<Array<{ id: number; name: string }>>([]);

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

  // 组件挂载时获取选项数据
  onMounted(() => {
    fetchIndustryOptions();
    fetchRegionOptions();
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
    resetForm
  };
}