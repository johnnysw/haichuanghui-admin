<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="120px"
      class="investor-form"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 基本信息 -->
        <div class="col-span-1 md:col-span-2">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div class="w-1 h-5 bg-primary rounded mr-3"></div>
            基本信息
          </h3>
        </div>

        <el-form-item label="投资人姓名" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入投资人姓名"
            :disabled="props.mode === 'view'"
          />
        </el-form-item>

        <el-form-item label="投资机构" prop="institution">
          <el-input
            v-model="form.institution"
            placeholder="请输入投资机构名称"
            :disabled="props.mode === 'view'"
          />
        </el-form-item>

        <el-form-item label="职位" prop="position">
          <el-input
            v-model="form.position"
            placeholder="请输入职位"
            :disabled="props.mode === 'view'"
          />
        </el-form-item>

        <el-form-item label="地区" prop="location">
          <el-input
            v-model="form.location"
            placeholder="请输入地区"
            :disabled="props.mode === 'view'"
          />
        </el-form-item>

        <el-form-item label="投资范围" prop="investmentRange">
          <el-input
            v-model="form.investmentRange"
            placeholder="例如：100万-1000万"
            :disabled="props.mode === 'view'"
          />
        </el-form-item>

        <el-form-item label="投资人状态" prop="status">
          <el-select
            v-model="form.status"
            placeholder="请选择状态"
            :disabled="props.mode === 'view'"
            class="w-full"
          >
            <el-option label="正常" :value="1" />
            <el-option label="审核中" :value="2" />
            <el-option label="已拒绝" :value="3" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item label="头像" prop="avatar" class="col-span-1 md:col-span-2">
          <el-input
            v-model="form.avatar"
            placeholder="请输入头像图片URL"
            :disabled="props.mode === 'view'"
          />
          <div v-if="form.avatar" class="mt-2">
            <el-image
              :src="form.avatar"
              alt="头像预览"
              fit="cover"
              class="w-20 h-20 rounded-full border"
            />
          </div>
        </el-form-item>

        <!-- 联系信息 -->
        <div class="col-span-1 md:col-span-2 mt-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div class="w-1 h-5 bg-primary rounded mr-3"></div>
            联系信息
          </h3>
        </div>

        <el-form-item label="联系电话" prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="请输入联系电话"
            :disabled="props.mode === 'view'"
          />
        </el-form-item>

        <el-form-item label="邮箱地址" prop="email">
          <el-input
            v-model="form.email"
            placeholder="请输入邮箱地址"
            :disabled="props.mode === 'view'"
          />
        </el-form-item>

        <!-- 投资偏好 -->
        <div class="col-span-1 md:col-span-2 mt-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div class="w-1 h-5 bg-primary rounded mr-3"></div>
            投资偏好
          </h3>
        </div>

        <el-form-item label="关注行业" prop="focusIndustries" class="col-span-1 md:col-span-2">
          <el-select
            v-model="form.focusIndustries"
            multiple
            placeholder="请选择关注行业"
            :disabled="props.mode === 'view'"
            class="w-full"
          >
            <el-option
              v-for="option in FOCUS_INDUSTRIES"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="偏好阶段" prop="preferredStages" class="col-span-1 md:col-span-2">
          <el-select
            v-model="form.preferredStages"
            multiple
            placeholder="请选择偏好投资阶段"
            :disabled="props.mode === 'view'"
            class="w-full"
          >
            <el-option
              v-for="option in PREFERRED_STAGES"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <!-- 个人简介 -->
        <div class="col-span-1 md:col-span-2 mt-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div class="w-1 h-5 bg-primary rounded mr-3"></div>
            个人简介
          </h3>
        </div>

        <el-form-item label="简短介绍" prop="bio" class="col-span-1 md:col-span-2">
          <el-input
            v-model="form.bio"
            type="textarea"
            placeholder="请输入简短的个人介绍"
            :disabled="props.mode === 'view'"
            :rows="3"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="详细描述" prop="description" class="col-span-1 md:col-span-2">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入详细的个人背景和投资经历"
            :disabled="props.mode === 'view'"
            :rows="4"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <!-- 其他设置 -->
        <div class="col-span-1 md:col-span-2 mt-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div class="w-1 h-5 bg-primary rounded mr-3"></div>
            其他设置
          </h3>
        </div>

        <el-form-item label="是否认证" class="col-span-1 md:col-span-2">
          <el-switch
            v-model="form.verified"
            :disabled="props.mode === 'view'"
            active-text="已认证"
            inactive-text="未认证"
          />
        </el-form-item>

        <el-form-item label="是否推荐" class="col-span-1 md:col-span-2">
          <el-switch
            v-model="form.isRecommended"
            :disabled="props.mode === 'view'"
            active-text="推荐"
            inactive-text="普通"
          />
        </el-form-item>

        <el-form-item label="是否精选" class="col-span-1 md:col-span-2">
          <el-switch
            v-model="form.isFeatured"
            :disabled="props.mode === 'view'"
            active-text="精选"
            inactive-text="普通"
          />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">
          {{ props.mode === 'view' ? '关闭' : '取消' }}
        </el-button>
        <el-button
          v-if="props.mode !== 'view'"
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
        >
          {{ props.mode === 'add' ? '创建' : '更新' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { createInvestor, updateInvestor } from "../../api";
import { FOCUS_INDUSTRIES, PREFERRED_STAGES } from "../../types/types";
import type { InvestorItem, InvestorCreateForm } from "../../types/types";
import type { FormInstance, FormRules } from "element-plus";

interface Props {
  visible: boolean;
  mode: "add" | "edit" | "view";
  formData?: InvestorItem | null;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "success"): void;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  mode: "add",
  formData: null
});

const emit = defineEmits<Emits>();

const formRef = ref<FormInstance>();
const submitLoading = ref(false);

// 表单数据
const form = reactive<InvestorCreateForm>({
  name: "",
  avatar: "",
  institution: "",
  position: "",
  location: "",
  investmentRange: "",
  focusIndustries: [],
  preferredStages: [],
  phone: "",
  email: "",
  bio: "",
  description: "",
  verified: false,
  status: 1,
  isRecommended: false,
  isFeatured: false
});

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: "请输入投资人姓名", trigger: "blur" }
  ],
  institution: [
    { required: true, message: "请输入投资机构名称", trigger: "blur" }
  ],
  position: [
    { required: true, message: "请输入职位", trigger: "blur" }
  ],
  location: [
    { required: true, message: "请输入地区", trigger: "blur" }
  ],
  investmentRange: [
    { required: true, message: "请输入投资范围", trigger: "blur" }
  ],
  phone: [
    { required: true, message: "请输入联系电话", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" }
  ],
  email: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
  ],
  focusIndustries: [
    { required: true, message: "请选择关注行业", trigger: "change" }
  ],
  preferredStages: [
    { required: true, message: "请选择偏好投资阶段", trigger: "change" }
  ],
  bio: [
    { required: true, message: "请输入简短介绍", trigger: "blur" }
  ],
  description: [
    { required: true, message: "请输入详细描述", trigger: "blur" }
  ]
};

// 弹窗标题
const dialogTitle = computed(() => {
  const titleMap = {
    add: "新增投资人",
    edit: "编辑投资人", 
    view: "查看投资人"
  };
  return titleMap[props.mode];
});

// 弹窗显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value)
});

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    name: "",
    avatar: "",
    institution: "",
    position: "",
    location: "",
    investmentRange: "",
    focusIndustries: [],
    preferredStages: [],
    phone: "",
    email: "",
    bio: "",
    description: "",
    verified: false,
    status: 1,
    isRecommended: false,
    isFeatured: false
  });
};

// 监听弹窗显示状态
watch(() => props.visible, (visible) => {
  if (visible) {
    if (props.mode === "add") {
      resetForm();
    } else if (props.formData && (props.mode === "edit" || props.mode === "view")) {
      Object.assign(form, {
        name: props.formData.name,
        avatar: props.formData.avatar,
        institution: props.formData.institution,
        position: props.formData.position,
        location: props.formData.location,
        investmentRange: props.formData.investmentRange,
        focusIndustries: [...props.formData.focusIndustries],
        preferredStages: [...props.formData.preferredStages],
        phone: props.formData.phone,
        email: props.formData.email,
        bio: props.formData.bio,
        description: props.formData.description,
        verified: props.formData.verified,
        status: props.formData.status,
        isRecommended: props.formData.isRecommended,
        isFeatured: props.formData.isFeatured
      });
    }
    
    nextTick(() => {
      formRef.value?.clearValidate();
    });
  }
});

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    const valid = await formRef.value.validate();
    if (!valid) return;

    submitLoading.value = true;

    if (props.mode === "add") {
      await createInvestor(form);
      ElMessage.success("投资人创建成功");
    } else if (props.mode === "edit" && props.formData) {
      await updateInvestor(props.formData.id, form);
      ElMessage.success("投资人更新成功");
    }

    emit("success");
  } catch (error) {
    console.error("提交失败:", error);
    ElMessage.error("操作失败，请重试");
  } finally {
    submitLoading.value = false;
  }
};

// 取消操作
const handleCancel = () => {
  dialogVisible.value = false;
};
</script>

<style lang="scss" scoped>
.investor-form {
  .el-form-item {
    margin-bottom: 18px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>