<script setup lang="ts">
import { computed } from "vue";
import { ElTable, ElTableColumn, ElButton, ElSwitch, ElImage, ElSpace } from "element-plus";
import { getFullImageUrl } from "@/utils/image";
import type { Banner } from "../types/types";

// Props
interface Props {
  data: Banner[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

// Emits
const emit = defineEmits<{
  edit: [row: Banner];
  delete: [row: Banner];
  statusChange: [row: Banner];
}>();

// 处理图片URL
const getImageUrl = (url: string) => {
  return getFullImageUrl(url);
};

// 格式化时间
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>

<template>
  <el-table
    :data="props.data"
    v-loading="props.loading"
    style="width: 100%"
    border
    stripe
  >
    <el-table-column prop="id" label="ID" width="80" align="center" />

    <el-table-column label="缩略图" width="120" align="center">
      <template #default="{ row }">
        <el-image
          :src="getImageUrl(row.image)"
          :preview-src-list="[getImageUrl(row.image)]"
          fit="cover"
          style="width: 80px; height: 60px"
          preview-teleported
        />
      </template>
    </el-table-column>

    <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />

    <el-table-column prop="url" label="链接" min-width="200" show-overflow-tooltip>
      <template #default="{ row }">
        <span v-if="row.url">{{ row.url }}</span>
        <span v-else style="color: #999">-</span>
      </template>
    </el-table-column>

    <el-table-column label="状态" width="100" align="center">
      <template #default="{ row }">
        <el-switch
          v-model="row.status"
          :active-value="1"
          :inactive-value="0"
          @change="emit('statusChange', row)"
        />
      </template>
    </el-table-column>

    <el-table-column prop="sortOrder" label="排序" width="100" align="center" />

    <el-table-column label="更新时间" width="180" align="center">
      <template #default="{ row }">
        {{ formatDate(row.updatedTime) }}
      </template>
    </el-table-column>

    <el-table-column label="操作" width="150" align="center" fixed="right">
      <template #default="{ row }">
        <el-space>
          <el-button
            type="primary"
            size="small"
            @click="emit('edit', row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="emit('delete', row)"
          >
            删除
          </el-button>
        </el-space>
      </template>
    </el-table-column>
  </el-table>
</template>
