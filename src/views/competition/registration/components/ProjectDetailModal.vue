<script setup lang="ts">
import { computed } from "vue";
import type { ProjectSummary } from "../types/types";

interface Props {
  modelValue: boolean;
  project: ProjectSummary | null;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  project: null
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value)
});

const handleClose = () => {
  visible.value = false;
};

const formatNullable = (value?: string | number | null) =>
  value !== undefined && value !== null && String(value).trim() !== ""
    ? String(value)
    : "--";

const formatTitle = (project: ProjectSummary | null) => {
  if (!project) return "项目详情";
  const parts = [project.name, project.companyName, project.industry?.name];
  return parts.filter(Boolean).join(" · ") || "项目详情";
};

const basicItems = computed(() => {
  const project = props.project;
  if (!project) return [];
  return [
    { label: "项目名称", value: project.name },
    { label: "所属公司", value: project.companyName },
    { label: "所属行业", value: project.industry?.name },
    { label: "融资阶段", value: project.fundingStage?.name },
    { label: "所在地区", value: project.region?.name || project.location },
    { label: "项目简介", value: project.shortDescription },
    { label: "估值", value: project.valuation },
    { label: "融资金额", value: project.fundingAmount },
    { label: "融资需求", value: project.fundingNeeds },
    { label: "成立日期", value: project.foundingDate },
    { label: "官网", value: project.website },
    { label: "地址", value: project.address },
    { label: "浏览量", value: project.viewCount?.toString() },
    { label: "点赞数", value: project.likeCount?.toString() },
    {
      label: "状态",
      value: project.status ? String(project.status) : undefined
    },
    { label: "商业计划书链接", value: project.businessPlanUrl },
    { label: "创建时间", value: project.createdTime },
    { label: "更新时间", value: project.updatedTime }
  ];
});

const contactItems = computed(() => {
  const project = props.project;
  if (!project) return [];
  return [
    { label: "联系人", value: project.contactPerson },
    { label: "联系人职位", value: project.contactPosition },
    { label: "联系电话", value: project.contactPhone },
    { label: "联系邮箱", value: project.contactEmail }
  ];
});

const richFields = computed(() => {
  const project = props.project;
  if (!project) return [];
  return [
    {
      label: "项目介绍",
      value:
        project.introduction || project.fullDescription || project.description
    },
    { label: "核心技术", value: project.coreTechnology },
    { label: "商业模式", value: project.businessModel },
    { label: "团队情况", value: project.teamInfo },
    { label: "融资历史", value: project.fundingHistory },
    { label: "发展规划", value: project.developmentPlan },
    { label: "市场分析", value: project.marketAnalysis },
    { label: "竞争优势", value: project.competitiveAdvantage }
  ].filter(item => !!item.value);
});

const fileItems = computed(() => {
  const project = props.project;
  if (!project) return [];
  return [
    {
      label: "商业计划书",
      value: project.businessPlanFile?.name,
      url: project.businessPlanFile?.url || project.businessPlanUrl
    },
    {
      label: "项目演示文档",
      value: project.presentationFile?.name,
      url: project.presentationFile?.url
    },
    {
      label: "Logo 文件",
      value: project.logoFile?.name,
      url: project.logoFile?.url
    }
  ].filter(item => item.value || item.url);
});
</script>

<template>
  <el-dialog
    v-model="visible"
    :append-to-body="true"
    fullscreen
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    custom-class="project-detail-modal"
    @close="handleClose"
  >
    <template #header>
      <div class="modal-header">
        <div class="modal-title">{{ formatTitle(project) }}</div>
        <div v-if="project?.shortDescription" class="modal-subtitle">
          {{ project?.shortDescription }}
        </div>
      </div>
    </template>

    <div v-if="project" class="modal-body">
      <el-row :gutter="16">
        <el-col :xs="24" :sm="24" :md="12">
          <el-card shadow="never" class="project-card">
            <template #header>
              <div class="card-header">基础信息</div>
            </template>
            <div class="info-grid">
              <div
                v-for="item in basicItems"
                :key="item.label"
                class="info-item"
              >
                <span class="info-label">{{ item.label }}</span>
                <span class="info-value">{{ formatNullable(item.value) }}</span>
              </div>
            </div>
          </el-card>

          <el-card
            v-if="contactItems.length"
            shadow="never"
            class="project-card"
          >
            <template #header>
              <div class="card-header">联系人信息</div>
            </template>
            <div class="info-grid">
              <div
                v-for="item in contactItems"
                :key="item.label"
                class="info-item"
              >
                <span class="info-label">{{ item.label }}</span>
                <span class="info-value">{{ formatNullable(item.value) }}</span>
              </div>
            </div>
          </el-card>

          <el-card v-if="fileItems.length" shadow="never" class="project-card">
            <template #header>
              <div class="card-header">附件与链接</div>
            </template>
            <div class="file-list">
              <div
                v-for="item in fileItems"
                :key="item.label"
                class="file-item"
              >
                <div class="file-info">
                  <span class="file-label">{{ item.label }}</span>
                  <span class="file-name">{{
                    formatNullable(item.value)
                  }}</span>
                </div>
                <el-link
                  v-if="item.url"
                  :href="item.url"
                  type="primary"
                  target="_blank"
                >
                  查看
                </el-link>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12">
          <el-card
            v-for="field in richFields"
            :key="field.label"
            shadow="never"
            class="project-card"
          >
            <template #header>
              <div class="card-header">{{ field.label }}</div>
            </template>
            <div class="rich-text">{{ field.value }}</div>
          </el-card>

          <el-empty
            v-if="basicItems.length === 0 && richFields.length === 0"
            description="暂无更多项目信息"
          />
        </el-col>
      </el-row>
    </div>
    <div v-else class="modal-empty">
      <el-empty description="未找到项目信息" />
    </div>

    <template #footer>
      <div class="modal-footer">
        <el-button type="primary" @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.project-detail-modal {
  .el-dialog__header {
    margin: 0;
    padding: 16px 20px 12px;
    border-bottom: 1px solid var(--el-border-color-light, #e4e7ed);
  }
}

.modal-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.modal-subtitle {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.modal-body {
  padding: 0 12px 16px;
  max-height: calc(100vh - 160px);
  overflow-y: auto;
}

.modal-body :deep(.el-card) {
  margin-bottom: 16px;
}

.project-card {
  border-radius: 10px;
  :deep(.el-card__header) {
    padding: 12px 16px;
  }
}

.card-header {
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.info-value {
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.rich-text {
  font-size: 14px;
  color: var(--el-text-color-primary);
  line-height: 1.6;
  white-space: pre-wrap;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.file-name {
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.modal-footer {
  text-align: right;
}

.modal-empty {
  padding: 32px 0;
}
</style>
