<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="活动名称：" prop="title">
        <el-input
          v-model="searchForm.title"
          placeholder="请输入活动名称"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="活动类型：" prop="type">
        <el-select
          v-model="searchForm.type"
          placeholder="请选择活动类型"
          clearable
          class="!w-[150px]"
        >
          <el-option label="全部类型" value="" />
          <el-option label="创业培训" value="创业培训" />
          <el-option label="项目路演" value="项目路演" />
          <el-option label="投融资对接" value="投融资对接" />
          <el-option label="行业论坛" value="行业论坛" />
          <el-option label="创业沙龙" value="创业沙龙" />
          <el-option label="政策宣讲" value="政策宣讲" />
        </el-select>
      </el-form-item>
      <el-form-item label="活动状态：" prop="status">
        <el-select
          v-model="searchForm.status"
          placeholder="请选择状态"
          clearable
          class="!w-[120px]"
        >
          <el-option label="全部状态" value="" />
          <el-option label="报名中" :value="0" />
          <el-option label="进行中" :value="1" />
          <el-option label="已结束" :value="2" />
          <el-option label="已取消" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="主办方：" prop="organizer">
        <el-input
          v-model="searchForm.organizer"
          placeholder="请输入主办方"
          clearable
          class="!w-[150px]"
        />
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
        <el-button :icon="useRenderIcon('ri:refresh-line')" @click="resetSearch">
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
          title="创业活动列表"
          :columns="columns"
          @refresh="handleSearch"
        >
          <template #buttons>
            <el-button
              type="primary"
              :icon="useRenderIcon('ep:plus')"
              @click="openDialog('add')"
            >
              新增活动
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
              @page-size-change="onPageSizeChange"
              @page-current-change="onCurrentChange"
            >
              <template #poster="{ row }">
                <el-image
                  v-if="row.poster"
                  :src="row.poster"
                  :alt="row.title"
                  class="w-12 h-12 rounded object-cover"
                  fit="cover"
                  :preview-src-list="[row.poster]"
                  preview-teleported
                />
                <div v-else class="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                  <el-icon class="text-gray-400" size="20">
                    <component :is="useRenderIcon('ep:picture')" />
                  </el-icon>
                </div>
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

              <template #isRecommended="{ row }">
                <el-tag
                  v-if="row.isRecommended"
                  type="warning"
                  effect="plain"
                  :size="size === 'small' ? 'small' : 'default'"
                >
                  推荐
                </el-tag>
                <span v-else class="text-gray-400">-</span>
              </template>

              <template #startTime="{ row }">
                {{ formatDateTime(row.startTime) }}
              </template>

              <template #endTime="{ row }">
                {{ formatDateTime(row.endTime) }}
              </template>

              <template #operation="{ row }">
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon('ep:view')"
                  @click="handleViewDetail(row.id)"
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
                  修改
                </el-button>
                <el-popconfirm
                  :title="`是否确认删除活动${row.title}的这条数据`"
                  @confirm="handleDelete(row.id)"
                >
                  <template #reference>
                    <el-button
                      class="reset-margin"
                      link
                      type="primary"
                      :size="size"
                      :icon="useRenderIcon('ep:delete')"
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
    
    <!-- 新增/编辑弹窗 -->
    <EventDialog
      v-model:visible="dialogVisible"
      :mode="dialogMode"
      :form-data="currentRow"
      @success="handleDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { type PaginationProps } from "@pureadmin/table";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ElMessage, ElMessageBox } from "element-plus";

import EventDialog from "./components/EventDialog.vue";
import { getEventList, deleteEvent } from "./api/index";
import type { Event, EventListParams } from "./types/types";

defineOptions({ name: "EventList" });

const router = useRouter();
const formRef = ref();
const tableRef = ref();
const contentRef = ref();

// 控制侧边抽屉的显示状态
const isShow = ref(false);

// 搜索表单
const searchForm = reactive<EventListParams>({
  title: "",
  type: "",
  organizer: "",
  status: undefined
});

// 表格数据
const dataList = ref<Event[]>([]);
const loading = ref(false);

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
const currentRow = ref<Event | null>(null);

// 表格列配置
const columns: TableColumnList = [
  {
    label: "ID",
    prop: "id",
    width: 80
  },
  {
    label: "活动海报",
    prop: "poster",
    width: 100,
    slot: "poster"
  },
  {
    label: "活动名称",
    prop: "title",
    minWidth: 180
  },
  {
    label: "活动类型",
    prop: "type",
    width: 120
  },
  {
    label: "主办方",
    prop: "organizer",
    width: 140
  },
  {
    label: "活动状态",
    prop: "status",
    width: 100,
    slot: "status"
  },
  {
    label: "推荐",
    prop: "isRecommended",
    width: 80,
    slot: "isRecommended"
  },
  {
    label: "参与人数",
    prop: "participantCount",
    width: 100,
    formatter: (row: Event) => `${row.participantCount || 0}人`
  },
  {
    label: "开始时间",
    prop: "startTime",
    width: 160,
    slot: "startTime"
  },
  {
    label: "结束时间",
    prop: "endTime",
    width: 160,
    slot: "endTime"
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
    const params: EventListParams = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      ...searchForm
    };
    
    const { data } = await getEventList(params);
    dataList.value = data.list;
    pagination.total = data.total;
  } catch (error) {
    console.error("获取活动列表失败:", error);
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
    title: "",
    type: "",
    organizer: "",
    status: undefined
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

// 查看详情
const handleViewDetail = (id: number) => {
  router.push(`/event/detail/${id}`);
};

// 打开弹窗
const openDialog = (mode: "add" | "edit" | "view", row?: Event) => {
  dialogMode.value = mode;
  currentRow.value = row || null;
  dialogVisible.value = true;
};

// 弹窗成功回调
const handleDialogSuccess = () => {
  getData();
};

// 删除
const handleDelete = async (id: number) => {
  try {
    await deleteEvent(id);
    ElMessage.success("删除成功");
    getData();
  } catch (error) {
    console.error("删除失败:", error);
    ElMessage.error("删除失败");
  }
};

// 工具函数
const getStatusType = (status: number) => {
  switch (status) {
    case 0: return "primary";
    case 1: return "success";
    case 2: return "info";
    case 3: return "danger";
    default: return "info";
  }
};

const getStatusText = (status: number) => {
  switch (status) {
    case 0: return "报名中";
    case 1: return "进行中";
    case 2: return "已结束";
    case 3: return "已取消";
    default: return "未知";
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