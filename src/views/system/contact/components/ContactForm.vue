<script setup lang="ts">
import { computed, nextTick, ref, toRef, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import type { UploadRequestOptions } from "element-plus";
import type { ContactFormModel } from "../types/types";

interface Props {
  formModel: ContactFormModel;
  rules: FormRules<ContactFormModel>;
  loading: boolean;
  submitLoading: boolean;
  uploading: boolean;
  qrPreview: string;
  qrPreview2: string;
}

const props = defineProps<Props>();
const formModel = toRef(props, "formModel");

const emit = defineEmits<{
  (e: "submit"): void;
  (e: "reset"): void;
  (
    e: "upload",
    field: "wechatQr" | "wechatQr2",
    options: UploadRequestOptions
  ): void;
  (e: "remove", field: "wechatQr" | "wechatQr2"): void;
  (e: "register", instance: FormInstance): void;
}>();

const formRef = ref<FormInstance>();

watch(
  () => formRef.value,
  instance => {
    if (instance) emit("register", instance);
  },
  { immediate: true }
);

const hasQrImage = computed(() => Boolean(formModel.value.wechatQr));
const hasQrImage2 = computed(() => Boolean(formModel.value.wechatQr2));

const handleSubmit = () => emit("submit");
const handleReset = () => emit("reset");
const handleUpload = (
  field: "wechatQr" | "wechatQr2",
  options: UploadRequestOptions
) => {
  emit("upload", field, options);
  return Promise.resolve();
};
const handleRemove = (field: "wechatQr" | "wechatQr2") => emit("remove", field);

const addQuickLink = () => {
  formModel.value.quickLinks.push({ name: "", url: "" });
  nextTick(() => formRef.value?.validateField?.("quickLinks"));
};

const removeQuickLink = (index: number) => {
  formModel.value.quickLinks.splice(index, 1);
  nextTick(() => formRef.value?.validateField?.("quickLinks"));
};

watch(
  () => formModel.value.quickLinks,
  () => {
    formRef.value?.validateField?.("quickLinks");
  },
  { deep: true }
);
</script>

<template>
  <el-card shadow="never" class="contact-card">
    <template #header>
      <div class="card-header">
        <span class="card-title">联系方式设置</span>
        <span class="card-subtitle">配置 PC 端展示的联系信息</span>
      </div>
    </template>

    <el-skeleton :loading="loading" animated :rows="8">
      <el-form
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-position="top"
        class="contact-form"
      >
        <!-- 基础联系信息 -->
        <div class="form-section">
          <div class="section-title">基础联系信息</div>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="联系电话" prop="phone">
                <el-input
                  v-model="formModel.phone"
                  placeholder="例如：021-12345678"
                  clearable
                  maxlength="50"
                  show-word-limit
                >
                  <template #prefix>
                    <i class="ri-phone-line" />
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="联系邮箱" prop="email">
                <el-input
                  v-model="formModel.email"
                  placeholder="例如：contact@haichuanghui.com"
                  clearable
                  maxlength="100"
                  show-word-limit
                >
                  <template #prefix>
                    <i class="ri-mail-line" />
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="微信号" prop="wechat">
                <el-input
                  v-model="formModel.wechat"
                  placeholder="例如：haichuanghui_official"
                  clearable
                  maxlength="100"
                  show-word-limit
                >
                  <template #prefix>
                    <i class="ri-wechat-line" />
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12">
              <el-form-item label="联系地址" prop="address">
                <el-input
                  v-model="formModel.address"
                  placeholder="例如：上海市浦东新区XXX路XXX号"
                  clearable
                  maxlength="255"
                  show-word-limit
                >
                  <template #prefix>
                    <i class="ri-map-pin-line" />
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 公司介绍 -->
        <div class="form-section">
          <div class="section-title">关于海创荟</div>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="about">
                <el-input
                  v-model="formModel.about"
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 10 }"
                  placeholder="请输入公司简介，支持多行文本&#10;例如：海创荟致力于打造海外创新创业生态圈..."
                  clearable
                  maxlength="2000"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 快捷链接 -->
        <div class="form-section">
          <div class="section-title">快捷链接</div>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="quickLinks">
                <div class="quick-links-wrapper">
                  <div
                    v-if="formModel.quickLinks.length === 0"
                    class="empty-links-tip"
                  >
                    <i class="ri-link-m" />
                    <span>暂无快捷链接，点击下方按钮添加</span>
                  </div>
                  <div
                    v-for="(link, index) in formModel.quickLinks"
                    :key="index"
                    class="quick-link-item"
                  >
                    <div class="link-index">{{ index + 1 }}</div>
                    <el-input
                      v-model="link.name"
                      placeholder="链接名称（例如：关于我们）"
                      maxlength="50"
                      clearable
                      class="link-name-input"
                    >
                      <template #prefix>
                        <i class="ri-text" />
                      </template>
                    </el-input>
                    <el-input
                      v-model="link.url"
                      placeholder="链接地址（例如：https://www.haichuanghui.com/about）"
                      maxlength="255"
                      clearable
                      class="link-url-input"
                    >
                      <template #prefix>
                        <i class="ri-links-line" />
                      </template>
                    </el-input>
                    <el-button
                      type="danger"
                      text
                      @click="removeQuickLink(index)"
                    >
                      <i class="ri-delete-bin-line" />
                      删除
                    </el-button>
                  </div>
                  <el-button
                    type="primary"
                    link
                    class="add-link-btn"
                    @click="addQuickLink"
                  >
                    <i class="ri-add-line" />
                    新增链接
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 微信二维码 -->
        <div class="form-section">
          <div class="section-title">微信二维码</div>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="wechatQr">
                <div class="qr-grid">
                  <div class="qr-upload-wrapper">
                    <div class="qr-label">二维码 1</div>
                    <div class="upload-actions">
                      <el-upload
                        class="qr-uploader"
                        accept="image/jpeg,image/png,image/gif"
                        :show-file-list="false"
                        :http-request="
                          options => handleUpload('wechatQr', options)
                        "
                        :disabled="uploading"
                      >
                        <el-button type="primary" :loading="uploading">
                          <i class="ri-upload-cloud-line" />
                          {{ hasQrImage ? "重新上传" : "上传二维码" }}
                        </el-button>
                      </el-upload>
                      <el-button
                        v-if="hasQrImage"
                        type="danger"
                        link
                        @click="handleRemove('wechatQr')"
                      >
                        <i class="ri-delete-bin-line" />
                        移除图片
                      </el-button>
                    </div>
                    <div class="form-tip">
                      <i class="ri-information-line" />
                      支持 JPG/PNG/GIF 格式，推荐尺寸 300×300 像素以上
                    </div>
                    <div v-if="hasQrImage" class="qr-preview-wrapper">
                      <el-image
                        :src="qrPreview"
                        class="qr-preview"
                        fit="contain"
                        :preview-src-list="[qrPreview]"
                      >
                        <template #error>
                          <div class="image-error">
                            <i class="ri-image-line" />
                            <span>加载失败</span>
                          </div>
                        </template>
                      </el-image>
                    </div>
                  </div>
                  <div class="qr-upload-wrapper">
                    <div class="qr-label">二维码 2</div>
                    <div class="upload-actions">
                      <el-upload
                        class="qr-uploader"
                        accept="image/jpeg,image/png,image/gif"
                        :show-file-list="false"
                        :http-request="
                          options => handleUpload('wechatQr2', options)
                        "
                        :disabled="uploading"
                      >
                        <el-button type="primary" :loading="uploading">
                          <i class="ri-upload-cloud-line" />
                          {{ hasQrImage2 ? "重新上传" : "上传二维码" }}
                        </el-button>
                      </el-upload>
                      <el-button
                        v-if="hasQrImage2"
                        type="danger"
                        link
                        @click="handleRemove('wechatQr2')"
                      >
                        <i class="ri-delete-bin-line" />
                        移除图片
                      </el-button>
                    </div>
                    <div class="form-tip">
                      <i class="ri-information-line" />
                      支持 JPG/PNG/GIF 格式，推荐尺寸 300×300 像素以上
                    </div>
                    <div v-if="hasQrImage2" class="qr-preview-wrapper">
                      <el-image
                        :src="qrPreview2"
                        class="qr-preview"
                        fit="contain"
                        :preview-src-list="[qrPreview2]"
                      >
                        <template #error>
                          <div class="image-error">
                            <i class="ri-image-line" />
                            <span>加载失败</span>
                          </div>
                        </template>
                      </el-image>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button
          type="primary"
          size="large"
          :loading="submitLoading"
          @click="handleSubmit"
        >
          <i class="ri-save-line" />
          保存设置
        </el-button>
        <el-button size="large" @click="handleReset">
          <i class="ri-refresh-line" />
          重置
        </el-button>
      </div>
    </el-skeleton>
  </el-card>
</template>

<style scoped>
/* 卡片容器 */
.contact-card {
  max-width: 1000px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.card-subtitle {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

/* 表单样式 */
.contact-form {
  padding: 8px 0;
}

/* 表单分组 */
.form-section {
  padding-bottom: 24px;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 3px solid var(--el-color-primary);
}

/* 表单提示 */
.form-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

.form-tip i {
  font-size: 14px;
}

/* 快捷链接样式 */
.quick-links-wrapper {
  width: 100%;
}

.empty-links-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 16px;
  background-color: var(--el-fill-color-light);
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  margin-bottom: 12px;
}

.empty-links-tip i {
  font-size: 20px;
}

.quick-link-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding: 12px;
  background-color: var(--el-fill-color-lighter);
  border-radius: 6px;
  transition: all 0.2s;
}

.quick-link-item:hover {
  background-color: var(--el-fill-color-light);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.link-index {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.link-name-input {
  flex: 0 0 240px;
  min-width: 180px;
}

.link-url-input {
  flex: 1;
  min-width: 260px;
}

.add-link-btn {
  margin-top: 4px;
  font-size: 13px;
}

.add-link-btn i {
  margin-right: 4px;
}

/* 二维码上传样式 */
.qr-upload-wrapper {
  width: 100%;
}

.qr-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.qr-label {
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.upload-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.qr-preview-wrapper {
  margin-top: 16px;
  display: inline-block;
}

.qr-preview {
  width: 180px;
  height: 180px;
  border-radius: 8px;
  border: 2px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-blank);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  cursor: pointer;
}

.qr-preview:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
  color: var(--el-text-color-secondary);
}

.image-error i {
  font-size: 32px;
}

.image-error span {
  font-size: 12px;
}

/* 操作按钮 */
.form-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.form-actions .el-button {
  min-width: 120px;
}

.form-actions .el-button i {
  margin-right: 4px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .contact-card {
    margin: 0 12px;
  }

  .section-title {
    font-size: 13px;
    padding-left: 10px;
  }

  .quick-link-item {
    flex-wrap: wrap;
    gap: 8px;
  }

  .link-index {
    width: 24px;
    height: 24px;
    font-size: 12px;
  }

  .link-name-input,
  .link-url-input {
    flex: 1 1 100%;
    min-width: 100%;
  }

  .qr-preview {
    width: 150px;
    height: 150px;
  }

  .qr-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .form-actions {
    flex-direction: column;
    gap: 8px;
  }

  .form-actions .el-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .card-title {
    font-size: 15px;
  }

  .card-subtitle {
    font-size: 12px;
  }

  :deep(.el-form-item__label) {
    font-size: 13px;
  }
}
</style>
