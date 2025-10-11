<script setup lang="ts">
import { computed, ref } from "vue";
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElRadioGroup,
  ElRadio,
  ElUpload,
  ElButton,
  ElIcon,
  type FormInstance,
  type FormRules,
  type UploadRequestOptions
} from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import type { BannerForm } from "../types/types";

// Props
interface Props {
  visible: boolean;
  title: string;
  formModel: BannerForm;
  rules: FormRules;
  loading?: boolean;
  uploading?: boolean;
  imagePreview?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  uploading: false,
  imagePreview: '',
});

// Emits
const emit = defineEmits<{
  'update:visible': [value: boolean];
  'submit': [];
  'close': [];
  'upload': [options: UploadRequestOptions];
  'remove': [];
}>();

// 表单实例
const dialogFormRef = ref<FormInstance>();

// 计算属性
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
});

// 处理提交 - 在组件内部完成验证
const handleSubmit = async () => {
  if (!dialogFormRef.value) return;

  const valid = await dialogFormRef.value.validate().catch(() => false);
  if (valid) {
    emit('submit');
  }
};

// 处理关闭
const handleClose = () => {
  dialogFormRef.value?.resetFields();
  emit('close');
};

// 处理上传
const handleUpload = (options: UploadRequestOptions) => {
  emit('upload', options);
  return Promise.resolve();
};
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="props.title"
    width="600px"
    :close-on-click-modal="false"
    @close="emit('close')"
  >
    <el-form
      ref="dialogFormRef"
      :model="props.formModel"
      :rules="props.rules"
      label-width="100px"
      v-loading="props.loading"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="props.formModel.title"
          placeholder="请输入轮播图标题"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="图片" prop="image" required>
        <el-upload
          class="banner-uploader"
          :http-request="handleUpload"
          :show-file-list="false"
          accept=".jpg,.jpeg,.png,.gif,.webp"
          :disabled="props.uploading"
        >
          <el-icon v-if="!props.imagePreview" class="banner-uploader-icon">
            <Plus />
          </el-icon>
          <img
            v-else
            :src="props.imagePreview"
            class="banner-image"
            alt="预览图"
          />
        </el-upload>
        <div class="upload-tip">
          支持 JPG、PNG、GIF、WebP 格式，建议尺寸 1200x400，文件大小不超过 5MB
        </div>
        <el-button
          v-if="props.imagePreview"
          type="danger"
          size="small"
          @click="emit('remove')"
          style="margin-top: 10px"
        >
          移除图片
        </el-button>
      </el-form-item>

      <el-form-item label="链接地址" prop="url">
        <el-input
          v-model="props.formModel.url"
          placeholder="请输入跳转链接（可选）"
          maxlength="255"
        />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="props.formModel.description"
          type="textarea"
          placeholder="请输入轮播图描述（可选）"
          :rows="4"
          maxlength="2000"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="排序" prop="sortOrder">
        <el-input-number
          v-model="props.formModel.sortOrder"
          :min="0"
          :max="9999"
          controls-position="right"
        />
        <span class="form-tip">数值越小越靠前</span>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="props.formModel.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button
        type="primary"
        @click="handleSubmit"
        :loading="props.loading"
      >
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.banner-uploader {
  width: 360px;
  height: 120px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

.banner-uploader:hover {
  border-color: #409eff;
}

.banner-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 360px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-image {
  width: 360px;
  height: 120px;
  object-fit: cover;
  display: block;
}

.upload-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

.form-tip {
  margin-left: 10px;
  font-size: 12px;
  color: #999;
}
</style>
