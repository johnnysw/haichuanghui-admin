<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useRegistrationTable } from "./composables/useRegistrationTable";
import { useRegistrationFilter } from "./composables/useRegistrationFilter";
import { useRegistrationActions } from "./composables/useRegistrationActions";
import { deviceDetection } from "@pureadmin/utils";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import Refresh from "@iconify-icons/ep/refresh";
import Check from "@iconify-icons/ep/check";
import Close from "@iconify-icons/ep/close";

defineOptions({
  name: "CompetitionRegistration"
});

const route = useRoute();
const formRef = ref();
const tableRef = ref();

// 获取大赛ID
const competitionId = ref(Number(route.params.competitionId) || 0);

// 使用composables
const { dataList, loading, isShow, pagination, columns, statusMap, fetchData, handleSizeChange, handleCurrentChange } = useRegistrationTable();
const { form, formRef: filterFormRef, resetForm } = useRegistrationFilter();
const { approveRegistration, rejectRegistration } = useRegistrationActions();

// 将filterFormRef赋值给formRef以保持一致性
formRef.value = filterFormRef.value;

// 处理搜索功能
const onSearch = () => {
  const params = {
    ...form,
    pageNum: pagination.currentPage,
    pageSize: pagination.pageSize
  };
  if (competitionId.value) {
    fetchData(competitionId.value, params);
  }
};

// 组件挂载时获取数据
onMounted(() => {
  if (competitionId.value) {
    onSearch();
  }
});

// 处理分页变化
const handleSelectionChange = (val) => {
  console.log("handleSelectionChange", val);
};
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择状态"
          clearable
          class="!w-[180px]"
        >
          <el-option label="全部状态" value="" />
          <el-option label="待审核" value="0" />
          <el-option label="已通过" value="1" />
          <el-option label="已拒绝" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="loading"
          @click="onSearch"
        >
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <PureTableBar
      :class="[isShow && !deviceDetection() ? '!w-[60vw]' : 'w-full']"
      title="大赛报名列表"
      :columns="columns"
      @refresh="onSearch"
    >
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="loading"
          :size="size"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="{ ...pagination, size }"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @selection-change="handleSelectionChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #operation="{ row }">
            <el-button
              v-if="row.status === 0"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(Check)"
              @click="approveRegistration(row)"
            >
              通过
            </el-button>
            <el-button
              v-if="row.status === 0"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon(Close)"
              @click="rejectRegistration(row)"
            >
              拒绝
            </el-button>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
