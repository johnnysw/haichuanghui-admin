<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { getIndustryList, getRegionList, getFundingStageList } from "../api";
import type { FormItemProps, BaseOption } from "../types/types";

interface Props {
  formInline: FormItemProps;
}

const props = withDefaults(defineProps<Props>(), {
  formInline: () => ({
    id: undefined,
    name: "",
    companyName: "",
    shortDescription: "",
    fullDescription: "",
    description: "",
    industryId: null,
    regionId: null,
    location: "",
    fundingStageId: null,
    fundingAmount: "",
    valuation: "",
    fundingNeeds: "",
    introduction: "",
    coreTechnology: "",
    businessModel: "",
    teamInfo: "",
    fundingHistory: "",
    developmentPlan: "",
    marketAnalysis: "",
    competitiveAdvantage: "",
    foundingDate: "",
    status: 0,
    isRecommended: false,
    logoUrl: "",
    images: [],
    businessPlanUrl: "",
    contactEmail: "",
    contactPhone: "",
    websiteUrl: "",
    socialMedia: ""
  })
});

const ruleFormRef = ref<FormInstance>();
const newFormInline = ref(props.formInline);

// 选项数据
const industryOptions = ref<BaseOption[]>([]);
const regionOptions = ref<BaseOption[]>([]);
const fundingStageOptions = ref<BaseOption[]>([]);

// 表单验证规则
const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
  companyName: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
  industryId: [{ required: true, message: "请选择行业领域", trigger: "change" }],
  regionId: [{ required: true, message: "请选择地区", trigger: "change" }],
  fundingStageId: [{ required: true, message: "请选择融资阶段", trigger: "change" }],
  contactEmail: [
    { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
  ],
  websiteUrl: [
    { type: "url", message: "请输入正确的网站地址", trigger: "blur" }
  ]
});

// 获取选项数据
const fetchOptions = async () => {
  try {
    const [industryResult, regionResult, fundingStageResult] = await Promise.all([
      getIndustryList(),
      getRegionList(),
      getFundingStageList()
    ]);

    if (industryResult.code === 200) {
      industryOptions.value = industryResult.data;
    }
    if (regionResult.code === 200) {
      regionOptions.value = regionResult.data;
    }
    if (fundingStageResult.code === 200) {
      fundingStageOptions.value = fundingStageResult.data;
    }
  } catch (error) {
    console.error("获取选项数据失败:", error);
    ElMessage.error("获取选项数据失败");
  }
};

onMounted(() => {
  fetchOptions();
});

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="rules"
    label-width="100px"
    label-position="right"
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="项目名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入项目名称"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="企业名称" prop="companyName">
          <el-input
            v-model="newFormInline.companyName"
            clearable
            placeholder="请输入企业名称"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="行业领域" prop="industryId">
          <el-select
            v-model="newFormInline.industryId"
            placeholder="请选择行业领域"
            clearable
            class="w-full"
          >
            <el-option
              v-for="industry in industryOptions"
              :key="industry.id"
              :label="industry.name"
              :value="industry.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="地区" prop="regionId">
          <el-select
            v-model="newFormInline.regionId"
            placeholder="请选择地区"
            clearable
            class="w-full"
          >
            <el-option
              v-for="region in regionOptions"
              :key="region.id"
              :label="region.name"
              :value="region.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="融资阶段" prop="fundingStageId">
          <el-select
            v-model="newFormInline.fundingStageId"
            placeholder="请选择融资阶段"
            clearable
            class="w-full"
          >
            <el-option
              v-for="stage in fundingStageOptions"
              :key="stage.id"
              :label="stage.name"
              :value="stage.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="具体位置" prop="location">
          <el-input
            v-model="newFormInline.location"
            clearable
            placeholder="请输入具体位置"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="newFormInline.status"
            placeholder="请选择状态"
            class="w-full"
          >
            <el-option label="草稿" :value="0" />
            <el-option label="已发布" :value="1" />
            <el-option label="审核中" :value="2" />
            <el-option label="已拒绝" :value="3" />
            <el-option label="已归档" :value="4" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="融资金额" prop="fundingAmount">
          <el-input
            v-model="newFormInline.fundingAmount"
            clearable
            placeholder="请输入融资金额"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="估值" prop="valuation">
          <el-input
            v-model="newFormInline.valuation"
            clearable
            placeholder="请输入估值"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="项目简介" prop="shortDescription">
      <el-input
        v-model="newFormInline.shortDescription"
        type="textarea"
        :rows="3"
        placeholder="请输入项目简介（建议200字以内）"
        maxlength="500"
        show-word-limit
      />
    </el-form-item>

    <el-form-item label="项目描述" prop="description">
      <el-input
        v-model="newFormInline.description"
        type="textarea"
        :rows="4"
        placeholder="请输入详细的项目描述"
      />
    </el-form-item>

    <el-form-item>
      <el-checkbox v-model="newFormInline.isRecommended">
        推荐项目
      </el-checkbox>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss">
:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-textarea__inner) {
  resize: vertical;
}
</style>