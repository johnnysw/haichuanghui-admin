<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import {
  REGISTRATION_STATUS_MAP,
  type RegistrationDetail
} from "../types/types";

interface Props {
  modelValue: boolean;
  loading?: boolean;
  detail: RegistrationDetail | null;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  detail: null
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "approve", detail: RegistrationDetail): void;
  (e: "reject", detail: RegistrationDetail): void;
  (e: "open-project", detail: RegistrationDetail): void;
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value)
});

const isPending = computed(() => props.detail?.status === 1);

const statusMeta = computed(() => {
  if (!props.detail) return null;
  return REGISTRATION_STATUS_MAP[
    props.detail.status as keyof typeof REGISTRATION_STATUS_MAP
  ];
});

const attachments = computed(() => props.detail?.attachments ?? []);

const attachmentTypeMap: Record<string, string> = {
  businessPlanFile: "商业计划书",
  businessPlanUrl: "计划书链接",
  demoFile: "演示材料"
};
const detailTitle = computed(() => {
  const d = props.detail;
  if (!d) return "--";
  return d.teamName || d.companyName || d.projectName || d.contactName || "--";
});

const formatTime = (value?: string | null) =>
  value ? dayjs(value).format("YYYY-MM-DD HH:mm") : "--";

const handleClose = () => emit("update:modelValue", false);

const handleApprove = () => {
  if (props.detail) {
    emit("approve", props.detail);
  }
};

const handleReject = () => {
  if (props.detail) {
    emit("reject", props.detail);
  }
};

const router = useRouter();

const handleOpenProject = () => {
  if (!props.detail?.project?.id) return;
  // 跳转到项目详情页
  router.push(`/project/detail/${props.detail.project.id}`);
};

// 项目信息展开/折叠状态
const projectExpanded = ref(false);
</script>

<template>
  <el-drawer
    v-model="visible"
    size="60%"
    :destroy-on-close="true"
    append-to-body
    title="报名详情"
    @close="handleClose"
  >
    <div v-loading="loading" class="detail-container">
      <el-empty v-if="!loading && !detail" description="暂无数据" />

      <template v-else>
        <div class="detail-header">
          <div>
            <div class="detail-title">
              {{ detailTitle }}
              <el-tag
                v-if="statusMeta"
                :type="statusMeta.type"
                class="title-status-tag"
              >
                {{ statusMeta.text }}
              </el-tag>
            </div>
            <div class="detail-subtitle">
              报名时间：{{ formatTime(detail?.createdTime) }}
            </div>
          </div>
        </div>

        <el-card shadow="never" class="detail-card">
          <template #header>
            <div class="card-header">
              <span>基本信息</span>
            </div>
          </template>
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">团队名称</span>
                <span class="info-value">{{ detail?.teamName || "--" }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">公司/机构</span>
                <span class="info-value">{{
                  detail?.companyName || "--"
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">联系人</span>
                <span class="info-value">{{
                  detail?.contactName || "--"
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">手机号</span>
                <span class="info-value">{{
                  detail?.contactPhone || "--"
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">邮箱</span>
                <span class="info-value">{{
                  detail?.contactEmail || "--"
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">职位</span>
                <span class="info-value">{{ detail?.position || "--" }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">团队规模</span>
                <span class="info-value">{{ detail?.teamSize || "--" }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">创业经验</span>
                <span class="info-value">{{
                  detail?.startupExperience || "--"
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">所属行业</span>
                <span class="info-value">{{
                  detail?.industryName || detail?.industry?.name || "--"
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">登录账号</span>
                <span class="info-value">{{
                  detail?.account?.username || "--"
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">账号邮箱</span>
                <span class="info-value">{{
                  detail?.account?.email || "--"
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">账号手机</span>
                <span class="info-value">{{
                  detail?.account?.phone || "--"
                }}</span>
              </div>
            </div>
          </div>
        </el-card>

        <el-card shadow="never" class="detail-card">
          <template #header>
            <div class="card-header">
              <span>项目信息</span>
              <el-button
                v-if="detail?.project"
                type="primary"
                link
                @click="handleOpenProject"
              >
                查看项目详情
              </el-button>
            </div>
          </template>
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">项目名称</span>
                <span class="info-value">{{
                  detail?.project?.name || detail?.projectName || "--"
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">项目所属公司</span>
                <span class="info-value">{{
                  detail?.project?.companyName || detail?.companyName || "--"
                }}</span>
              </div>
              <div class="info-item info-span-2">
                <span class="info-label">项目简介</span>
                <span class="info-value text-preline">
                  {{
                    detail?.project?.shortDescription ||
                    detail?.projectDescription ||
                    "--"
                  }}
                </span>
              </div>

              <!-- 可折叠的详细信息 -->
              <template v-if="projectExpanded">
                <div
                  v-if="detail?.project?.introduction"
                  class="info-item info-span-2"
                >
                  <span class="info-label">项目介绍</span>
                  <span class="info-value text-preline">{{
                    detail?.project?.introduction
                  }}</span>
                </div>
                <div
                  v-if="detail?.project?.coreTechnology"
                  class="info-item info-span-2"
                >
                  <span class="info-label">核心技术</span>
                  <span class="info-value text-preline">{{
                    detail?.project?.coreTechnology
                  }}</span>
                </div>
                <div
                  v-if="detail?.project?.businessModel"
                  class="info-item info-span-2"
                >
                  <span class="info-label">商业模式</span>
                  <span class="info-value text-preline">{{
                    detail?.project?.businessModel
                  }}</span>
                </div>
                <div
                  v-if="detail?.project?.teamInfo"
                  class="info-item info-span-2"
                >
                  <span class="info-label">团队情况</span>
                  <span class="info-value text-preline">{{
                    detail?.project?.teamInfo
                  }}</span>
                </div>
                <div
                  v-if="detail?.project?.marketAnalysis"
                  class="info-item info-span-2"
                >
                  <span class="info-label">市场分析</span>
                  <span class="info-value text-preline">{{
                    detail?.project?.marketAnalysis
                  }}</span>
                </div>
                <div
                  v-if="detail?.project?.competitiveAdvantage"
                  class="info-item info-span-2"
                >
                  <span class="info-label">竞争优势</span>
                  <span class="info-value text-preline">{{
                    detail?.project?.competitiveAdvantage
                  }}</span>
                </div>
              </template>
            </div>

            <!-- 折叠/展开按钮 -->
            <div class="collapse-toggle">
              <el-button
                type="primary"
                link
                @click="projectExpanded = !projectExpanded"
              >
                {{ projectExpanded ? "收起" : "展开" }}
                <el-icon :class="{ 'rotate-icon': projectExpanded }">
                  <arrow-down />
                </el-icon>
              </el-button>
            </div>
          </div>
        </el-card>

        <el-card shadow="never" class="detail-card">
          <template #header>
            <div class="card-header">
              <span>审核记录</span>
            </div>
          </template>
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">创建时间</span>
                <span class="info-value">{{
                  formatTime(detail?.createdTime)
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">审核时间</span>
                <span class="info-value">{{
                  formatTime(detail?.reviewTime)
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">审核人</span>
                <span class="info-value">{{
                  detail?.reviewer?.name || "--"
                }}</span>
              </div>
              <div class="info-item info-span-2">
                <span class="info-label">审核意见</span>
                <span class="info-value text-preline">{{
                  detail?.reviewComment || "--"
                }}</span>
              </div>
            </div>
          </div>
        </el-card>

        <el-card shadow="never" class="detail-card">
          <template #header>
            <div class="card-header">
              <span>附件材料</span>
            </div>
          </template>
          <div class="card-body">
            <el-empty
              v-if="attachments.length === 0"
              description="暂无附件"
              :image-size="80"
            />
            <el-timeline v-else>
              <el-timeline-item
                v-for="item in attachments"
                :key="item.id"
                type="primary"
                :timestamp="attachmentTypeMap[item.type]"
              >
                <div class="attachment-item">
                  <div class="attachment-main">
                    <span class="attachment-name">{{ item.name }}</span>
                  </div>
                  <div class="attachment-actions">
                    <el-link
                      v-if="item.downloadUrl"
                      :href="item.downloadUrl"
                      type="primary"
                      target="_blank"
                      >下载</el-link
                    >
                    <el-tag v-else type="danger" size="small">文件缺失</el-tag>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>

        <footer v-if="isPending" class="detail-footer">
          <el-button type="success" @click="handleApprove">通过</el-button>
          <el-button type="danger" @click="handleReject">拒绝</el-button>
          <el-button @click="handleClose">关闭</el-button>
        </footer>
        <footer v-else class="detail-footer">
          <el-button type="primary" @click="handleClose">关闭</el-button>
        </footer>
      </template>
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">
.detail-container {
  min-height: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 12px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 8px 4px 0;
}

.detail-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  display: flex;
  align-items: center;
  gap: 12px;
}

.detail-subtitle {
  margin-top: 6px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.detail-card {
  border-radius: 10px;
  :deep(.el-card__body) {
    padding: 16px;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px 16px;
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
  word-break: break-word;
}

.info-span-2 {
  grid-column: span 2;
}

.text-preline {
  white-space: pre-line;
}

.attachment-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.attachment-name {
  color: var(--el-text-color-primary);
}

.attachment-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.attachment-title {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}

.attachment-description {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

.attachment-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
}

.attachment-required {
  align-self: flex-end;
}

.detail-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: auto;
}

@media (max-width: 768px) {
  .detail-title {
    font-size: 18px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-span-2 {
    grid-column: span 1;
  }
}

/* 覆盖 el-empty 样式，删除 padding */
:deep(.el-empty) {
  padding: 0 !important;
}

/* 折叠/展开按钮样式 */
.collapse-toggle {
  display: flex;
  justify-content: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.collapse-toggle .el-button {
  font-size: 13px;
}

.collapse-toggle .el-icon {
  margin-left: 4px;
  transition: transform 0.3s ease;
}

.rotate-icon {
  transform: rotate(180deg);
}

/* 标题中的状态标签样式 */
.title-status-tag {
  font-size: 12px;
  padding: 2px 8px;
  height: auto;
  line-height: 1.2;
}
</style>
