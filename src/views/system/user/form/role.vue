<script setup lang="ts">
import { ref, watch, computed } from "vue";
import ReCol from "@/components/ReCol";
import { Role } from "@/types/system";

const props = withDefaults(defineProps<{ formInline: Role.FormData }>(), {
  formInline: () => ({
    username: "",
    nickname: "",
    roleOptions: [],
    ids: [],
    name: "",
    code: "",
    status: 1,
    remark: ""
  } as Role.FormData)
});

// 使用计算属性确保数据类型正确
const roleOptions = computed(() => {
  return Array.isArray(props.formInline.roleOptions) 
    ? props.formInline.roleOptions 
    : [];
});

// 使用计算属性确保ids是数字数组
const selectedIds = computed(() => {
  return Array.isArray(props.formInline.ids) 
    ? props.formInline.ids.map(id => Number(id)) 
    : [];
});
</script>

<template>
  <el-form :model="formInline">
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="formInline.nickname" disabled />
        </el-form-item>
      </re-col>
      <re-col>
        <el-form-item label="角色列表" prop="ids">
          <el-select
            v-model="formInline.ids"
            placeholder="请选择"
            class="w-full"
            clearable
            multiple
          >
            <el-option
              v-for="item in formInline.roleOptions"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            >
              {{ item.name }}
            </el-option>
          </el-select>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>