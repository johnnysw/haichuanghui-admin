<template>
  <el-dialog
    v-model="visible"
    :title="dialogTitle"
    width="800px"
    :before-close="handleClose"
  >
    <div class="review-dialog-content">
      <!-- 申请信息预览 -->
      <div v-if="!isBatch" class="application-preview">
        <h4>申请信息</h4>
        <div class="preview-content">
          <div class="preview-item">
            <span class="label">申请人：</span>
            <span>{{ application?.user.realName || application?.user.username }}</span>
          </div>
          <div class="preview-item">
            <span class="label">投资机构：</span>
            <span>{{ application?.investmentInstitution }}</span>
          </div>
          <div class="preview-item">
            <span class="label">联系邮箱：</span>
            <span>{{ application?.user.email }}</span>
          </div>
          <div class="preview-item">
            <span class="label">提交时间：</span>
            <span>{{ application?.submittedTime }}</span>
          </div>
        </div>
      </div>

      <!-- 批量审核信息 -->
      <div v-else class="batch-preview">
        <h4>批量审核</h4>
        <div class="batch-info">
          <el-text>即将审核 {{ batchApplications.length }} 个申请</el-text>
        </div>
      </div>

      <!-- 审核表单 -->
      <div class="review-form">
        <el-form
          ref="formRef"
          :model="reviewForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="审核结果" prop="status">
            <el-radio-group v-model="reviewForm.status">
              <el-radio :label="1" size="large">
                <el-icon color="#67c23a"><Check /></el-icon>
                审核通过
              </el-radio>
              <el-radio :label="3" size="large">
                <el-icon color="#f56c6c"><Close /></el-icon>
                审核拒绝
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="审核意见" prop="comment">
            <el-input
              v-model="reviewForm.comment"
              type="textarea"
              :rows="4"
              :placeholder="reviewForm.status === 1 ? '请输入通过理由（可选）' : '请输入拒绝原因'"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <!-- 文档审核（仅单个审核时显示） -->
          <div v-if="!isBatch && application?.documents && application.documents.length > 0" class="document-review">
            <el-form-item label="文档审核">
              <div class="document-list">
                <div
                  v-for="doc in application.documents"
                  :key="doc.id"
                  class="document-item"
                >
                  <div class="document-info">
                    <el-icon><Document /></el-icon>
                    <span class="document-name">{{ doc.fileName }}</span>
                    <el-tag
                      :type="getDocumentStatusColor(doc.status)"
                      size="small"
                      effect="light"
                    >
                      {{ getDocumentStatusText(doc.status) }}
                    </el-tag>
                  </div>
                  <div class="document-actions">
                    <el-button
                      size="small"
                      type="primary"
                      link
                      @click="previewDocument(doc)"
                    >
                      预览
                    </el-button>
                    <el-button
                      size="small"
                      type="success"
                      link
                      @click="reviewDocument(doc, 'approved')"
                    >
                      通过
                    </el-button>
                    <el-button
                      size="small"
                      type="danger"
                      link
                      @click="reviewDocument(doc, 'rejected')"
                    >
                      拒绝
                    </el-button>
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          确认审核
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import { Check, Close, Document } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import type { InvestorApplication, ReviewForm, ApplicationDocument } from "../types/types";

interface Props {
  modelValue: boolean;
  application?: InvestorApplication | null;
  batchApplications?: InvestorApplication[];
  loading?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "submit", reviewData: ReviewForm): void;
}

const props = withDefaults(defineProps<Props>(), {
  application: null,
  batchApplications: () => [],
  loading: false
});

const emit = defineEmits<Emits>();

const formRef = ref<FormInstance>();

// 是否为批量审核
const isBatch = computed(() => props.batchApplications.length > 0);

// 对话框标题
const dialogTitle = computed(() => {
  if (isBatch.value) {
    return `批量审核 (${props.batchApplications.length}个申请)`;
  }
  return props.application ? "审核申请" : "审核申请";
});

// 控制对话框显示
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value)
});

// 审核表单
const reviewForm = reactive<ReviewForm>({
  status: 1,
  comment: "",
  documentReviews: []
});

// 表单验证规则
const rules: FormRules = {
  status: [
    { required: true, message: "请选择审核结果", trigger: "change" }
  ],
  comment: [
    {
      validator: (rule, value, callback) => {
        if (reviewForm.status === 3 && !value) {
          callback(new Error("拒绝时必须输入拒绝原因"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
};

// 监听审核状态变化，自动清空评论
watch(
  () => reviewForm.status,
  (newStatus) => {
    if (newStatus === 1) {
      reviewForm.comment = "";
    }
  }
);

// 获取文档状态颜色
const getDocumentStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'success';
    case 'rejected': return 'danger';
    case 'pending': return 'warning';
    default: return 'info';
  }
};

// 获取文档状态文本
const getDocumentStatusText = (status: string) => {
  switch (status) {
    case 'approved': return '已通过';
    case 'rejected': return '已拒绝';
    case 'pending': return '待审核';
    default: return '未知';
  }
};

// 预览文档
const previewDocument = (doc: ApplicationDocument) => {
  // 这里可以实现文档预览功能
  ElMessage.info("文档预览功能开发中...");
};

// 审核文档
const reviewDocument = (doc: ApplicationDocument, status: string) => {
  // 更新文档审核状态
  const existingReview = reviewForm.documentReviews?.find(r => r.documentId === doc.id);
  if (existingReview) {
    existingReview.status = status;
  } else {
    if (!reviewForm.documentReviews) {
      reviewForm.documentReviews = [];
    }
    reviewForm.documentReviews.push({
      documentId: doc.id,
      status,
      comment: ""
    });
  }
  
  ElMessage.success(`文档${status === 'approved' ? '通过' : '拒绝'}审核`);
};

// 处理关闭
const handleClose = () => {
  visible.value = false;
  resetForm();
};

// 重置表单
const resetForm = () => {
  Object.assign(reviewForm, {
    status: 1,
    comment: "",
    documentReviews: []
  });
  formRef.value?.resetFields();
};

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    emit("submit", { ...reviewForm });
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};

// 监听对话框打开，重置表单
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      resetForm();
    }
  }
);
</script>

<style scoped>
.review-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.application-preview,
.batch-preview {
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 6px;
}

.application-preview h4,
.batch-preview h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.preview-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.preview-item {
  display: flex;
  align-items: center;
}

.preview-item .label {
  font-weight: 500;
  color: #606266;
  min-width: 80px;
  margin-right: 8px;
}

.batch-info {
  color: #606266;
}

.review-form {
  flex: 1;
}

.document-review {
  margin-top: 16px;
}

.document-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.document-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #ebeef5;
  border-radius: 6px;
}

.document-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.document-name {
  font-weight: 500;
  color: #303133;
}

.document-actions {
  display: flex;
  gap: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 768px) {
  .preview-content {
    grid-template-columns: 1fr;
  }
  
  .document-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .document-actions {
    align-self: flex-end;
  }
}
</style>