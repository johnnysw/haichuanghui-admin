<script setup lang="ts">
import { useRouter } from 'vue-router';
import { OfficeBuilding } from '@element-plus/icons-vue';

defineOptions({
  name: "IncubatorManage"
});

const router = useRouter();

function goToList() {
  router.push('/incubator/list');
}
</script>

<template>
  <div class="p-6">
    <el-card>
      <template #header>
        <h2 class="text-xl font-semibold">双创载体管理</h2>
      </template>
      
      <div class="text-center py-8">
        <el-icon size="64" class="text-gray-400 mb-4">
          <OfficeBuilding />
        </el-icon>
        <p class="text-gray-600 mb-6">欢迎使用双创载体管理系统</p>
        
        <div class="flex justify-center gap-4">
          <el-button type="primary" @click="goToList">
            管理载体列表
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
