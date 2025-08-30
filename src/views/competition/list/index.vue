<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useCompetitionList } from "./composables/useCompetitionTable";
import { deviceDetection } from "@pureadmin/utils";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import CompetitionDrawer from "./components/CompetitionDrawer.vue";
import type { FormItemProps } from "./types/types";

import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import AddFill from "@iconify-icons/ri/add-circle-line";
import View from "@iconify-icons/ep/view";

defineOptions({
  name: "CompetitionList"
});

const formRef = ref();
const tableRef = ref();
const contentRef = ref();
const drawerRef = ref();

const {
  form,
  isShow,
  loading,
  columns,
  dataList,
  pagination,
  industryOptions,
  onSearch,
  resetForm,
  openDialog,
  openDetail,
  handleDelete,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  rowStyle
} = useCompetitionList();

const drawerVisible = ref(false);
const drawerTitle = ref("");
const drawerFormData = ref<FormItemProps>({
  id: undefined,
  title: "",
  industryId: 0,
  regionId: 0,
  organizer: "",
  status: 0,
  startTime: "",
  endTime: "",
  registrationDeadline: "",
  location: "",
  isRecommended: false,
  description: "",
  summary: ""
});

// 处理打开新增大赛抽屉事件
const handleOpenAddDrawer = (event: CustomEvent) => {
  drawerTitle.value = event.detail.title;
  // 深拷贝，避免引用同一对象导致状态串联
  drawerFormData.value = JSON.parse(JSON.stringify(event.detail.formData));
  drawerVisible.value = true;
  setTimeout(() => {
    if (drawerRef.value) {
      drawerRef.value.showDrawer();
    }
  }, 0);
};

// 处理打开修改大赛抽屉事件
const handleOpenEditDrawer = (event: CustomEvent) => {
  drawerTitle.value = event.detail.title;
  // 深拷贝，避免引用同一对象导致状态串联
  drawerFormData.value = JSON.parse(JSON.stringify(event.detail.formData));
  drawerVisible.value = true;
  setTimeout(() => {
    if (drawerRef.value) {
      drawerRef.value.showDrawer();
    }
  }, 0);
};

// 处理抽屉提交事件
const handleDrawerSubmit = (data: FormItemProps) => {
  console.log("提交数据:", data);
  // 保存成功后刷新表格
  onSearch();
};

// 组件挂载时监听事件
onMounted(() => {
  window.addEventListener('openAddCompetitionDrawer', handleOpenAddDrawer as EventListener);
  window.addEventListener('openEditCompetitionDrawer', handleOpenEditDrawer as EventListener);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('openAddCompetitionDrawer', handleOpenAddDrawer as EventListener);
  window.removeEventListener('openEditCompetitionDrawer', handleOpenEditDrawer as EventListener);
});
</script>

<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="大赛标题：" prop="title">
        <el-input
          v-model="form.title"
          placeholder="请输入大赛标题"
          clearable
          class="!w-[160px]"
        />
      </el-form-item>
      <el-form-item label="行业领域：" prop="industryId">
        <el-select
          v-model="form.industryId"
          placeholder="请选择行业领域"
          clearable
          class="!w-[180px]"
        >
          <el-option label="全部领域" value="" />
          <el-option
            v-for="industry in industryOptions"
            :key="industry.id"
            :label="industry.name"
            :value="industry.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="form.status"
          placeholder="请选择状态"
          clearable
          class="!w-[180px]"
        >
          <el-option label="全部状态" value="" />
          <el-option label="草稿" value="0" />
          <el-option label="报名中" value="1" />
          <el-option label="进行中" value="2" />
          <el-option label="已结束" value="3" />
          <el-option label="已取消" value="4" />
          <el-option label="审核中" value="5" />
          <el-option label="已拒绝" value="6" />
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

    <div
      ref="contentRef"
      :class="['grid', 'grid-cols-1', 'md:grid-cols-12', 'gap-2', 'w-full']"
    >
      <div :class="[isShow ? 'md:col-span-7 col-span-12' : 'col-span-12']" class="w-full min-w-0">
        <PureTableBar
          class="w-full min-w-0"
          style="transition: width 220ms cubic-bezier(0.4, 0, 0.2, 1)"
          title="创业大赛列表"
          :columns="columns"
          @refresh="onSearch"
        >
          <template #buttons>
            <el-button
              type="primary"
              :icon="useRenderIcon(AddFill)"
              @click="openDialog()"
            >
              新增大赛
            </el-button>
          </template>
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              ref="tableRef"
              align-whole="center"
              showOverflowTooltip
              table-layout="auto"
              :loading="loading"
              :size="size"
              adaptive
              :row-style="rowStyle"
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
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon(EditPen)"
                  @click="openDialog('修改', row)"
                >
                  修改
                </el-button>
                <el-popconfirm
                  :title="`是否确认删除大赛名为${row.title}的这条数据`"
                  @confirm="handleDelete(row)"
                >
                  <template #reference>
                    <el-button
                      class="reset-margin"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon(Delete)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </template>
            </pure-table>
          </template>
        </PureTableBar>
      </div>
    </div>
    
    <!-- 竞赛表单抽屉 -->
    <CompetitionDrawer
      ref="drawerRef"
      v-model:visible="drawerVisible"
      :title="drawerTitle"
      :form-data="drawerFormData"
      @submit="handleDrawerSubmit"
    />
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