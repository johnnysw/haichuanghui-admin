<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-width="120px"
    label-position="left"
  >
    <!-- 基本信息 -->
    <el-divider content-position="left">
      <el-icon><User /></el-icon> 基本信息
    </el-divider>
    
    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item label="关联用户ID" prop="userId">
          <el-input-number
            v-model="form.userId"
            :min="1"
            placeholder="请输入关联用户ID"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="真实姓名" prop="realName">
          <el-input
            v-model="form.realName"
            placeholder="请输入真实姓名"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="请输入手机号码"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item label="邮箱地址" prop="email">
          <el-input
            v-model="form.email"
            placeholder="请输入邮箱地址"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="投资机构" prop="investmentInstitution">
          <el-input
            v-model="form.investmentInstitution"
            placeholder="请输入投资机构名称"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="职位" prop="position">
          <el-select
            v-model="form.position"
            placeholder="请选择职位"
            style="width: 100%"
            clearable
          >
            <el-option label="合伙人" value="partner" />
            <el-option label="投资总监" value="director" />
            <el-option label="投资经理" value="manager" />
            <el-option label="投资分析师" value="analyst" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item label="地区" prop="regionId">
          <el-select
            v-model="form.regionId"
            placeholder="请选择地区"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="option in regionOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="投资人类型" prop="investorTypeId">
          <el-select
            v-model="form.investorTypeId"
            placeholder="请选择投资人类型"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="option in typeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <!-- 占位 -->
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item label="最小投资额" prop="investmentAmountMin">
          <el-input-number
            v-model="form.investmentAmountMin"
            :min="0"
            :precision="2"
            placeholder="万元"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="最大投资额" prop="investmentAmountMax">
          <el-input-number
            v-model="form.investmentAmountMax"
            :min="0"
            :precision="2"
            placeholder="万元"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 投资偏好 -->
    <el-divider content-position="left">
      <el-icon><TrendCharts /></el-icon> 投资偏好
    </el-divider>
    
    <el-form-item label="关注领域" prop="focusIndustries">
      <el-checkbox-group v-model="form.focusIndustries">
        <el-row :gutter="16">
          <el-col :span="4" v-for="option in industryFieldOptions" :key="option.value">
            <el-checkbox :value="option.value" :label="option.label" />
          </el-col>
        </el-row>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item label="投资阶段" prop="preferredStages">
      <el-checkbox-group v-model="form.preferredStages">
        <el-row :gutter="16">
          <el-col :span="4" v-for="option in investmentStageOptions" :key="option.value">
            <el-checkbox :value="option.value" :label="option.label" />
          </el-col>
        </el-row>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item label="投资偏好" prop="investmentPreference">
      <el-input
        v-model="form.investmentPreference"
        type="textarea"
        :rows="3"
        placeholder="请描述投资偏好"
      />
    </el-form-item>

    <el-form-item label="个人简介" prop="bio">
      <el-input
        v-model="form.bio"
        type="textarea"
        :rows="3"
        placeholder="请输入个人简介"
      />
    </el-form-item>

    <el-form-item label="机构信息" prop="institutionInfo">
      <el-input
        v-model="form.institutionInfo"
        type="textarea"
        :rows="3"
        placeholder="请输入机构信息"
      />
    </el-form-item>

    <!-- 认证文件 -->
    <el-divider content-position="left">
      <el-icon><Document /></el-icon> 认证文件
    </el-divider>

    <el-alert
      title="投资人认证需要提供以下文件：身份证明、机构证明、投资案例证明"
      type="info"
      :closable="false"
      show-icon
      style="margin-bottom: 20px"
    />

    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="身份证明">
          <el-upload
            class="upload-demo"
            :file-list="form.idDocuments"
            :auto-upload="false"
            multiple
            accept=".jpg,.jpeg,.png,.pdf"
            :on-change="(file: any, fileList: any) => handleFileChange('idDocuments', fileList)"
          >
            <el-button size="small" type="primary">
              <el-icon><Upload /></el-icon> 选择文件
            </el-button>
            <template #tip>
              <div class="el-upload__tip">
                jpg/png/pdf文件，大小不超过10MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="机构证明">
          <el-upload
            class="upload-demo"
            :file-list="form.institutionDocuments"
            :auto-upload="false"
            multiple
            accept=".jpg,.jpeg,.png,.pdf"
            :on-change="(file: any, fileList: any) => handleFileChange('institutionDocuments', fileList)"
          >
            <el-button size="small" type="primary">
              <el-icon><Upload /></el-icon> 选择文件
            </el-button>
            <template #tip>
              <div class="el-upload__tip">
                工作证明、营业执照等
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="投资证明">
          <el-upload
            class="upload-demo"
            :file-list="form.investmentDocuments"
            :auto-upload="false"
            multiple
            accept=".jpg,.jpeg,.png,.pdf"
            :on-change="(file: any, fileList: any) => handleFileChange('investmentDocuments', fileList)"
          >
            <el-button size="small" type="primary">
              <el-icon><Upload /></el-icon> 选择文件
            </el-button>
            <template #tip>
              <div class="el-upload__tip">
                投资案例、资产证明等
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-col>
    </el-row>

    <!-- 管理设置 -->
    <el-divider content-position="left">
      <el-icon><Setting /></el-icon> 管理设置
    </el-divider>

    <el-row :gutter="24">
      <el-col :span="8">
        <el-form-item label="认证状态">
          <el-switch
            v-model="form.verified"
            active-text="已认证"
            inactive-text="未认证"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="推荐状态">
          <el-switch
            v-model="form.isFeatured"
            active-text="推荐"
            inactive-text="普通"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="审核状态" prop="status">
          <el-select
            v-model="form.status"
            placeholder="请选择状态"
            style="width: 100%"
          >
            <el-option label="正常" :value="1" />
            <el-option label="审核中" :value="2" />
            <el-option label="已拒绝" :value="3" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item label="管理员备注" prop="adminNotes">
      <el-input
        v-model="form.adminNotes"
        type="textarea"
        :rows="3"
        placeholder="管理员可在此添加备注信息..."
        show-word-limit
        maxlength="500"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import type { InvestorForm, InvestorInfo, BaseOption } from "../types/types";
import { getRegionList, getIndustryList, getFundingStageList, getInvestorTypeList } from "../api";
import { User, TrendCharts, Document, Setting, Upload } from "@element-plus/icons-vue";

interface Props {
  modelValue?: InvestorInfo | null;
}

interface Emits {
  (e: "update:modelValue", value: InvestorForm): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formRef = ref<FormInstance>();

// 选项数据
const regionOptions = ref<BaseOption[]>([]);
const industryOptions = ref<BaseOption[]>([]);
const stageOptions = ref<BaseOption[]>([]);
const typeOptions = ref<BaseOption[]>([]);

// 投资领域选项（对应PC端注册表单）
const industryFieldOptions = ref([
  { value: "ai", label: "人工智能" },
  { value: "biotech", label: "生物医药" },
  { value: "fintech", label: "金融科技" },
  { value: "energy", label: "新能源" },
  { value: "enterprise", label: "企业服务" },
  { value: "consumer", label: "消费互联网" },
  { value: "education", label: "教育培训" },
  { value: "healthcare", label: "医疗健康" }
]);

// 投资阶段选项（对应PC端注册表单）
const investmentStageOptions = ref([
  { value: "seed", label: "种子轮" },
  { value: "angel", label: "天使轮" },
  { value: "preA", label: "Pre-A轮" },
  { value: "a", label: "A轮" },
  { value: "b", label: "B轮" },
  { value: "c", label: "C轮及以后" },
  { value: "preIPO", label: "Pre-IPO" }
]);

// 表单数据
const form = reactive<InvestorForm>({
  userId: 0,
  realName: "",
  phone: "",
  email: "",
  investmentInstitution: "",
  position: "",
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
  preferredRegions: [],
  idDocuments: [],
  institutionDocuments: [],
  investmentDocuments: [],
  adminNotes: ""
});

// 表单验证规则
const rules: FormRules = {
  userId: [
    { required: true, message: "请输入关联用户ID", trigger: "blur" },
    { type: "number", min: 1, message: "用户ID必须大于0", trigger: "blur" }
  ],
  realName: [
    { required: true, message: "请输入真实姓名", trigger: "blur" },
    { min: 2, max: 20, message: "姓名长度在2-20个字符", trigger: "blur" }
  ],
  phone: [
    { required: true, message: "请输入手机号码", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" }
  ],
  email: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }
  ],
  investmentInstitution: [
    { required: true, message: "请输入投资机构名称", trigger: "blur" },
    { min: 2, max: 100, message: "机构名称长度在2-100个字符", trigger: "blur" }
  ],
  position: [
    { required: true, message: "请选择职位", trigger: "change" }
  ],
  bio: [
    { required: true, message: "请输入个人简介", trigger: "blur" },
    { min: 50, max: 500, message: "个人简介长度在50-500个字符", trigger: "blur" }
  ],
  status: [
    { required: true, message: "请选择状态", trigger: "change" }
  ]
};

// 获取选项数据
const fetchOptions = async () => {
  try {
    const [regionRes, industryRes, stageRes, typeRes] = await Promise.all([
      getRegionList(),
      getIndustryList(),
      getFundingStageList(),
      getInvestorTypeList()
    ]);

    if (regionRes.success) {
      regionOptions.value = regionRes.data.filter(item => item.value !== "");
    }
    if (industryRes.success) {
      industryOptions.value = industryRes.data;
    }
    if (stageRes.success) {
      stageOptions.value = stageRes.data;
    }
    if (typeRes.success) {
      typeOptions.value = typeRes.data.filter(item => item.value !== "");
    }
  } catch (error) {
    console.error("获取选项数据失败:", error);
  }
};

// 文件上传处理
const handleFileChange = (type: string, fileList: any[]) => {
  form[type as keyof typeof form] = fileList;
};

// 监听表单变化
watch(
  () => form,
  (newForm) => {
    emit("update:modelValue", { ...newForm });
  },
  { deep: true }
);

// 监听props变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      Object.assign(form, {
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
      });
    } else {
      // 重置表单
      Object.assign(form, {
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
      });
    }
  },
  { immediate: true }
);

// 表单验证
const validate = async (): Promise<boolean> => {
  if (!formRef.value) return false;
  
  try {
    await formRef.value.validate();
    return true;
  } catch {
    return false;
  }
};

// 重置表单
const resetFields = () => {
  formRef.value?.resetFields();
};

onMounted(() => {
  fetchOptions();
});

defineExpose({
  validate,
  resetFields
});
</script>