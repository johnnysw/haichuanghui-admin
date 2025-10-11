<template>
  <div class="member-list">
    <!-- 搜索表单 -->
    <el-card class="box-card mb-4" shadow="never">
      <el-form
        ref="formRef"
        :model="filterForm"
        :inline="true"
        @submit.prevent="handleSearch"
      >
        <el-form-item label="搜索：" prop="search">
          <el-input
            v-model="filterForm.search"
            placeholder="用户名/昵称/邮箱/手机号"
            clearable
            class="!w-[240px]"
            @clear="handleSearch"
          />
        </el-form-item>

        <el-form-item label="状态：" prop="status">
          <el-select
            v-model="filterForm.status"
            placeholder="请选择状态"
            clearable
            class="!w-[120px]"
            @change="handleFilterChange"
          >
            <el-option
              v-for="option in statusOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch"> 查询 </el-button>
          <el-button @click="handleReset"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <div class="w-full">
      <PureTableBar
        class="w-full min-w-0"
        title="会员列表"
        :columns="columns"
        @refresh="getMemberData"
      >
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="tableRef"
            adaptive
            :adaptiveConfig="{ offsetBottom: 120 }"
            align-whole="center"
            row-key="id"
            showOverflowTooltip
            table-layout="auto"
            :loading="loading"
            :size="size"
            :data="memberList"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small'"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
          >
            <!-- 操作按钮 -->
            <template #operation="{ row, size }">
              <el-button
                class="reset-margin"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon(View)"
                @click="openDetail(row)"
              >
                查看
              </el-button>
              <el-button
                class="reset-margin"
                link
                :type="row.status === 0 ? 'success' : 'danger'"
                :size="size"
                @click="handleToggleStatus(row)"
              >
                {{ row.status === 0 ? "恢复" : "禁用" }}
              </el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>

    <!-- 详情抽屉 -->
    <MemberDrawer
      v-model:visible="drawerVisible"
      :member="currentMember"
      :loading="detailLoading"
      @toggle-status="handleToggleStatus"
      @close="closeDrawer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useMemberTable } from "./composables/useMemberTable";
import { useMemberDetail } from "./composables/useMemberDetail";
import MemberDrawer from "./components/MemberDrawer.vue";
import View from "@iconify-icons/ep/view";

defineOptions({ name: "MemberList" });

const formRef = ref();
const tableRef = ref();

// 使用表格逻辑
const {
  filterForm,
  loading,
  memberList,
  statusOptions,
  columns,
  pagination,
  handleSearch,
  handleReset,
  handleFilterChange,
  getMemberData,
  handleSizeChange,
  handleCurrentChange,
  handleToggleStatus
} = useMemberTable();

// 使用详情逻辑
const {
  drawerVisible,
  currentMember,
  loading: detailLoading,
  openDrawer,
  closeDrawer
} = useMemberDetail();

// 打开详情
const openDetail = (row) => {
  openDrawer(row.id);
};
</script>

<style scoped lang="scss">
.member-list {
  .box-card {
    :deep(.el-card__body) {
      padding: 16px;
    }
  }
}
</style>

