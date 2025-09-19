<template>
  <div class="main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="searchForm"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="中心名称：" prop="keyword">
        <el-input
          v-model="searchForm.keyword"
          placeholder="请输入中心名称"
          clearable
          class="!w-[200px]"
        />
      </el-form-item>
      <el-form-item label="地区：" prop="location">
        <el-select
          v-model="searchForm.location"
          placeholder="请选择地区"
          clearable
          class="!w-[150px]"
        >
          <el-option label="全部地区" value="" />
          <el-option label="美国硅谷" value="美国硅谷" />
          <el-option label="德国柏林" value="德国柏林" />
          <el-option label="新加坡" value="新加坡" />
          <el-option label="日本东京" value="日本东京" />
          <el-option label="澳大利亚悉尼" value="澳大利亚悉尼" />
          <el-option label="加拿大多伦多" value="加拿大多伦多" />
          <el-option label="英国伦敦" value="英国伦敦" />
          <el-option label="法国巴黎" value="法国巴黎" />
          <el-option label="韩国首尔" value="韩国首尔" />
          <el-option label="以色列特拉维夫" value="以色列特拉维夫" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型：" prop="type">
        <el-select
          v-model="searchForm.type"
          placeholder="请选择类型"
          clearable
          class="!w-[150px]"
        >
          <el-option label="全部类型" value="" />
          <el-option label="科技园" value="科技园" />
          <el-option label="孵化器" value="孵化器" />
          <el-option label="加速器" value="加速器" />
          <el-option label="创业园" value="创业园" />
          <el-option label="研究院" value="研究院" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select
          v-model="searchForm.status"
          placeholder="请选择状态"
          clearable
          class="!w-[120px]"
        >
          <el-option label="全部状态" value="" />
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
          <el-option label="待审核" :value="2" />
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
          title="离岸双创中心列表"
          :columns="columns"
          @refresh="handleSearch"
        >
          <template #buttons>
            <el-button
              type="primary"
              :icon="useRenderIcon('ep:plus')"
              @click="openDialog('add')"
            >
              新增中心
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
              <template #logo="{ row }">
                <el-image
                  v-if="row.logo"
                  :src="row.logo"
                  :alt="row.name"
                  class="w-12 h-12 rounded object-cover"
                  fit="cover"
                  :preview-src-list="[row.logo]"
                  preview-teleported
                />
                <div v-else class="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                  <el-icon class="text-gray-400" size="20">
                    <component :is="useRenderIcon('ep:office-building')" />
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
                  :title="`是否确认删除离岸中心${row.name}的这条数据`"
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
    <OffshoreDialog
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

import OffshoreDialog from "./components/OffshoreDialog.vue";
import { getOffshoreList, deleteOffshore } from "./api/index";
import type { OffshoreCenter, OffshoreListParams } from "./types/types";

defineOptions({ name: "OffshoreList" });

const router = useRouter();
const formRef = ref();
const tableRef = ref();
const contentRef = ref();

// 控制侧边抽屉的显示状态
const isShow = ref(false);

// 搜索表单
const searchForm = reactive<OffshoreListParams>({
  keyword: "",
  location: "",
  type: "",
  status: undefined
});

// 表格数据
const dataList = ref<OffshoreCenter[]>([]);
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
const currentRow = ref<OffshoreCenter | null>(null);

// 表格列配置
const columns: TableColumnList = [
  {
    label: "ID",
    prop: "id",
    width: 70
  },
  {
    label: "Logo",
    prop: "logo",
    width: 80,
    slot: "logo"
  },
  {
    label: "中心名称",
    prop: "name",
    minWidth: 180,
    showOverflowTooltip: true
  },
  {
    label: "所在地区",
    prop: "location",
    width: 120,
    showOverflowTooltip: true
  },
  {
    label: "类型",
    prop: "type",
    width: 100
  },
  {
    label: "状态",
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
    label: "入驻企业",
    prop: "companyCount",
    width: 100,
    formatter: (row: OffshoreCenter) => `${row.companyCount || 0}家`
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
    const params: OffshoreListParams = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      ...searchForm
    };
    
    const { data } = await getOffshoreList(params);
    dataList.value = data.list;
    pagination.total = data.total;
  } catch (error) {
    console.error("获取离岸中心列表失败:", error);
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
    keyword: "",
    location: "",
    type: "",
    status: undefined
  });
  pagination.currentPage = 1;
  getData();
};

// 分页相关
const onPageSizeChange = (size: number) => {
  pagination.pageSize = size;
  getData();
};

const onCurrentChange = (page: number) => {
  pagination.currentPage = page;
  getData();
};

// 弹窗操作
const openDialog = (mode: "add" | "edit" | "view", row?: OffshoreCenter) => {
  dialogMode.value = mode;
  currentRow.value = row || null;
  dialogVisible.value = true;
};

// 弹窗成功回调
const handleDialogSuccess = () => {
  getData();
};

// 查看详情
const handleViewDetail = (id: number) => {
  router.push(`/offshore/detail/${id}`);
};

// 删除
const handleDelete = async (id: number) => {
  try {
    await deleteOffshore(id);
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
    case 0: return "danger";
    case 1: return "success";
    case 2: return "warning";
    default: return "info";
  }
};

const getStatusText = (status: number) => {
  switch (status) {
    case 0: return "禁用";
    case 1: return "启用";
    case 2: return "待审核";
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