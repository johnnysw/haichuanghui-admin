<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { PureTableBar } from "@/components/RePureTableBar";
import { useEventRegistrationTable } from "./composables/useEventRegistrationTable";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Refresh from "@iconify-icons/ep/refresh";

const route = useRoute();
const router = useRouter();
const eventId = computed(() => Number(route.params.id || 0));
const formRef = ref();

if (!eventId.value) {
  router.back();
}

const {
  form,
  dataList,
  loading,
  columns,
  pagination,
  handleSearch,
  resetForm,
  handleSizeChange,
  handleCurrentChange
} = useEventRegistrationTable(eventId.value);

const goBack = () => router.back();
</script>

<template>
  <div class="registration-page">
    <!-- 页面头部 -->
    <div class="page-header mb-6">
      <el-page-header @back="goBack">
        <template #content>
          <div class="flex items-center">
            <span class="text-lg font-medium">报名管理</span>
          </div>
        </template>
      </el-page-header>
    </div>

    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px] overflow-auto"
    >
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入姓名"
          clearable
          class="!w-[140px]"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="form.phone"
          placeholder="请输入手机号"
          clearable
          class="!w-[160px]"
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
        <el-button :icon="useRenderIcon(Refresh)" @click="resetForm(formRef)">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <div :class="['grid', 'grid-cols-1', 'md:grid-cols-12', 'gap-2', 'w-full']">
      <div class="col-span-12 w-full min-w-0">
        <PureTableBar
          class="w-full min-w-0"
          style="transition: width 220ms cubic-bezier(0.4, 0, 0.2, 1)"
          title="报名管理"
          :columns="columns"
          @refresh="handleSearch"
        >
          <template #default="{ size, dynamicColumns }">
            <pure-table
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
            />
          </template>
        </PureTableBar>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.registration-page {
  min-height: 100vh;
}

.page-header {
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
