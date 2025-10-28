<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { deviceDetection } from "@pureadmin/utils";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { IconifyIconOffline } from "@/components/ReIcon";
import { PureTableBar } from "@/components/RePureTableBar";
import { message } from "@/utils/message";

import { useRegistrationTable } from "./composables/useRegistrationTable";
import { useRegistrationFilter } from "./composables/useRegistrationFilter";
import { useRegistrationActions } from "./composables/useRegistrationActions";
import { getRegistrationDetail } from "./api";
import RegistrationDetailDrawer from "./components/RegistrationDetailDrawer.vue";
import ProjectDetailModal from "./components/ProjectDetailModal.vue";
import type {
  RegistrationListItem,
  RegistrationDetail,
  RegistrationQueryParams
} from "./types/types";

import Check from "@iconify-icons/ep/check";
import Close from "@iconify-icons/ep/close";
import View from "@iconify-icons/ep/view";
import ArrowLeft from "@iconify-icons/ep/arrow-left";
import Warning from "@iconify-icons/ep/warning";
import CircleCheck from "@iconify-icons/ep/circle-check";
import CircleClose from "@iconify-icons/ep/circle-close";
import InfoFilled from "@iconify-icons/ep/info-filled";

defineOptions({
  name: "CompetitionRegistration"
});

const route = useRoute();
const router = useRouter();
const competitionId = ref(Number(route.params.id) || 0);

const {
  dataList,
  summary,
  loading,
  isShow,
  pagination,
  columns,
  fetchData,
  handleSizeChange,
  handleCurrentChange
} = useRegistrationTable();

const { form, formRef, statusOptions, resetForm } = useRegistrationFilter();

const contentRef = ref();

const { approveRegistration, rejectRegistration } = useRegistrationActions();

const detailVisible = ref(false);
const detailLoading = ref(false);
const detail = ref<RegistrationDetail | null>(null);
const selectedRow = ref<RegistrationListItem | null>(null);
const projectModalVisible = ref(false);

const summaryCards = computed(() => [
  { label: "待审核", value: summary.value.pending, type: "warning" },
  { label: "已通过", value: summary.value.approved, type: "success" },
  { label: "已拒绝", value: summary.value.rejected, type: "danger" },
  { label: "已取消", value: summary.value.cancelled, type: "info" }
]);

const buildQueryParams = (): RegistrationQueryParams => {
  const params: RegistrationQueryParams = {
    pageNum: pagination.currentPage,
    pageSize: pagination.pageSize
  };

  const status = form.status;
  if (status !== "" && status !== undefined && status !== null) {
    params.status = Number(status);
  }

  const projectStage = form.projectStage.trim();
  if (projectStage) params.projectStage = projectStage;

  const contactName = form.contactName.trim();
  if (contactName) params.contactName = contactName;

  const contactPhone = form.contactPhone.trim();
  if (contactPhone) params.contactPhone = contactPhone;

  return params;
};

const fetchList = async () => {
  if (!competitionId.value) return;
  await fetchData(competitionId.value, buildQueryParams());
};

const onSearch = async (resetPage = false) => {
  if (resetPage) {
    pagination.currentPage = 1;
  }
  await fetchList();
};

const onReset = async () => {
  resetForm(formRef.value);
  await onSearch(true);
};

const onPageSizeChange = async (val: number) => {
  handleSizeChange(val);
  pagination.currentPage = 1;
  await fetchList();
};

const onPageCurrentChange = async (val: number) => {
  handleCurrentChange(val);
  await fetchList();
};

const loadDetail = async (id: number) => {
  try {
    detailLoading.value = true;
    const res = await getRegistrationDetail(id);
    const payload =
      (res as any)?.data?.data ?? res.data ?? (res as any)?.data ?? res;
    detail.value = payload || null;
  } catch (error: any) {
    detail.value = null;
    message(error?.message || "获取报名详情失败", { type: "error" });
  } finally {
    detailLoading.value = false;
  }
};

const openDetail = async (row: RegistrationListItem) => {
  selectedRow.value = row;
  detailVisible.value = true;
  await loadDetail(row.id);
};

const refreshCurrentRow = () => {
  if (!selectedRow.value) return;
  const current = dataList.value.find(
    item => item.id === selectedRow.value!.id
  );
  if (current) {
    selectedRow.value = current;
  }
};

const handleApprove = async (row: RegistrationListItem) => {
  const success = await approveRegistration(row);
  if (!success) return;
  await fetchList();
  refreshCurrentRow();
  if (detailVisible.value && selectedRow.value?.id === row.id) {
    await loadDetail(row.id);
  }
};

const handleReject = async (row: RegistrationListItem) => {
  const success = await rejectRegistration(row);
  if (!success) return;
  await fetchList();
  refreshCurrentRow();
  if (detailVisible.value && selectedRow.value?.id === row.id) {
    await loadDetail(row.id);
  }
};

const handleApproveFromDrawer = () => {
  if (selectedRow.value) {
    handleApprove(selectedRow.value);
  }
};

const handleRejectFromDrawer = () => {
  if (selectedRow.value) {
    handleReject(selectedRow.value);
  }
};

const handleOpenProjectModal = (detailPayload: RegistrationDetail) => {
  if (!detailPayload.project) {
    message("该报名未关联项目信息", { type: "warning" });
    return;
  }
  detail.value = detailPayload;
  projectModalVisible.value = true;
};

onMounted(async () => {
  if (!competitionId.value) {
    message("缺少有效的大赛 ID", { type: "error" });
    return;
  }
  await onSearch(true);
});
</script>

<template>
  <div class="registration-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-page-header @back="router.back()">
        <template #content>
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center">
              <span class="text-lg font-medium">大赛报名管理</span>
            </div>
          </div>
        </template>
        <template #extra>
          <!-- 统计信息卡片 -->
          <div class="summary-cards-in-header">
            <!-- 待审核 -->
            <div class="summary-card-small">
              <div class="summary-icon-small summary-icon-warning">
                <IconifyIconOffline :icon="Warning" class="icon-small" />
              </div>
              <div class="summary-content-small">
                <div class="summary-value-small">{{ summary.pending }}</div>
                <div class="summary-label-small">待审核</div>
              </div>
            </div>

            <!-- 已通过 -->
            <div class="summary-card-small">
              <div class="summary-icon-small summary-icon-success">
                <IconifyIconOffline :icon="CircleCheck" class="icon-small" />
              </div>
              <div class="summary-content-small">
                <div class="summary-value-small">{{ summary.approved }}</div>
                <div class="summary-label-small">已通过</div>
              </div>
            </div>

            <!-- 已拒绝 -->
            <div class="summary-card-small">
              <div class="summary-icon-small summary-icon-danger">
                <IconifyIconOffline :icon="CircleClose" class="icon-small" />
              </div>
              <div class="summary-content-small">
                <div class="summary-value-small">{{ summary.rejected }}</div>
                <div class="summary-label-small">已拒绝</div>
              </div>
            </div>

            <!-- 已取消 -->
            <div class="summary-card-small">
              <div class="summary-icon-small summary-icon-info">
                <IconifyIconOffline :icon="InfoFilled" class="icon-small" />
              </div>
              <div class="summary-content-small">
                <div class="summary-value-small">{{ summary.cancelled }}</div>
                <div class="summary-label-small">已取消</div>
              </div>
            </div>

            <!-- 总报名数 -->
            <div class="summary-card-small">
              <div class="summary-icon-small summary-icon-primary">
                <IconifyIconOffline :icon="Check" class="icon-small" />
              </div>
              <div class="summary-content-small">
                <div class="summary-value-small">{{ pagination.total }}</div>
                <div class="summary-label-small">总报名数</div>
              </div>
            </div>
          </div>
        </template>
      </el-page-header>
    </div>

    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      label-width="80px"
      class="search-form bg-bg_color w-[99/100] py-[12px] mt-2 overflow-auto"
    >
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择状态"
          clearable
          class="!w-[140px]"
        >
          <el-option
            v-for="option in statusOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="项目阶段" prop="projectStage">
        <el-input
          v-model.trim="form.projectStage"
          placeholder="请输入项目阶段"
          class="!w-[140px]"
        />
      </el-form-item>
      <el-form-item label="联系人" prop="contactName">
        <el-input
          v-model.trim="form.contactName"
          placeholder="请输入联系人"
          class="!w-[120px]"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="contactPhone">
        <el-input
          v-model.trim="form.contactPhone"
          placeholder="请输入手机号"
          class="!w-[140px]"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="loading"
          @click="onSearch(true)"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon('ri:refresh-line')" @click="onReset">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <div
      ref="contentRef"
      :class="['grid', 'grid-cols-1', 'md:grid-cols-12', 'gap-2', 'w-full']"
    >
      <div
        :class="[isShow ? 'md:col-span-7 col-span-12' : 'col-span-12']"
        class="w-full min-w-0"
      >
        <PureTableBar
          class="w-full min-w-0"
          style="transition: width 220ms cubic-bezier(0.4, 0, 0.2, 1)"
          title="大赛报名列表"
          :columns="columns"
          @refresh="fetchList"
        >
          <template #default="{ size, dynamicColumns }">
            <pure-table
              align-whole="center"
              show-overflow-tooltip
              table-layout="auto"
              :loading="loading"
              :size="size"
              adaptive
              :adaptive-config="{ offsetBottom: 108 }"
              :data="dataList"
              :columns="dynamicColumns"
              :pagination="{ ...pagination, size }"
              :header-cell-style="{
                background: 'var(--el-fill-color-light)',
                color: 'var(--el-text-color-primary)'
              }"
              @page-size-change="onPageSizeChange"
              @page-current-change="onPageCurrentChange"
            >
              <template #operation="{ row }">
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(View)"
                  @click="openDetail(row)"
                >
                  详情
                </el-button>
                <el-button
                  v-if="row.status === 1"
                  class="reset-margin"
                  link
                  type="success"
                  :size="size"
                  :icon="useRenderIcon(Check)"
                  @click="handleApprove(row)"
                >
                  通过
                </el-button>
                <el-button
                  v-if="row.status === 1"
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :icon="useRenderIcon(Close)"
                  @click="handleReject(row)"
                >
                  拒绝
                </el-button>
              </template>
            </pure-table>
          </template>
        </PureTableBar>
      </div>
    </div>

    <RegistrationDetailDrawer
      v-model="detailVisible"
      :loading="detailLoading"
      :detail="detail"
      @approve="handleApproveFromDrawer"
      @reject="handleRejectFromDrawer"
      @open-project="handleOpenProjectModal"
    />

    <ProjectDetailModal
      v-model="projectModalVisible"
      :project="detail?.project || null"
    />
  </div>
</template>

<style scoped lang="scss">
.registration-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 页面头部样式 */
.page-header {
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 0;
    margin-right: 16px;
  }

  :deep(.el-form-item:last-child) {
    margin-right: 0;
  }
}

.summary-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.summary-card {
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
}

.summary-icon {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  .icon {
    font-size: 28px;
  }

  &.summary-icon-warning {
    background: var(--el-color-warning-light-9);
    color: var(--el-color-warning);
  }

  &.summary-icon-success {
    background: var(--el-color-success-light-9);
    color: var(--el-color-success);
  }

  &.summary-icon-danger {
    background: var(--el-color-danger-light-9);
    color: var(--el-color-danger);
  }

  &.summary-icon-info {
    background: var(--el-color-info-light-9);
    color: var(--el-color-info);
  }

  &.summary-icon-primary {
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }
}

.summary-content {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.summary-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.summary-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

/* 页面头部统计卡片样式 */
.summary-cards-in-header {
  display: flex;
  gap: 12px;
  align-items: center;
}

.summary-card-small {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  transition: all 0.2s;
}

.summary-card-small:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.summary-icon-small {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-small {
  font-size: 16px;
}

.summary-icon-small.summary-icon-warning {
  background: var(--el-color-warning-light-9);
  color: var(--el-color-warning);
}

.summary-icon-small.summary-icon-success {
  background: var(--el-color-success-light-9);
  color: var(--el-color-success);
}

.summary-icon-small.summary-icon-danger {
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.summary-icon-small.summary-icon-info {
  background: var(--el-color-info-light-9);
  color: var(--el-color-info);
}

.summary-icon-small.summary-icon-primary {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.summary-content-small {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.summary-label-small {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  font-weight: 500;
  line-height: 1.2;
}

.summary-value-small {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  line-height: 1.2;
}
</style>
