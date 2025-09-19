<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="900px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-position="left"
      :disabled="mode === 'view'"
    >
      <!-- 基本信息 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-1 h-5 bg-primary rounded mr-3"></div>
          基本信息
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <el-form-item label="中心名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入中心名称" />
          </el-form-item>
          <el-form-item label="所在地区" prop="location">
            <el-select v-model="form.location" placeholder="请选择所在地区" class="w-full">
              <el-option label="美国硅谷" value="美国硅谷" />
              <el-option label="德国柏林" value="德国柏林" />
              <el-option label="新加坡" value="新加坡" />
              <el-option label="日本东京" value="日本东京" />
              <el-option label="澳大利亚悉尼" value="澳大利亚悉尼" />
              <el-option label="加拿大多伦多" value="加拿大多伦多" />
              <el-option label="英国伦敦" value="英国伦敦" />
              <el-option label="法国巴黎" value="法国巴黎" />
              <el-option label="韩国首尔" value="韩国首尔" />
              <el-option label="以色列特拉维夫" value="以色列特拉维夫" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
          <el-form-item label="中心类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择中心类型" class="w-full">
              <el-option label="科技园" value="科技园" />
              <el-option label="孵化器" value="孵化器" />
              <el-option label="加速器" value="加速器" />
              <el-option label="创业园" value="创业园" />
              <el-option label="研究院" value="研究院" />
            </el-select>
          </el-form-item>
          <el-form-item label="成立日期">
            <el-date-picker
              v-model="form.establishedDate"
              type="date"
              placeholder="选择成立日期"
              value-format="YYYY-MM-DD"
              class="w-full"
            />
          </el-form-item>
          <el-form-item label="场地面积(㎡)">
            <el-input-number v-model="form.areaSize" :min="0" class="w-full" />
          </el-form-item>
          <el-form-item label="入驻企业数">
            <el-input-number v-model="form.companyCount" :min="0" class="w-full" />
          </el-form-item>
          <el-form-item label="毕业企业数">
            <el-input-number v-model="form.graduatedCount" :min="0" class="w-full" />
          </el-form-item>
        </div>
        <el-form-item label="中心简介" prop="description" class="mt-6">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入中心简介"
          />
        </el-form-item>
      </div>

      <!-- 联系信息 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-1 h-5 bg-primary rounded mr-3"></div>
          联系信息
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <el-form-item label="联系地址">
            <el-input v-model="form.address" placeholder="请输入详细地址" />
          </el-form-item>
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
          </el-form-item>
          <el-form-item label="联系邮箱" prop="contactEmail">
            <el-input v-model="form.contactEmail" placeholder="请输入联系邮箱" />
          </el-form-item>
          <el-form-item label="官方网站">
            <el-input v-model="form.website" placeholder="请输入官方网站地址" />
          </el-form-item>
        </div>
      </div>

      <!-- 服务内容 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-1 h-5 bg-primary rounded mr-3"></div>
          服务内容
        </h3>
        <div class="flex gap-2 mb-4">
          <el-input
            v-model="serviceInput"
            placeholder="请输入服务内容"
            class="flex-1"
            @keyup.enter="addService"
          />
          <el-button type="primary" @click="addService">添加</el-button>
        </div>
        <div class="flex flex-wrap gap-2">
          <el-tag
            v-for="(service, index) in form.services"
            :key="index"
            closable
            @close="removeService(index)"
            type="info"
          >
            {{ service }}
          </el-tag>
        </div>
      </div>

      <!-- 政策支持 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-1 h-5 bg-primary rounded mr-3"></div>
          政策支持文件
        </h3>
        
        <!-- 文件上传 -->
        <div class="mb-4" v-if="mode !== 'view'">
          <el-upload
            :auto-upload="false"
            :on-change="handleFileUpload"
            :before-upload="beforeUpload"
            :show-file-list="false"
            accept=".pdf,.doc,.docx"
            drag
          >
            <div class="el-upload__text">
              <el-icon class="el-icon--upload">
                <component :is="useRenderIcon('ep:upload')" />
              </el-icon>
              <div class="el-upload__text">将政策文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip">只能上传 PDF、DOC、DOCX 文件，且不超过 10MB</div>
            </div>
          </el-upload>
        </div>
        
        <!-- 已上传文件列表 -->
        <div v-if="form.policies.length > 0" class="space-y-2">
          <h4 class="text-sm font-medium text-gray-700">已上传文件：</h4>
          <div
            v-for="(policy, index) in form.policies"
            :key="index"
            class="flex items-center justify-between bg-gray-50 rounded-lg p-3 border"
          >
            <div class="flex items-center space-x-3">
              <el-icon class="text-blue-500" :size="20">
                <component :is="useRenderIcon('ep:document')" />
              </el-icon>
              <div>
                <div class="text-sm font-medium text-gray-900">{{ policy.name }}</div>
                <div class="text-xs text-gray-500">{{ formatFileSize(policy.size) }}</div>
              </div>
            </div>
            <el-button
              v-if="mode !== 'view'"
              type="danger"
              size="small"
              text
              @click="removePolicy(index)"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>

      <!-- 环境图片 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-1 h-5 bg-primary rounded mr-3"></div>
          环境图片
        </h3>
        
        <!-- 图片上传 -->
        <div class="mb-4" v-if="mode !== 'view'">
          <el-upload
            :auto-upload="false"
            :on-change="handleImageUpload"
            :before-upload="beforeImageUpload"
            :show-file-list="false"
            accept="image/*"
            drag
            multiple
          >
            <div class="el-upload__text">
              <el-icon class="el-icon--upload">
                <component :is="useRenderIcon('ep:upload')" />
              </el-icon>
              <div class="el-upload__text">将环境图片拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip">只能上传 JPG、PNG、GIF、WebP 格式图片，且不超过 5MB</div>
            </div>
          </el-upload>
        </div>
        
        <!-- 已上传图片预览 -->
        <div v-if="form.images.length > 0">
          <h4 class="text-sm font-medium text-gray-700 mb-4">已上传图片：</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="(image, index) in form.images"
              :key="index"
              class="relative group"
            >
              <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  :src="image.url"
                  :alt="image.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="mt-2">
                <p class="text-xs text-gray-600 truncate">{{ image.name }}</p>
                <p class="text-xs text-gray-500">{{ formatFileSize(image.size) }}</p>
              </div>
              <button
                v-if="mode !== 'view'"
                type="button"
                class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                @click="removeImage(index)"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          v-if="mode !== 'view'"
          type="primary"
          @click="handleSubmit"
          :loading="loading"
        >
          {{ mode === "add" ? "确认新增" : "确认修改" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { ElMessage, type FormInstance, type FormRules, type UploadFile, type UploadProps } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { createOffshore, updateOffshore } from "../api/index";
import type { OffshoreCenter, OffshoreCreateForm, PolicyFile, ImageFile } from "../types/types";

defineOptions({ name: "OffshoreDialog" });

interface Props {
  visible: boolean;
  mode: "add" | "edit" | "view";
  formData?: OffshoreCenter | null;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  mode: "add",
  formData: null
});

const emit = defineEmits<{
  "update:visible": [visible: boolean];
  success: [];
}>();

const formRef = ref<FormInstance>();
const loading = ref(false);
const serviceInput = ref("");

// 弹窗显示控制
const dialogVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit("update:visible", value)
});

// 弹窗标题
const dialogTitle = computed(() => {
  switch (props.mode) {
    case "add": return "新增离岸中心";
    case "edit": return "编辑离岸中心";
    case "view": return "查看离岸中心";
    default: return "";
  }
});

// 表单数据
const form = ref<OffshoreCreateForm>({
  name: "",
  location: "",
  type: "",
  description: "",
  website: "",
  contactPhone: "",
  contactEmail: "",
  address: "",
  establishedDate: "",
  areaSize: 0,
  companyCount: 0,
  graduatedCount: 0,
  services: [],
  policies: [],
  images: []
});

// 表单验证规则
const rules: FormRules<OffshoreCreateForm> = {
  name: [{ required: true, message: "请输入中心名称", trigger: "blur" }],
  location: [{ required: true, message: "请输入所在地区", trigger: "blur" }],
  type: [{ required: true, message: "请选择中心类型", trigger: "change" }],
  description: [{ required: true, message: "请输入中心简介", trigger: "blur" }],
  contactPhone: [
    { pattern: /^[\d\s\-\+\(\)]*$/, message: "请输入正确的电话号码格式", trigger: "blur" }
  ],
  contactEmail: [
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }
  ]
};

// 在弹窗打开时初始化表单（避免初始化阶段调用未定义函数）
watch(
  () => props.visible,
  visible => {
    if (!visible) return;
    if (props.mode === "add") {
      resetForm();
    } else if (props.formData) {
      form.value = {
        name: props.formData.name,
        location: props.formData.location,
        type: props.formData.type,
        description: props.formData.description || "",
        website: props.formData.website || "",
        contactPhone: props.formData.contactPhone || "",
        contactEmail: props.formData.contactEmail || "",
        address: props.formData.address || "",
        establishedDate: props.formData.establishedDate || "",
        areaSize: props.formData.areaSize || 0,
        companyCount: props.formData.companyCount || 0,
        graduatedCount: props.formData.graduatedCount || 0,
        services: props.formData.services || [],
        policies: props.formData.policies || [],
        images: props.formData.images || []
      };
      nextTick(() => formRef.value?.clearValidate());
    }
  }
);

// 重置表单
const resetForm = () => {
  form.value = {
    name: "",
    location: "",
    type: "",
    description: "",
    website: "",
    contactPhone: "",
    contactEmail: "",
    address: "",
    establishedDate: "",
    areaSize: 0,
    companyCount: 0,
    graduatedCount: 0,
    services: [],
    policies: [],
    images: []
  };
  serviceInput.value = "";
  nextTick(() => formRef.value?.clearValidate());
};

// 服务内容相关
const addService = () => {
  if (serviceInput.value.trim()) {
    form.value.services.push(serviceInput.value.trim());
    serviceInput.value = "";
  }
};

const removeService = (index: number) => {
  form.value.services.splice(index, 1);
};

// 文件上传相关
const handleFileUpload: UploadProps['onChange'] = (file: UploadFile) => {
  if (file.status === 'ready') {
    const mockUrl = `https://example.com/policies/${file.name}`;
    const policyFile: PolicyFile = {
      name: file.name,
      url: mockUrl,
      size: file.size,
      type: file.raw?.type
    };
    form.value.policies.push(policyFile);
    ElMessage.success(`文件 ${file.name} 上传成功`);
  }
};

const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(rawFile.type)) {
    ElMessage.error('只支持上传 PDF、DOC、DOCX 格式的文件!');
    return false;
  }
  
  const isLt10M = rawFile.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    ElMessage.error('上传文件大小不能超过 10MB!');
  }
  
  return isLt10M;
};

const removePolicy = (index: number) => {
  form.value.policies.splice(index, 1);
};

// 图片上传相关
const handleImageUpload: UploadProps['onChange'] = (file: UploadFile) => {
  if (file.status === 'ready') {
    const mockUrl = `https://example.com/images/${file.name}`;
    const imageFile: ImageFile = {
      name: file.name,
      url: mockUrl,
      size: file.size,
      type: file.raw?.type
    };
    form.value.images.push(imageFile);
    ElMessage.success(`图片 ${file.name} 上传成功`);
  }
};

const beforeImageUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(rawFile.type)) {
    ElMessage.error('只支持上传 JPG、PNG、GIF、WebP 格式的图片!');
    return false;
  }
  
  const isLt5M = rawFile.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    ElMessage.error('上传图片大小不能超过 5MB!');
  }
  
  return isLt5M;
};

const removeImage = (index: number) => {
  form.value.images.splice(index, 1);
};

// 格式化文件大小
const formatFileSize = (size?: number): string => {
  if (!size) return '未知大小';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    loading.value = true;
    
    if (props.mode === "add") {
      await createOffshore(form.value);
      ElMessage.success("新增成功");
    } else {
      await updateOffshore(props.formData!.id, form.value);
      ElMessage.success("修改成功");
    }
    
    emit("success");
    handleCancel();
  } catch (error) {
    console.error("提交失败:", error);
    ElMessage.error("提交失败");
  } finally {
    loading.value = false;
  }
};

// 取消
const handleCancel = () => {
  dialogVisible.value = false;
  resetForm();
};
</script>

<style scoped lang="scss">
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-upload-dragger) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  background-color: var(--el-fill-color-lighter);
  text-align: center;
  padding: 40px 20px;
  
  &:hover {
    border-color: var(--el-color-primary);
  }
}

:deep(.el-upload__text) {
  color: var(--el-text-color-regular);
  font-size: 14px;
  text-align: center;
  
  em {
    color: var(--el-color-primary);
    font-style: normal;
  }
}

:deep(.el-upload__tip) {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 8px;
}
</style>