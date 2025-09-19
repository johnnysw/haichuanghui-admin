<template>
  <el-drawer
    v-model="visible"
    :title="title"
    direction="rtl"
    size="900px"
    :before-close="handleClose"
  >
    <template #default>
      <InvestorFormComponent
        ref="formRef"
        v-model="formData"
      />
    </template>
    
    <template #footer>
      <div style="flex: auto">
        <el-button @click="handleClose">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import type { InvestorInfo, InvestorForm } from "../types/types";
import { createInvestor, updateInvestor } from "../api";
import InvestorFormComponent from "./InvestorForm.vue";

interface Props {
  modelValue: boolean;
  title: string;
  investor?: InvestorInfo | null;
  isEdit?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "success"): void;
}

const props = withDefaults(defineProps<Props>(), {
  investor: null,
  isEdit: false
});

const emit = defineEmits<Emits>();

const formRef = ref();
const loading = ref(false);
const formData = ref<InvestorForm>({
  userId: 0,
  investmentInstitution: "",
  verified: false,
  status: 1,
  isFeatured: false
});

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value)
});

// 监听投资人数据变化
watch(
  () => props.investor,
  (newValue) => {
    if (newValue) {
      formData.value = {
        id: newValue.id,
        userId: newValue.userId,
        investmentInstitution: newValue.investmentInstitution,
        regionId: newValue.regionId,
        investorTypeId: newValue.investorTypeId,
        location: newValue.location,
        investmentAmountMin: newValue.investmentAmountMin,
        investmentAmountMax: newValue.investmentAmountMax,
        description: newValue.description,
        investmentPreference: newValue.investmentPreference,
        institutionInfo: newValue.institutionInfo,
        bio: newValue.bio,
        verified: newValue.verified,
        status: newValue.status,
        isFeatured: newValue.isFeatured,
        focusIndustries: newValue.focusIndustries?.map(item => item.id) || [],
        preferredStages: newValue.preferredStages?.map(item => item.id) || [],
        preferredRegions: newValue.preferredRegions?.map(item => item.id) || []
      };
    } else {
      // 重置表单数据
      formData.value = {
        userId: 0,
        investmentInstitution: "",
        regionId: undefined,
        investorTypeId: undefined,
        location: "",
        investmentAmountMin: undefined,
        investmentAmountMax: undefined,
        description: "",
        investmentPreference: "",
        institutionInfo: "",
        bio: "",
        verified: false,
        status: 1,
        isFeatured: false,
        focusIndustries: [],
        preferredStages: [],
        preferredRegions: []
      };
    }
  },
  { immediate: true }
);

// 处理关闭
const handleClose = () => {
  visible.value = false;
  formRef.value?.resetFields();
};

// 处理提交
const handleSubmit = async () => {
  // 表单验证
  const isValid = await formRef.value?.validate();
  if (!isValid) return;

  loading.value = true;
  try {
    let response;
    
    if (props.isEdit && formData.value.id) {
      // 更新投资人
      response = await updateInvestor(formData.value.id, formData.value);
    } else {
      // 创建投资人
      response = await createInvestor(formData.value);
    }

    if (response.success) {
      ElMessage.success(response.message);
      emit("success");
      handleClose();
    } else {
      ElMessage.error(response.message || "操作失败");
    }
  } catch (error) {
    console.error("提交失败:", error);
    ElMessage.error("操作失败");
  } finally {
    loading.value = false;
  }
};
</script>