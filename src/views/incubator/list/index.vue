<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useIncubatorTable } from "./composables/useIncubatorTable";
import { getRegionList, getIncubatorDetail } from "./api";
import IncubatorDrawer from "./components/IncubatorDrawer.vue";
import { ElMessage } from "element-plus";
import View from "@iconify-icons/ep/view";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import Plus from "@iconify-icons/ep/plus";

defineOptions({ name: "IncubatorList" });

const router = useRouter();
const formRef = ref();
const tableRef = ref();
const contentRef = ref<HTMLDivElement | null>(null);
const drawerRef = ref<InstanceType<typeof IncubatorDrawer>>();
const isShow = ref(false);

const regionOptions = ref<Array<{ id: number; name: string }>>([]);

const { form, columns, list, loading, pagination, fetch, onSearch, resetForm, removeRow, handleSizeChange, handleCurrentChange } = useIncubatorTable();

onMounted(async () => {
  await Promise.all([fetchRegionOptions(), fetch()]);
});

async function fetchRegionOptions() {
  try {
    const res = await getRegionList();
    regionOptions.value = res.data || [];
  } catch (error) {
    ElMessage.error("加载地区数据失败");
  }
}

function openDetail(row: any) {
  router.push(`/incubator/detail/${row.id}`);
}

async function openEdit(row: any) {
  try {
    const res = await getIncubatorDetail(row.id);
    if (res.code === 200 && res.data) {
      drawerRef.value?.open(res.data);
    } else {
      ElMessage.error(res.message || "加载载体详情失败");
    }
  } catch (error) {
    ElMessage.error("加载载体详情失败");
  }
}

function openAdd() {
  drawerRef.value?.open();
}

async function handleDelete(row: any) {
  const success = await removeRow(row);
  if (!success) return;
  ElMessage.success(`载体【${row.name}】删除成功`);
}

function handleDrawerRefresh() {
  fetch();
}
</script>

<template>
  <div class="incubator-page">
    <el-form ref="formRef" :inline="true" :model="form" class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入载体名称" clearable class="!w-[200px]" />
      </el-form-item>
      <el-form-item label="地区" prop="regionId">
        <el-select v-model="form.regionId" placeholder="请选择地区" clearable filterable class="!w-[200px]">
          <el-option label="全部" value="" />
          <el-option v-for="item in regionOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择状态" clearable class="!w-[160px]">
          <el-option label="全部" value="" />
          <el-option label="正常" :value="1" />
          <el-option label="已下线" :value="2" />
          <el-option label="禁用" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="推荐" prop="isRecommended">
        <el-select v-model="form.isRecommended" placeholder="是否推荐" clearable class="!w-[160px]">
          <el-option label="全部" value="" />
          <el-option label="已推荐" :value="1" />
          <el-option label="未推荐" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="useRenderIcon('ri:search-line')" :loading="loading" @click="onSearch">搜索</el-button>
        <el-button :icon="useRenderIcon('ri:refresh-line')" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <div
      ref="contentRef"
      :class="['grid', 'grid-cols-1', 'md:grid-cols-12', 'gap-2', 'w-full']"
    >
      <div :class="[isShow ? 'md:col-span-7 col-span-12' : 'col-span-12']" class="w-full min-w-0">
        <PureTableBar
          class="w-full min-w-0"
          title="双创载体列表"
          :columns="columns"
          @refresh="onSearch"
        >
          <template #buttons>
            <el-button type="primary" :icon="useRenderIcon(Plus)" @click="openAdd">
              新增载体
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
              :data="list"
              :columns="dynamicColumns"
              :pagination="{ ...pagination, size }"
              :header-cell-style="{ background: 'var(--el-fill-color-light)', color: 'var(--el-text-color-primary)' }"
              @page-size-change="handleSizeChange"
              @page-current-change="handleCurrentChange"
            >
              <template #operation="{ row }">
                <div class="flex items-center justify-center gap-1">
                  <el-button
                    size="default"
                    link
                    type="primary"
                    :icon="useRenderIcon(View)"
                    @click="openDetail(row)"
                  >
                    查看
                  </el-button>
                  <el-button
                    size="default"
                    link
                    type="warning"
                    :icon="useRenderIcon(EditPen)"
                    @click="openEdit(row)"
                  >
                    编辑
                  </el-button>
                  <el-popconfirm :title="`是否确认删除载体【${row.name}】？`" @confirm="handleDelete(row)">
                    <template #reference>
                      <el-button size="default" link type="danger" :icon="useRenderIcon(Delete)">
                        删除
                      </el-button>
                    </template>
                  </el-popconfirm>
                </div>
              </template>
            </pure-table>
          </template>
        </PureTableBar>
      </div>
    </div>

    <IncubatorDrawer ref="drawerRef" @refresh="handleDrawerRefresh" />
  </div>
</template>

<style scoped lang="scss">
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>

