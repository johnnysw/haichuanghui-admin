<template>
  <div class="main">
    <!-- 搜索表单 -->
    <el-form 
      ref="formRef" 
      :inline="true" 
      :model="searchForm" 
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="项目名称：" prop="name">
        <el-input 
          v-model="searchForm.name" 
          placeholder="请输入项目名称" 
          clearable 
          class="!w-[180px]" 
        />
      </el-form-item>
      <el-form-item label="行业分类：" prop="industry">
        <el-select 
          v-model="searchForm.industry" 
          placeholder="请选择行业" 
          clearable 
          class="!w-[140px]"
        >
          <el-option label="全部" value="" />
          <el-option 
            v-for="option in industryOptions" 
            :key="option.value"
            :label="option.label" 
            :value="option.value" 
          />
        </el-select>
      </el-form-item>
      <el-form-item label="项目阶段：" prop="stage">
        <el-select 
          v-model="searchForm.stage" 
          placeholder="请选择阶段" 
          clearable 
          class="!w-[120px]"
        >
          <el-option label="全部" value="" />
          <el-option 
            v-for="option in stageOptions" 
            :key="option.value"
            :label="option.label" 
            :value="option.value" 
          />
        </el-select>
      </el-form-item>
      <el-form-item label="融资轮次：" prop="fundingStage">
        <el-select 
          v-model="searchForm.fundingStage" 
          placeholder="请选择轮次" 
          clearable 
          class="!w-[120px]"
        >
          <el-option label="全部" value="" />
          <el-option 
            v-for="option in fundingStageOptions" 
            :key="option.value"
            :label="option.label" 
            :value="option.value" 
          />
        </el-select>
      </el-form-item>
      <el-form-item label="项目地区：" prop="location">
        <el-input 
          v-model="searchForm.location" 
          placeholder="请输入地区" 
          clearable 
          class="!w-[140px]" 
        />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select 
          v-model="searchForm.status" 
          placeholder="请选择状态" 
          clearable 
          class="!w-[120px]"
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
        <el-button 
          type="primary" 
          :icon="useRenderIcon('ri:search-line')" 
          :loading="loading" 
          @click="handleSearch"
        >
          搜索
        </el-button>
        <el-button 
          :icon="useRenderIcon('ri:refresh-line')" 
          @click="handleReset"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格工具栏 -->
    <PureTableBar 
      title="创业项目列表" 
      :columns="columns" 
      @refresh="getData"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(Plus)"
          @click="openDialog('add')"
        >
          新增项目
        </el-button>
      </template>
      
      <!-- 表格主体 -->
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
          :data="dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small'"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <!-- 项目LOGO -->
          <template #logo="{ row }">
            <el-image
              v-if="row.logo"
              :src="row.logo"
              :alt="row.name"
              fit="cover"
              preview-teleported
              :preview-src-list="[row.logo]"
              class="w-12 h-12 rounded border"
            />
            <span v-else class="text-gray-400">无LOGO</span>
          </template>

          <!-- 行业分类 -->
          <template #industry="{ row }">
            <el-tag :type="getIndustryTagType(row.industry)" size="small">
              {{ getIndustryLabel(row.industry) }}
            </el-tag>
          </template>

          <!-- 项目阶段 -->
          <template #stage="{ row }">
            <el-tag :type="getStageTagType(row.stage)" size="small">
              {{ getStageLabel(row.stage) }}
            </el-tag>
          </template>

          <!-- 融资轮次 -->
          <template #fundingStage="{ row }">
            <el-tag :type="getFundingStageTagType(row.fundingStage)" size="small">
              {{ getFundingStageLabel(row.fundingStage) }}
            </el-tag>
          </template>

          <!-- 融资需求 -->
          <template #fundingNeeds="{ row }">
            <span class="text-sm font-medium text-green-600">
              {{ formatAmount(row.fundingNeeds) }}
            </span>
          </template>

          <!-- 状态 -->
          <template #status="{ row }">
            <el-tag 
              :type="getStatusInfo(row.status).type" 
              size="small"
            >
              {{ getStatusInfo(row.status).label }}
            </el-tag>
          </template>

          <!-- 推荐状态 -->
          <template #isRecommended="{ row }">
            <el-tag 
              :type="row.isRecommended ? 'warning' : 'info'" 
              size="small"
            >
              {{ row.isRecommended ? '推荐' : '普通' }}
            </el-tag>
          </template>

          <!-- 精选状态 -->
          <template #isFeatured="{ row }">
            <el-tag 
              :type="row.isFeatured ? 'danger' : 'info'" 
              size="small"
            >
              {{ row.isFeatured ? '精选' : '普通' }}
            </el-tag>
          </template>

          <!-- 创建时间 -->
          <template #createdTime="{ row }">
            <span class="text-sm text-gray-600">
              {{ formatDateTime(row.createdTime) }}
            </span>
          </template>

          <!-- 操作按钮 -->
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
              @click="openDialog('edit', row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              :title="`确认删除项目【${row.name}】吗？`"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  class="reset-margin"
                  link
                  type="danger"
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

    <!-- 新增/编辑弹窗 -->
    <ProjectDialog
      v-model:visible="dialogVisible"
      :mode="dialogMode"
      :form-data="currentRow"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { deviceDetection } from "@pureadmin/utils";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useProjectTable } from "../composables/useProjectTable";
import ProjectDialog from "./components/ProjectDialog.vue";
import type { ProjectItem } from "../types/types";

import View from "@iconify-icons/ep/view";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import Plus from "@iconify-icons/ep/plus";

defineOptions({ name: "ProjectList" });

const router = useRouter();
const formRef = ref();
const tableRef = ref();

const {
  loading,
  dataList,
  searchForm,
  pagination,
  columns,
  industryOptions,
  stageOptions,
  fundingStageOptions,
  statusOptions,
  getData,
  handleSearch,
  handleReset,
  handleSizeChange,
  handleCurrentChange,
  handleDelete,
  getIndustryLabel,
  getStageLabel,
  getFundingStageLabel,
  getStatusInfo,
  getIndustryTagType,
  getStageTagType,
  getFundingStageTagType,
  formatAmount,
  formatDateTime
} = useProjectTable();

// 弹窗相关
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const currentRow = ref<ProjectItem | null>(null);

// 打开弹窗
const openDialog = (mode: "add" | "edit" | "view", row?: ProjectItem) => {
  dialogMode.value = mode;
  currentRow.value = row || null;
  dialogVisible.value = true;
};

// 弹窗成功回调
const handleDialogSuccess = () => {
  dialogVisible.value = false;
  getData();
};

// 查看详情
const openDetail = (row: ProjectItem) => {
  router.push(`/project/detail/${row.id}`);
};
</script>

<style lang="scss" scoped>
.search-form {
  .el-form-item {
    margin-bottom: 12px;
  }
}
</style>
