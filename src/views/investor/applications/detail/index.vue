<template>
  <div class="application-detail-page">
    <!-- 加载状态 -->
    <div v-if="state.loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 未找到 -->
    <div v-else-if="state.notFound" class="not-found-container">
      <el-result
        icon="warning"
        title="申请不存在"
        sub-title="请检查申请ID是否正确"
      >
        <template #extra>
          <el-button type="primary" @click="goBack">返回列表</el-button>
        </template>
      </el-result>
    </div>

    <!-- 详情内容 -->
    <div v-else-if="state.application" class="detail-content">
      <!-- 页面头部 -->
      <div class="page-header">
        <el-card shadow="never">
          <div class="header-content">
            <div class="header-left">
              <el-button
                type="primary"
                :icon="ArrowLeft"
                @click="goBack"
              >
                返回列表
              </el-button>
            </div>
            <div class="header-right">
              <el-button
                v-if="state.application.status === 2"
                type="success"
                :icon="Check"
                :loading="actionLoading"
                @click="handleReview(state.application!, 1)"
              >
                审核通过
              </el-button>
              
              <el-button
                v-if="state.application.status === 2"
                type="danger"
                :icon="Close"
                :loading="actionLoading"
                @click="handleReview(state.application!, 3)"
              >
                审核拒绝
              </el-button>
              
              <el-button
                type="warning"
                :icon="DocumentAdd"
                :loading="actionLoading"
                @click="handleRequestDocuments(state.application!)"
              >
                要求补充
              </el-button>
              
              <el-dropdown @command="handleDropdownCommand">
                <el-button type="info" :icon="More">
                  更多操作
                  <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="sendNotification">
                      <el-icon><Message /></el-icon>
                      发送通知
                    </el-dropdown-item>
                    <el-dropdown-item command="addComment">
                      <el-icon><EditPen /></el-icon>
                      添加备注
                    </el-dropdown-item>
                    <el-dropdown-item command="print" divided>
                      <el-icon><Printer /></el-icon>
                      打印申请
                    </el-dropdown-item>
                    <el-dropdown-item command="export">
                      <el-icon><Download /></el-icon>
                      导出申请
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 申请进度 -->
      <div class="progress-section">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">申请进度</span>
            </div>
          </template>
          
          <el-steps :active="getStepActive()" finish-status="success" align-center>
            <el-step title="提交申请" :description="`${state.application.submittedTime}`" />
            <el-step 
              title="资料审核" 
              :description="state.application.status === 2 ? '审核中' : (state.application.reviewTime || '')"
              :status="getStepStatus(1)"
            />
            <el-step 
              title="审核完成" 
              :description="state.application.status === 1 ? '审核通过' : (state.application.status === 3 ? '审核拒绝' : '')"
              :status="getStepStatus(2)"
            />
          </el-steps>
        </el-card>
      </div>

      <!-- 基本信息 -->
      <div class="basic-info-section">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span class="card-title">申请信息</span>
              <el-tag
                :type="getStatusInfo(state.application.status).color"
                effect="light"
                size="large"
              >
                {{ getStatusInfo(state.application.status).label }}
              </el-tag>
            </div>
          </template>
          
          <div class="basic-info-content">
            <div class="applicant-section">
              <el-avatar
                :size="80"
                :src="state.application.user.avatar || getPlaceholderImage(state.application.user.realName || '申请人')"
                :alt="state.application.user.realName || '申请人'"
              />
              <div class="applicant-info">
                <h3>{{ state.application.user.realName || state.application.user.username }}</h3>
                <div class="contact-info">
                  <div class="contact-item">
                    <el-icon><Message /></el-icon>
                    <span>{{ state.application.user.email }}</span>
                  </div>
                  <div v-if="state.application.user.phone" class="contact-item">
                    <el-icon><Phone /></el-icon>
                    <span>{{ state.application.user.phone }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="info-grid">
              <div class="info-row">
                <div class="info-item">
                  <label>投资机构：</label>
                  <span>{{ state.application.investmentInstitution }}</span>
                </div>
                <div class="info-item">
                  <label>投资人类型：</label>
                  <span>{{ state.application.investorType?.name || "-" }}</span>
                </div>
                <div class="info-item">
                  <label>所在地区：</label>
                  <span>{{ state.application.location || state.application.region?.name || "-" }}</span>
                </div>
              </div>
              
              <div class="info-row">
                <div class="info-item">
                  <label>投资金额：</label>
                  <span>
                    <template v-if="state.application.investmentAmountMin || state.application.investmentAmountMax">
                      {{ state.application.investmentAmountMin || 0 }}万 - {{ state.application.investmentAmountMax || "不限" }}万
                    </template>
                    <template v-else>-</template>
                  </span>
                </div>
                <div class="info-item">
                  <label>提交时间：</label>
                  <span>{{ state.application.submittedTime }}</span>
                </div>
                <div class="info-item">
                  <label>更新时间：</label>
                  <span>{{ state.application.updatedTime }}</span>
                </div>
              </div>

              <div v-if="state.application.reviewTime" class="info-row">
                <div class="info-item">
                  <label>审核时间：</label>
                  <span>{{ state.application.reviewTime }}</span>
                </div>
                <div class="info-item">
                  <label>审核员：</label>
                  <span>{{ state.application.reviewer?.realName || state.application.reviewer?.username || "-" }}</span>
                </div>
                <div class="info-item">
                  <label>审核意见：</label>
                  <span>{{ state.application.reviewComment || "-" }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 标签页内容 -->
      <div class="tabs-section">
        <el-card shadow="never">
          <el-tabs v-model="activeTab" type="border-card">
            <!-- 投资偏好 -->
            <el-tab-pane label="投资偏好" name="preferences">
              <div class="preferences-content">
                <div class="preference-item">
                  <h4>关注领域</h4>
                  <div v-if="state.application.focusIndustries && state.application.focusIndustries.length > 0" class="tags-container">
                    <el-tag
                      v-for="industry in state.application.focusIndustries"
                      :key="industry.id"
                      type="primary"
                      effect="light"
                      size="large"
                    >
                      {{ industry.name }}
                    </el-tag>
                  </div>
                  <el-text v-else type="info">暂无设置</el-text>
                </div>

                <div class="preference-item">
                  <h4>偏好阶段</h4>
                  <div v-if="state.application.preferredStages && state.application.preferredStages.length > 0" class="tags-container">
                    <el-tag
                      v-for="stage in state.application.preferredStages"
                      :key="stage.id"
                      type="success"
                      effect="light"
                      size="large"
                    >
                      {{ stage.name }}
                    </el-tag>
                  </div>
                  <el-text v-else type="info">暂无设置</el-text>
                </div>

                <div class="preference-item">
                  <h4>投资偏好</h4>
                  <div class="text-content">
                    <el-text v-if="state.application.investmentPreference" size="large">
                      {{ state.application.investmentPreference }}
                    </el-text>
                    <el-text v-else type="info">暂无描述</el-text>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- 个人简介 -->
            <el-tab-pane label="个人简介" name="bio">
              <div class="bio-content">
                <div class="bio-item">
                  <h4>个人简介</h4>
                  <div class="text-content">
                    <el-text v-if="state.application.bio" size="large">
                      {{ state.application.bio }}
                    </el-text>
                    <el-text v-else type="info">暂无个人简介</el-text>
                  </div>
                </div>

                <div class="bio-item">
                  <h4>机构信息</h4>
                  <div class="text-content">
                    <el-text v-if="state.application.institutionInfo" size="large">
                      {{ state.application.institutionInfo }}
                    </el-text>
                    <el-text v-else type="info">暂无机构信息</el-text>
                  </div>
                </div>

                <div class="bio-item">
                  <h4>描述信息</h4>
                  <div class="text-content">
                    <el-text v-if="state.application.description" size="large">
                      {{ state.application.description }}
                    </el-text>
                    <el-text v-else type="info">暂无描述信息</el-text>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- 申请文档 -->
            <el-tab-pane label="申请文档" name="documents">
              <div class="documents-content">
                <div v-if="state.application.documents && state.application.documents.length > 0" class="documents-grid">
                  <div
                    v-for="doc in state.application.documents"
                    :key="doc.id"
                    class="document-card"
                  >
                    <el-card shadow="hover">
                      <div class="document-header">
                        <div class="document-type">
                          <el-icon><Document /></el-icon>
                          <span>{{ getDocumentTypeText(doc.type) }}</span>
                        </div>
                        <el-tag
                          :type="getDocumentStatusColor(doc.status)"
                          effect="light"
                          size="small"
                        >
                          {{ getDocumentStatusText(doc.status) }}
                        </el-tag>
                      </div>
                      
                      <div class="document-info">
                        <div class="document-name" :title="doc.fileName">
                          {{ doc.fileName }}
                        </div>
                        <div class="document-meta">
                          <span>{{ formatFileSize(doc.fileSize) }}</span>
                          <span>{{ doc.uploadTime }}</span>
                        </div>
                        <div v-if="doc.comment" class="document-comment">
                          <el-text type="warning" size="small">{{ doc.comment }}</el-text>
                        </div>
                      </div>
                      
                      <div class="document-actions">
                        <el-button
                          size="small"
                          type="primary"
                          @click="handlePreviewDocument(doc)"
                        >
                          预览
                        </el-button>
                        <el-button
                          size="small"
                          type="success"
                          @click="handleDownloadDocument(doc)"
                        >
                          下载
                        </el-button>
                      </div>
                    </el-card>
                  </div>
                </div>
                <el-empty v-else description="暂无申请文档" />
              </div>
            </el-tab-pane>

            <!-- 审核记录 -->
            <el-tab-pane label="审核记录" name="history">
              <div v-loading="historyLoading" class="history-content">
                <div v-if="reviewHistory.length > 0" class="timeline-container">
                  <el-timeline>
                    <el-timeline-item
                      v-for="record in reviewHistory"
                      :key="record.id"
                      :timestamp="record.reviewTime"
                      placement="top"
                    >
                      <div class="history-item">
                        <div class="history-header">
                          <el-tag
                            :type="getStatusInfo(record.status).color"
                            effect="light"
                          >
                            {{ getStatusInfo(record.status).label }}
                          </el-tag>
                          <span class="reviewer">{{ record.reviewer.realName || record.reviewer.username }}</span>
                        </div>
                        <div class="history-comment">
                          {{ record.comment }}
                        </div>
                      </div>
                    </el-timeline-item>
                  </el-timeline>
                </div>
                <el-empty v-else description="暂无审核记录" />
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>

    <!-- 文档预览对话框 -->
    <el-dialog
      v-model="previewState.visible"
      :title="`预览: ${previewState.document?.fileName}`"
      width="80%"
      :before-close="closePreview"
    >
      <div v-loading="previewState.loading" class="preview-container">
        <div v-if="previewState.previewUrl && !previewState.loading" class="preview-content">
          <img
            :src="previewState.previewUrl"
            :alt="previewState.document?.fileName"
            style="max-width: 100%; height: auto;"
          />
        </div>
        <el-empty v-else-if="!previewState.loading" description="无法预览此文档" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { 
  ArrowLeft, 
  Check, 
  Close, 
  DocumentAdd,
  More,
  ArrowDown,
  Message,
  Phone,
  EditPen,
  Printer,
  Download,
  Document
} from "@element-plus/icons-vue";
import { APPLICATION_STATUS_MAP, DOCUMENT_TYPE_MAP } from "../types/types";
import { useApplicationDetail } from "./composables/useApplicationDetail";
import { useApplicationDetailActions } from "./composables/useApplicationDetailActions";
import { getPlaceholderImage } from "@/utils/image";

// 当前活跃的标签页
const activeTab = ref("preferences");

// 使用详情数据
const {
  state,
  reviewHistory,
  historyLoading,
  previewState,
  handlePreviewDocument,
  handleDownloadDocument,
  closePreview,
  formatFileSize,
  getDocumentStatusColor,
  getDocumentStatusText,
  refreshData
} = useApplicationDetail();

// 使用操作功能
const {
  actionLoading,
  goBack,
  handleReview,
  handleRequestDocuments,
  handleSendNotification,
  handleAddComment,
  handlePrint,
  handleExport
} = useApplicationDetailActions(refreshData);

// 获取状态信息
const getStatusInfo = (status: number) => {
  return APPLICATION_STATUS_MAP[status] || { label: "未知", color: "info" };
};

// 获取文档类型文本
const getDocumentTypeText = (type: string) => {
  return DOCUMENT_TYPE_MAP[type]?.label || "其他文档";
};

// 获取步骤激活状态
const getStepActive = () => {
  if (!state.application) return 0;
  
  switch (state.application.status) {
    case 0: return 0; // 草稿
    case 2: return 1; // 审核中
    case 1: case 3: return 2; // 已通过/已拒绝
    default: return 0;
  }
};

// 获取步骤状态
const getStepStatus = (step: number) => {
  if (!state.application) return 'wait';
  
  const status = state.application.status;
  
  switch (step) {
    case 1: // 资料审核步骤
      if (status === 2) return 'process'; // 审核中
      if (status === 1) return 'finish';  // 已通过
      if (status === 3) return 'error';   // 已拒绝
      return 'wait';
    case 2: // 审核完成步骤
      if (status === 1) return 'finish';  // 已通过
      if (status === 3) return 'error';   // 已拒绝
      return 'wait';
    default:
      return 'wait';
  }
};

// 处理下拉菜单命令
const handleDropdownCommand = (command: string) => {
  if (!state.application) return;
  
  switch (command) {
    case "sendNotification":
      handleSendNotification(state.application);
      break;
    case "addComment":
      handleAddComment(state.application);
      break;
    case "print":
      handlePrint();
      break;
    case "export":
      handleExport(state.application);
      break;
  }
};
</script>

<style scoped>
.application-detail-page {
  padding: 20px;
}

.loading-container,
.not-found-container {
  padding: 40px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header .header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-right {
  display: flex;
  gap: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.basic-info-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.applicant-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.applicant-info {
  flex: 1;
}

.applicant-info h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  font-size: 14px;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-item label {
  font-weight: 500;
  color: #606266;
  min-width: 100px;
  margin-right: 10px;
}

.info-item span {
  color: #303133;
}

.preferences-content,
.bio-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
}

.preference-item,
.bio-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preference-item h4,
.bio-item h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.text-content {
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 6px;
  line-height: 1.6;
}

.documents-content {
  padding: 20px;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.document-card {
  height: fit-content;
}

.document-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.document-type {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #303133;
}

.document-info {
  margin-bottom: 12px;
}

.document-name {
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
  word-break: break-all;
}

.document-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.document-comment {
  padding: 8px;
  background-color: #fef0f0;
  border-radius: 4px;
  border-left: 3px solid #f56c6c;
}

.document-actions {
  display: flex;
  gap: 8px;
}

.history-content {
  padding: 20px;
  min-height: 200px;
}

.timeline-container {
  max-width: 800px;
}

.history-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reviewer {
  font-weight: 500;
  color: #303133;
}

.history-comment {
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 6px;
  color: #606266;
  line-height: 1.5;
}

.preview-container {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-content {
  text-align: center;
}

@media (max-width: 768px) {
  .applicant-section {
    flex-direction: column;
    text-align: center;
  }
  
  .info-row {
    grid-template-columns: 1fr;
  }
  
  .documents-grid {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    gap: 10px;
  }
  
  .header-right {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>