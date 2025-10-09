<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="分类名称：" prop="name">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入分类名称"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="分类代码：" prop="code">
        <el-input
          v-model="searchForm.code"
          placeholder="请输入分类代码"
          clearable
          class="!w-[180px]"
        />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="searchForm.status"
          placeholder="请选择状态"
          clearable
          class="!w-[120px]"
        >
          <el-option label="全部状态" value="" />
          <el-option label="待审核" :value="0" />
          <el-option label="已审核" :value="1" />
          <el-option label="已拒绝" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="启用：" prop="isActive">
        <el-select
          v-model="searchForm.isActive"
          placeholder="请选择状态"
          clearable
          class="!w-[120px]"
        >
          <el-option label="全部" value="" />
          <el-option label="启用" :value="true" />
          <el-option label="禁用" :value="false" />
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
          @click="resetSearch"
        >
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
          title="资讯分类"
          :columns="columns"
          @refresh="handleSearch"
        >
          <template #buttons>
            <el-button
              type="primary"
              :icon="useRenderIcon('ep:plus')"
              @click="openDialog('add')"
            >
              新增分类
            </el-button>
            <el-button
              type="danger"
              :icon="useRenderIcon('ep:delete')"
              :disabled="!selectedIds.length"
              @click="handleBatchDelete"
            >
              批量删除
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
              :adaptiveConfig="{ offsetBottom: 108 }"
              :data="dataList"
              :columns="dynamicColumns"
              :pagination="{ ...pagination, size }"
              :header-cell-style="{
                background: 'var(--el-fill-color-light)',
                color: 'var(--el-text-color-primary)'
              }"
              @selection-change="handleSelectionChange"
              @page-size-change="onPageSizeChange"
              @page-current-change="onCurrentChange"
            >
              <template #selection>
                <!-- 多选框列 -->
              </template>

              <template #icon="{ row }">
                <el-icon v-if="row.icon" class="text-gray-600" size="20">
                  <component :is="useRenderIcon(row.icon)" />
                </el-icon>
                <span v-else class="text-gray-400">-</span>
              </template>

              <template #name="{ row }">
                <div class="flex flex-col">
                  <div class="font-medium text-gray-900">{{ row.name }}</div>
                  <div
                    v-if="row.description"
                    class="text-xs text-gray-500 mt-1"
                  >
                    {{ row.description }}
                  </div>
                </div>
              </template>

              <template #level="{ row }">
                <el-tag
                  :type="row.level === 1 ? 'primary' : 'info'"
                  effect="plain"
                  :size="size === 'small' ? 'small' : 'default'"
                >
                  {{ row.level === 1 ? "一级分类" : `${row.level}级分类` }}
                </el-tag>
              </template>

              <template #status="{ row }">
                <el-tag
                  :type="getStatusType(row.status)"
                  effect="plain"
                  :size="size === 'small' ? 'small' : 'default'"
                >
                  {{ getStatusText(row.status) }}
                </el-tag>
              </template>

              <template #isActive="{ row }">
                <el-switch
                  v-model="row.isActive"
                  :disabled="row.status !== 1"
                  @change="handleToggleActive(row)"
                />
              </template>

              <template #isNavigation="{ row }">
                <el-tag
                  v-if="row.isNavigation"
                  type="success"
                  effect="plain"
                  :size="size === 'small' ? 'small' : 'default'"
                >
                  导航显示
                </el-tag>
                <span v-else class="text-gray-400">-</span>
              </template>

              <template #articleCount="{ row }">
                <span class="font-medium text-blue-600">{{
                  row.articleCount
                }}</span>
              </template>

              <template #createdTime="{ row }">
                {{ formatDateTime(row.createdTime) }}
              </template>

              <template #operation="{ row }">
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon('ep:view')"
                  @click="openDialog('view', row)"
                >
                  查看
                </el-button>
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon('ep:edit')"
                  @click="openDialog('edit', row)"
                >
                  编辑
                </el-button>
                <el-dropdown class="ml-2">
                  <el-button
                    class="reset-margin"
                    link
                    type="primary"
                    :size="size"
                    :icon="useRenderIcon('ep:more')"
                  />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-if="row.status === 0"
                        @click="handleApprove(row)"
                      >
                        审核通过
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-if="row.status === 0"
                        @click="handleReject(row)"
                      >
                        审核拒绝
                      </el-dropdown-item>
                      <el-dropdown-item @click="handleToggleNavigation(row)">
                        {{ row.isNavigation ? "取消导航" : "显示导航" }}
                      </el-dropdown-item>
                      <el-dropdown-item divided @click="handleDelete(row.id)">
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </pure-table>
          </template>
        </PureTableBar>
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <CategoryDialog
      v-model:visible="dialogVisible"
      :mode="dialogMode"
      :form-data="currentRow"
      :categories="dataList"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { type PaginationProps, type TableColumnList } from "@pureadmin/table";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ElMessage, ElMessageBox } from "element-plus";

import CategoryDialog from "./components/CategoryDialog.vue";
import {
  getCategoryList,
  deleteCategory,
  batchDeleteCategory,
  toggleCategoryActive,
  toggleCategoryNavigation,
  updateCategoryStatus
} from "./api/index";
import type { NewsCategory, CategoryListParams } from "./types/types";

defineOptions({ name: "NewsCategory" });

const formRef = ref();
const tableRef = ref();
const contentRef = ref();

// 控制侧边抽屉的显示状态
const isShow = ref(false);

// 搜索表单
const searchForm = reactive<CategoryListParams>({
  name: "",
  code: "",
  status: undefined,
  isActive: undefined
});

// 表格数据
const dataList = ref<NewsCategory[]>([]);
const loading = ref(false);
const selectedIds = ref<number[]>([]);

// 分页配置
const pagination = reactive<PaginationProps>({
  total: 0,
  pageSize: 10,
  currentPage: 1,
  background: true
});

// 弹窗相关
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const currentRow = ref<NewsCategory | null>(null);

// 表格列配置
const columns: TableColumnList = [
  {
    type: "selection",
    width: 55,
    align: "left",
    hide: opts => !opts?.checkList?.includes("勾选列")
  },
  {
    label: "ID",
    prop: "id",
    width: 80
  },
  {
    label: "图标",
    prop: "icon",
    width: 80,
    slot: "icon"
  },
  {
    label: "分类名称",
    prop: "name",
    minWidth: 200,
    slot: "name"
  },
  {
    label: "分类代码",
    prop: "code",
    width: 150
  },
  {
    label: "层级",
    prop: "level",
    width: 100,
    slot: "level"
  },
  {
    label: "显示顺序",
    prop: "displayOrder",
    width: 100
  },
  {
    label: "状态",
    prop: "status",
    width: 100,
    slot: "status"
  },
  {
    label: "启用",
    prop: "isActive",
    width: 80,
    slot: "isActive"
  },
  {
    label: "导航显示",
    prop: "isNavigation",
    width: 100,
    slot: "isNavigation"
  },
  {
    label: "文章数",
    prop: "articleCount",
    width: 100,
    slot: "articleCount"
  },
  {
    label: "创建时间",
    prop: "createdTime",
    width: 160,
    slot: "createdTime"
  },
  {
    label: "操作",
    fixed: "right",
    width: 200,
    slot: "operation"
  }
];

// 获取数据
const getData = async () => {
  loading.value = true;
  try {
    const params: CategoryListParams = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      ...searchForm
    };

    const { data } = await getCategoryList(params);
    dataList.value = data.list;
    pagination.total = data.total;
  } catch (error) {
    console.error("获取分类列表失败:", error);
    ElMessage.error("获取数据失败");
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1;
  getData();
};

// 重置搜索
const resetSearch = () => {
  Object.assign(searchForm, {
    name: "",
    code: "",
    status: undefined,
    isActive: undefined
  });
  handleSearch();
};

// 分页变化
const onPageSizeChange = (size: number) => {
  pagination.pageSize = size;
  getData();
};

const onCurrentChange = (page: number) => {
  pagination.currentPage = page;
  getData();
};

// 多选变化
const handleSelectionChange = (selection: NewsCategory[]) => {
  selectedIds.value = selection.map(item => item.id);
};

// 打开弹窗
const openDialog = (mode: "add" | "edit" | "view", row?: NewsCategory) => {
  dialogMode.value = mode;
  currentRow.value = row || null;
  dialogVisible.value = true;
};

// 弹窗成功回调
const handleDialogSuccess = () => {
  getData();
};

// 删除单个
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm(
      "此操作将永久删除该分类，是否继续？",
      "确认删除",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );

    await deleteCategory(id);
    ElMessage.success("删除成功");
    getData();
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (!selectedIds.value.length) {
    ElMessage.warning("请选择要删除的分类");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `此操作将永久删除选中的 ${selectedIds.value.length} 个分类，是否继续？`,
      "确认批量删除",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );

    await batchDeleteCategory(selectedIds.value);
    ElMessage.success("批量删除成功");
    selectedIds.value = [];
    getData();
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 切换启用状态
const handleToggleActive = async (row: NewsCategory) => {
  try {
    await toggleCategoryActive(row.id, row.isActive);
    ElMessage.success(row.isActive ? "启用成功" : "禁用成功");
    getData();
  } catch (error) {
    console.error("操作失败:", error);
    ElMessage.error("操作失败");
    // 回滚状态
    row.isActive = !row.isActive;
  }
};

// 切换导航显示状态
const handleToggleNavigation = async (row: NewsCategory) => {
  try {
    await toggleCategoryNavigation(row.id, !row.isNavigation);
    ElMessage.success(row.isNavigation ? "取消导航成功" : "显示导航成功");
    getData();
  } catch (error) {
    console.error("操作失败:", error);
    ElMessage.error("操作失败");
  }
};

// 审核通过
const handleApprove = async (row: NewsCategory) => {
  try {
    await updateCategoryStatus(row.id, 1);
    ElMessage.success("审核通过");
    getData();
  } catch (error) {
    console.error("审核失败:", error);
    ElMessage.error("审核失败");
  }
};

// 审核拒绝
const handleReject = async (row: NewsCategory) => {
  try {
    await updateCategoryStatus(row.id, 2);
    ElMessage.success("审核拒绝");
    getData();
  } catch (error) {
    console.error("审核失败:", error);
    ElMessage.error("审核失败");
  }
};

// 工具函数
const getStatusType = (status: number) => {
  switch (status) {
    case 0:
      return "warning";
    case 1:
      return "success";
    case 2:
      return "danger";
    default:
      return "info";
  }
};

const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return "待审核";
    case 1:
      return "已审核";
    case 2:
      return "已拒绝";
    default:
      return "未知";
  }
};

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
};

// 初始化
onMounted(() => {
  getData();
});
</script>

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
