<template>
  <div class="main">
    <!-- 搜索表单 -->
    <el-form 
      ref="formRef" 
      :inline="true" 
      :model="searchForm" 
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="姓名：" prop="name">
        <el-input 
          v-model="searchForm.name" 
          placeholder="请输入投资人姓名" 
          clearable 
          class="!w-[160px]" 
        />
      </el-form-item>
      <el-form-item label="投资机构：" prop="institution">
        <el-input 
          v-model="searchForm.institution" 
          placeholder="请输入投资机构" 
          clearable 
          class="!w-[160px]" 
        />
      </el-form-item>
      <el-form-item label="地区：" prop="location">
        <el-input 
          v-model="searchForm.location" 
          placeholder="请输入地区" 
          clearable 
          class="!w-[140px]" 
        />
      </el-form-item>
      <el-form-item label="关注行业：" prop="focusIndustry">
        <el-select 
          v-model="searchForm.focusIndustry" 
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
      <el-form-item label="偏好阶段：" prop="preferredStage">
        <el-select 
          v-model="searchForm.preferredStage" 
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
      title="投资人列表" 
      :columns="columns" 
      @refresh="getData"
    >
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(Plus)"
          @click="openDialog('add')"
        >
          新增投资人
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
          <!-- 头像 -->
          <template #avatar="{ row }">
            <el-image
              v-if="row.avatar"
              :src="row.avatar"
              :alt="row.name"
              fit="cover"
              preview-teleported
              :preview-src-list="[row.avatar]"
              class="w-10 h-10 rounded-full border"
            />
            <span v-else class="text-gray-400">无头像</span>
          </template>

          <!-- 关注行业 -->
          <template #focusIndustries="{ row }">
            <div class="flex flex-wrap gap-1">
              <el-tag 
                v-for="industry in row.focusIndustries.slice(0, 2)" 
                :key="industry"
                :type="getIndustryTagType(industry)" 
                size="small"
              >
                {{ getIndustryLabel(industry) }}
              </el-tag>
              <el-tooltip 
                v-if="row.focusIndustries.length > 2"
                :content="row.focusIndustries.slice(2).map(getIndustryLabel).join('、')"
                placement="top"
              >
                <el-tag size="small" type="info">+{{ row.focusIndustries.length - 2 }}</el-tag>
              </el-tooltip>
            </div>
          </template>

          <!-- 偏好阶段 -->
          <template #preferredStages="{ row }">
            <div class="flex flex-wrap gap-1">
              <el-tag 
                v-for="stage in row.preferredStages.slice(0, 2)" 
                :key="stage"
                :type="getStageTagType(stage)" 
                size="small"
              >
                {{ getStageLabel(stage) }}
              </el-tag>
              <el-tooltip 
                v-if="row.preferredStages.length > 2"
                :content="row.preferredStages.slice(2).map(getStageLabel).join('、')"
                placement="top"
              >
                <el-tag size="small" type="info">+{{ row.preferredStages.length - 2 }}</el-tag>
              </el-tooltip>
            </div>
          </template>

          <!-- 认证状态 -->
          <template #verified="{ row }">
            <el-tag 
              :type="row.verified ? 'success' : 'info'" 
              size="small"
            >
              {{ row.verified ? '已认证' : '未认证' }}
            </el-tag>
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
              :title="`确认删除投资人【${row.name}】吗？`"
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
    <InvestorDialog
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
import { useInvestorTable } from "../composables/useInvestorTable";
import InvestorDialog from "./components/InvestorDialog.vue";
import type { InvestorItem } from "../types/types";

import View from "@iconify-icons/ep/view";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import Plus from "@iconify-icons/ep/plus";

defineOptions({ name: "InvestorList" });

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
  statusOptions,
  getData,
  handleSearch,
  handleReset,
  handleSizeChange,
  handleCurrentChange,
  handleDelete,
  getIndustryLabel,
  getStageLabel,
  getStatusInfo,
  getIndustryTagType,
  getStageTagType,
  formatDateTime
} = useInvestorTable();

// 弹窗相关
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const currentRow = ref<InvestorItem | null>(null);

// 打开弹窗
const openDialog = (mode: "add" | "edit" | "view", row?: InvestorItem) => {
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
const openDetail = (row: InvestorItem) => {
  router.push(`/investor/detail/${row.id}`);
};
</script>

<style lang="scss" scoped>
.search-form {
  .el-form-item {
    margin-bottom: 12px;
  }
}
</style>