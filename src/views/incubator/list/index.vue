<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { deviceDetection } from "@pureadmin/utils";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useIncubatorTable } from "./composables/useIncubatorTable";
import { ElMessage } from "element-plus";
import View from "@iconify-icons/ep/view";
import EditPen from "@iconify-icons/ep/edit-pen";
import Delete from "@iconify-icons/ep/delete";
import Plus from "@iconify-icons/ep/plus";

defineOptions({ name: "IncubatorList" });

const router = useRouter();
const formRef = ref();
const tableRef = ref();

const { form, columns, list, loading, pagination, fetch, onSearch, resetForm, removeRow, handleSizeChange, handleCurrentChange } = useIncubatorTable();

onMounted(() => {
  fetch();
});

// 查看详情
function openDetail(row: any) {
  router.push(`/incubator/detail/${row.id}`);
}

// 编辑 - 目前跳转到详情页，后续可改为编辑页或弹窗
function openEdit(row: any) {
  router.push(`/incubator/detail/${row.id}`);
}

// 新增载体
function openAdd() {
  router.push("/incubator/add");
}

// 删除操作
async function handleDelete(row: any) {
  try {
    await removeRow(row);
    ElMessage.success(`载体【${row.name}】删除成功`);
  } catch (error) {
    ElMessage.error("删除失败");
  }
}
</script>

<template>
  <div class="main">
    <el-form ref="formRef" :inline="true" :model="form" class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto">
      <el-form-item label="名称：" prop="name">
        <el-input v-model="form.name" placeholder="请输入载体名称" clearable class="!w-[160px]" />
      </el-form-item>
      <el-form-item label="地区：" prop="location">
        <el-input v-model="form.location" placeholder="请输入地区" clearable class="!w-[160px]" />
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select v-model="form.status" placeholder="请选择状态" clearable class="!w-[160px]">
          <el-option label="全部" value="" />
          <el-option label="正常" value="1" />
          <el-option label="审核中" value="2" />
          <el-option label="已拒绝" value="3" />
          <el-option label="禁用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="推荐：" prop="recommended">
        <el-select v-model="form.recommended" placeholder="是否推荐" clearable class="!w-[120px]">
          <el-option label="全部" value="" />
          <el-option label="已推荐" value="1" />
          <el-option label="未推荐" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="useRenderIcon('ri:search-line')" :loading="loading" @click="onSearch">搜索</el-button>
        <el-button :icon="useRenderIcon('ri:refresh-line')" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <PureTableBar title="双创载体列表" :columns="columns" @refresh="onSearch">
      <template #buttons>
        <el-button
          type="primary"
          :icon="useRenderIcon(Plus)"
          @click="openAdd"
        >
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
            <div class="flex items-center justify-center gap-2">
              <el-button
                size="small"
                link
                type="primary"
                :icon="useRenderIcon(View)"
                @click="openDetail(row)"
              >
                查看
              </el-button>
              <el-button
                size="small"
                link
                type="warning"
                :icon="useRenderIcon(EditPen)"
                @click="openEdit(row)"
              >
                编辑
              </el-button>
              <el-popconfirm
                :title="`是否确认删除载体【${row.name}】？`"
                @confirm="handleDelete(row)"
              >
                <template #reference>
                  <el-button
                    size="small"
                    link
                    type="danger"
                    :icon="useRenderIcon(Delete)"
                  >
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
  
</template>

<style scoped lang="scss">
.search-form { :deep(.el-form-item) { margin-bottom: 12px; } }
</style>

