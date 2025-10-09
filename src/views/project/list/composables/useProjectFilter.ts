import { reactive, ref, onMounted } from "vue";
import { getIndustryList, getRegionList, getFundingStageList } from "../api";
import type { BaseOption } from "../types/types";
import { PROJECT_STATUS_MAP } from "../types/types";
import type { ProjectStatus } from "../types/types";

export function useProjectFilter() {
  const form = reactive({
    name: "",
    companyName: "",
    industryId: "",
    regionId: "",
    fundingStageId: "",
    status: "" as ProjectStatus | "",
    isRecommended: ""
  });

  const formRef = ref();
  const industryOptions = ref<BaseOption[]>([]);
  const regionOptions = ref<BaseOption[]>([]);
  const fundingStageOptions = ref<BaseOption[]>([]);

  // 状态选项（静态枚举）
  const statusOptions = [
    { value: "draft" as ProjectStatus, label: PROJECT_STATUS_MAP.draft.text },
    {
      value: "approved" as ProjectStatus,
      label: PROJECT_STATUS_MAP.approved.text
    },
    {
      value: "pending_review" as ProjectStatus,
      label: PROJECT_STATUS_MAP.pending_review.text
    },
    {
      value: "rejected" as ProjectStatus,
      label: PROJECT_STATUS_MAP.rejected.text
    }
  ];

  // 推荐状态选项
  const recommendationOptions = [
    { value: "", label: "全部" },
    { value: "true", label: "已推荐" },
    { value: "false", label: "未推荐" }
  ];

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

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
  };

  return {
    form,
    formRef,
    industryOptions,
    regionOptions,
    fundingStageOptions,
    statusOptions,
    recommendationOptions,
    resetForm
  };
}
