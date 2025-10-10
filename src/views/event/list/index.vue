<script setup lang="ts">
import { ref, onMounted } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useEventTable } from "./composables/useEventTable";
import EventDrawer from "./components/EventDrawer.vue";
import type { EventForm, OptionItem } from "./types/types";
import { createEvent, updateEvent, getEventTypes, getRegionList, getEventDetail } from "./api";
import { message } from "@/utils/message";

import AddFill from "@iconify-icons/ri/add-circle-line";
import Refresh from "@iconify-icons/ep/refresh";
import View from "@iconify-icons/ep/view";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";

const formRef = ref();
const tableRef = ref();
const drawerVisible = ref(false);
const drawerTitle = ref("新增活动");
const drawerMode = ref<"create" | "edit">("create");
const drawerLoading = ref(false);
const drawerFormData = ref<EventForm>({
  title: "",
  organizer: "",
  eventTypeId: null,
  regionId: null,
  coOrganizers: "",
  startTime: "",
  endTime: "",
  registrationDeadline: "",
  location: "",
  onlineUrl: "",
  description: "",
  summary: "",
  schedule: "",
  faq: "",
  contactInfo: "",
  maxParticipants: null,
  registrationFee: null,
  priceNote: "",
  status: 0,
  poster: "",
  tags: [],
  highlights: [],
  isRecommended: false,
});

const currentEditingId = ref<number | null>(null);

const {
  form,
  dataList,
  loading,
  columns,
  pagination,
  handleSearch,
  resetForm,
  handleSizeChange,
  handleCurrentChange,
  handleDelete,
  openDetail,
  fetchTableData,
} = useEventTable();

const eventTypeOptions = ref<OptionItem[]>([]);
const regionOptions = ref<OptionItem[]>([]);

const fetchFilterOptions = async () => {
  try {
    const [typesRes, regionsRes] = await Promise.all([getEventTypes(), getRegionList()]);
    if (typesRes.code === 200) eventTypeOptions.value = typesRes.data || [];
    if (regionsRes.code === 200) regionOptions.value = regionsRes.data || [];
  } catch (error) {
    console.warn("加载筛选选项失败", error);
  }
};

onMounted(() => {
  fetchFilterOptions();
});

const openDrawer = async (mode: "create" | "edit", row?: EventForm) => {
  drawerMode.value = mode;
  drawerTitle.value = mode === "create" ? "新增活动" : "编辑活动";
  
  if (mode === "edit" && row?.id) {
    // 编辑模式：先调用详情接口获取完整数据
    try {
      const res = await getEventDetail(row.id);
      if (res.code === 200 && res.data) {
        currentEditingId.value = res.data.id ?? null;
        drawerFormData.value = { ...res.data };
        drawerVisible.value = true;
      } else {
        message(res.message || "加载活动详情失败", { type: "error" });
      }
    } catch (error: any) {
      message(error?.message || "加载活动详情失败", { type: "error" });
    }
  } else {
    // 新增模式：使用默认数据
    currentEditingId.value = null;
    drawerFormData.value = {
      title: "",
      organizer: "",
      eventTypeId: null,
      regionId: null,
      coOrganizers: "",
      startTime: "",
      endTime: "",
      registrationDeadline: "",
      location: "",
      onlineUrl: "",
      description: "",
      summary: "",
      schedule: "",
      faq: "",
      contactInfo: "",
      maxParticipants: null,
      registrationFee: null,
      priceNote: "",
      status: 0,
      poster: "",
      tags: [],
      highlights: [],
      isRecommended: false,
    };
    drawerVisible.value = true;
  }
};

const handleDrawerSubmit = async (data: EventForm, mode: "create" | "edit") => {
  try {
    drawerLoading.value = true;
    if (mode === "create") {
      const res = await createEvent(data);
      if (res.code === 200) {
        message("新增活动成功", { type: "success" });
        drawerVisible.value = false;
        fetchTableData();
      } else {
        message(res.message || "新增活动失败", { type: "error" });
      }
    } else if (mode === "edit" && currentEditingId.value) {
      const res = await updateEvent(currentEditingId.value, data);
      if (res.code === 200) {
        message("更新活动成功", { type: "success" });
        drawerVisible.value = false;
        fetchTableData();
      } else {
        message(res.message || "更新活动失败", { type: "error" });
      }
    }
  } catch (error: any) {
    message(error?.message || "操作失败", { type: "error" });
  } finally {
    drawerLoading.value = false;
  }
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
      <el-form-item label="活动标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入活动标题" clearable class="!w-[160px]" />
      </el-form-item>
      <el-form-item label="活动类型" prop="eventTypeId">
        <el-select v-model="form.eventTypeId" placeholder="请选择类型" clearable class="!w-[160px]">
          <el-option label="全部类型" value="" />
          <el-option
            v-for="item in eventTypeOptions"
            :key="item.id"
            :label="item.name"
            :value="String(item.id)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="地区" prop="regionId">
        <el-select v-model="form.regionId" placeholder="请选择地区" clearable class="!w-[160px]">
          <el-option label="全部地区" value="" />
          <el-option
            v-for="item in regionOptions"
            :key="item.id"
            :label="item.name"
            :value="String(item.id)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择状态" clearable class="!w-[140px]">
          <el-option label="全部状态" value="" />
          <el-option label="草稿" value="0" />
          <el-option label="报名中" value="1" />
          <el-option label="进行中" value="2" />
          <el-option label="已结束" value="3" />
          <el-option label="已取消" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="useRenderIcon('ri:search-line')" :loading="loading" @click="handleSearch">
          搜索
        </el-button>
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)"> 重置 </el-button>
      </el-form-item>
    </el-form>

    <div :class="['grid', 'grid-cols-1', 'md:grid-cols-12', 'gap-2', 'w-full']">
      <div class="col-span-12 w-full min-w-0">
        <PureTableBar
          class="w-full min-w-0"
          style="transition: width 220ms cubic-bezier(0.4, 0, 0.2, 1)"
          title="活动管理"
          :columns="columns"
          @refresh="fetchTableData"
        >
          <template #buttons>
            <el-button type="primary" :icon="useRenderIcon(AddFill)" @click="openDrawer('create')">
              新增活动
            </el-button>
          </template>
          <template #default="{ size, dynamicColumns }">
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
              @page-size-change="handleSizeChange"
              @page-current-change="handleCurrentChange"
            >
          <template #operation="{ row }">
            <el-button
              class="reset-margin"
              link
              type="primary"
              :icon="useRenderIcon(View)"
              @click="openDetail(row)"
            >
              查看
            </el-button>
            <el-button
              class="reset-margin"
              link
              type="primary"
              :icon="useRenderIcon(EditPen)"
              @click="openDrawer('edit', row)"
            >
              编辑
            </el-button>
            <el-popconfirm :title="`确认删除活动【${row.title}】吗？`" @confirm="handleDelete(row)">
              <template #reference>
                <el-button class="reset-margin" link type="danger" :icon="useRenderIcon(Delete)">
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

    <EventDrawer
      v-model:visible="drawerVisible"
      :title="drawerTitle"
      :mode="drawerMode"
      :form-data="drawerFormData"
      :loading="drawerLoading"
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
