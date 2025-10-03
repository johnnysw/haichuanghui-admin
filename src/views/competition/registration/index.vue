<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { deviceDetection } from "@pureadmin/utils";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
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
  RegistrationQueryParams,
} from "./types/types";

import Refresh from "@iconify-icons/ep/refresh";
import Check from "@iconify-icons/ep/check";
import Close from "@iconify-icons/ep/close";
import View from "@iconify-icons/ep/view";

defineOptions({
  name: "CompetitionRegistration",
});

const route = useRoute();
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
  handleCurrentChange,
} = useRegistrationTable();

const {
  form,
  formRef,
  statusOptions,
  resetForm,
} = useRegistrationFilter();

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
  { label: "已取消", value: summary.value.cancelled, type: "info" },
]);

const buildQueryParams = (): RegistrationQueryParams => {
  const params: RegistrationQueryParams = {
    pageNum: pagination.currentPage,
    pageSize: pagination.pageSize,
  };

  const status = form.status;
  if (status !== "" && status !== undefined && status !== null) {
    params.status = Number(status);
  }

  const teamName = form.teamName.trim();
  if (teamName) params.teamName = teamName;

  const contactName = form.contactName.trim();
  if (contactName) params.contactName = contactName;

  const contactPhone = form.contactPhone.trim();
  if (contactPhone) params.contactPhone = contactPhone;

  if (form.dateRange.length === 2) {
    params.startTime = form.dateRange[0];
    params.endTime = form.dateRange[1];
  }

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
    const payload = (res as any)?.data?.data ?? res.data ?? (res as any)?.data ?? res;
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
  const current = dataList.value.find((item) => item.id === selectedRow.value!.id);
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
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      label-width="80px"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择状态"
          clearable
          class="!w-[180px]"
        >
          <el-option
            v-for="option in statusOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="团队名称" prop="teamName">
        <el-input v-model.trim="form.teamName" placeholder="请输入团队名称" />
      </el-form-item>
      <el-form-item label="联系人" prop="contactName">
        <el-input v-model.trim="form.contactName" placeholder="请输入联系人" />
      </el-form-item>
      <el-form-item label="手机号" prop="contactPhone">
        <el-input v-model.trim="form.contactPhone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="报名时间" prop="dateRange">
        <el-date-picker
          v-model="form.dateRange"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          range-separator="至"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY-MM-DD HH:mm"
          class="!w-[360px]"
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
        <el-button :icon="useRenderIcon(Refresh)" @click="onReset">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <div class="summary-wrapper">
      <div
        v-for="card in summaryCards"
        :key="card.label"
        class="summary-card"
      >
        <div class="summary-label">{{ card.label }}</div>
        <div class="summary-value" :class="`summary-${card.type}`">
          {{ card.value }}
        </div>
      </div>
      <div class="summary-card">
        <div class="summary-label">总报名数</div>
        <div class="summary-value">{{ pagination.total }}</div>
      </div>
    </div>

    <PureTableBar
      :class="[isShow && !deviceDetection() ? '!w-[60vw]' : 'w-full']"
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
            color: 'var(--el-text-color-primary)',
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
              @click="handleApprove(row)">
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

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

.summary-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.summary-card {
  background: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.summary-value {
  font-size: 22px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.summary-warning {
  color: var(--el-color-warning);
}

.summary-success {
  color: var(--el-color-success);
}

.summary-danger {
  color: var(--el-color-danger);
}

.summary-info {
  color: var(--el-color-info);
}
</style>
