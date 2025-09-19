<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import ArrowLeft from "@iconify-icons/ep/arrow-left";
import Upload from "@iconify-icons/ep/upload";
import Document from "@iconify-icons/ep/document";
import { createIncubator } from "./api";
import type { IncubatorCreateForm, PolicyFile, ImageFile } from "./types";
import type { UploadProps, UploadFile } from "element-plus";

defineOptions({ name: "IncubatorAdd" });

const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);

const form = reactive<IncubatorCreateForm>({
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

// 服务内容输入
const serviceInput = ref("");

// 表单验证规则
const rules = reactive<FormRules<IncubatorCreateForm>>({
  name: [{ required: true, message: "请输入载体名称", trigger: "blur" }],
  location: [{ required: true, message: "请输入所在地区", trigger: "blur" }],
  type: [{ required: true, message: "请选择载体类型", trigger: "change" }],
  description: [{ required: true, message: "请输入载体简介", trigger: "blur" }],
  contactPhone: [
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" }
  ],
  contactEmail: [
    { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
  ]
});

// 载体类型选项
const typeOptions = [
  { label: "孵化器", value: "孵化器" },
  { label: "加速器", value: "加速器" },
  { label: "科技园", value: "科技园" },
  { label: "创业园", value: "创业园" }
];

// 返回列表
function goBack() {
  router.push("/incubator/list");
}

// 添加服务内容
function addService() {
  if (serviceInput.value.trim()) {
    form.services.push(serviceInput.value.trim());
    serviceInput.value = "";
  }
}

// 删除服务内容
function removeService(index: number) {
  form.services.splice(index, 1);
}

// 文件上传处理
const handleFileUpload: UploadProps['onChange'] = (file: UploadFile) => {
  if (file.status === 'ready') {
    // 模拟文件上传成功，实际应该调用文件上传API
    const mockUrl = `https://example.com/files/${file.name}`;
    const policyFile: PolicyFile = {
      name: file.name,
      url: mockUrl,
      size: file.size,
      type: file.raw?.type
    };
    form.policies.push(policyFile);
    ElMessage.success(`文件 ${file.name} 上传成功`);
  }
};

// 文件上传前的校验
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 限制文件类型为PDF, DOC, DOCX
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!allowedTypes.includes(rawFile.type)) {
    ElMessage.error('只支持上传 PDF、DOC、DOCX 格式的文件!');
    return false;
  }
  
  // 限制文件大小不超过10MB
  const isLt10M = rawFile.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    ElMessage.error('上传文件大小不能超过 10MB!');
  }
  
  return isLt10M;
};

// 删除政策文件
function removePolicy(index: number) {
  form.policies.splice(index, 1);
}

// 格式化文件大小
function formatFileSize(size?: number): string {
  if (!size) return '未知大小';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

// 图片文件上传处理
const handleImageUpload: UploadProps['onChange'] = (file: UploadFile) => {
  if (file.status === 'ready') {
    // 模拟图片上传成功，实际应该调用文件上传API
    const mockUrl = `https://example.com/images/${file.name}`;
    const imageFile: ImageFile = {
      name: file.name,
      url: mockUrl,
      size: file.size,
      type: file.raw?.type
    };
    form.images.push(imageFile);
    ElMessage.success(`图片 ${file.name} 上传成功`);
  }
};

// 图片上传前的校验
const beforeImageUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 限制文件类型为图片
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(rawFile.type)) {
    ElMessage.error('只支持上传 JPG、PNG、GIF、WebP 格式的图片!');
    return false;
  }
  
  // 限制文件大小不超过5MB
  const isLt5M = rawFile.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    ElMessage.error('上传图片大小不能超过 5MB!');
  }
  
  return isLt5M;
};

// 删除图片
function removeImage(index: number) {
  form.images.splice(index, 1);
}

// 提交表单
async function handleSubmit() {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    loading.value = true;
    
    const { success } = await createIncubator(form);
    if (success) {
      ElMessage.success("载体添加成功");
      router.push("/incubator/list");
    } else {
      ElMessage.error("载体添加失败");
    }
  } catch (error) {
    console.error("提交失败:", error);
  } finally {
    loading.value = false;
  }
}

// 重置表单
function resetForm() {
  if (!formRef.value) return;
  formRef.value.resetFields();
  form.services.length = 0;
  form.policies.length = 0;
  form.images.length = 0;
}
</script>

<template>
  <div>
    <!-- 面包屑导航 -->
    <div class="bg-white shadow-sm border-b px-6 py-4 mb-6">
      <div class="flex items-center gap-4">
        <el-button @click="goBack" :icon="useRenderIcon(ArrowLeft)" link>
          返回列表
        </el-button>
        <div class="text-lg font-semibold text-gray-800">添加双创载体</div>
      </div>
    </div>

    <!-- 表单内容 -->
    <div class="bg-white rounded-lg shadow-md mx-6 p-8">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="left"
      >
        <!-- 基本信息 -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div class="w-1 h-5 bg-primary rounded mr-3"></div>
            基本信息
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <el-form-item label="载体名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入载体名称" />
            </el-form-item>
            
            <el-form-item label="所在地区" prop="location">
              <el-input v-model="form.location" placeholder="请输入所在地区" />
            </el-form-item>
            
            <el-form-item label="载体类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择载体类型" class="w-full">
                <el-option
                  v-for="option in typeOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            
            <el-form-item label="成立日期">
              <el-date-picker
                v-model="form.establishedDate"
                type="date"
                placeholder="请选择成立日期"
                format="YYYY-MM-DD"
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
          
          <el-form-item label="载体简介" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
              placeholder="请输入载体简介"
            />
          </el-form-item>
        </div>

        <!-- 联系信息 -->
        <div class="mb-8">
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
        <div class="mb-8">
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
            >
              {{ service }}
            </el-tag>
          </div>
        </div>

        <!-- 政策支持 -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div class="w-1 h-5 bg-primary rounded mr-3"></div>
            政策支持文件
          </h3>
          
          <!-- 文件上传 -->
          <div class="mb-4">
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
                  <component :is="useRenderIcon(Upload)" />
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
                  <component :is="useRenderIcon(Document)" />
                </el-icon>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ policy.name }}</div>
                  <div class="text-xs text-gray-500">{{ formatFileSize(policy.size) }}</div>
                </div>
              </div>
              <el-button
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
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <div class="w-1 h-5 bg-primary rounded mr-3"></div>
            环境图片
          </h3>
          
          <!-- 图片上传 -->
          <div class="mb-4">
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
                  <component :is="useRenderIcon(Upload)" />
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

        <!-- 提交按钮 -->
        <div class="flex gap-4 pt-4 border-t">
          <el-button type="primary" :loading="loading" @click="handleSubmit">
            提交
          </el-button>
          <el-button @click="resetForm">重置</el-button>
          <el-button @click="goBack">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
/* 自定义样式 */
.el-input-number {
  width: 100%;
}
</style>