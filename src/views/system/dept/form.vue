<script setup lang="ts">
import { ref, onMounted } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "./utils/rule";
import { Dept } from "@/types/system";
import { usePublicHooks } from "../hooks";
import { getUserList } from "@/api/system";
import type { User } from "@/types/system";
import { ElMessage } from "element-plus";
import { useDebounceFn } from "@vueuse/core";

const props = withDefaults(defineProps<Dept.FormProps>(), {
  formInline: () => ({
    higherDeptOptions: [],
    parentId: 0,
    name: "",
    principalId: undefined,
    sort: undefined,
    status: 1,
    remark: "",
    type: 3, // 类型（1：公司，2：分公司，3：部门）
  })
});

const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);

// 远程搜索相关
const loading = ref(false);
const userOptions = ref<User.UserInfo[]>([]);

// 初始化时，如果有部门负责人ID，则获取负责人信息
const initPrincipal = async () => {
  if (props.formInline.principalId) {
    loading.value = true;
    try {
      const { data } = await getUserList({
        pageNum: 1,
        pageSize: 1,
        id: props.formInline.principalId
      });
      if (data.list?.length > 0) {
        userOptions.value = data.list;
      }
    } catch (err) {
      ElMessage.error("获取负责人信息失败");
      console.error("获取负责人信息失败:", err);
    } finally {
      loading.value = false;
    }
  }
};

// 使用 VueUse 的 useDebounceFn 实现防抖
const remoteMethod = useDebounceFn(async (query: string) => {
  if (query) {
    loading.value = true;
    try {
      const { data } = await getUserList({
        username: query,
        pageNum: 1,
        pageSize: 10
      });
      userOptions.value = data.list;
    } catch (err) {
      ElMessage.error("获取用户列表失败");
      console.error("获取用户列表失败:", err);
    } finally {
      loading.value = false;
    }
  } else {
    userOptions.value = [];
  }
}, 300);

function getRef() {
  return ruleFormRef.value;
}

onMounted(() => {
  initPrincipal();
});

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col>
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            v-model="newFormInline.parentId"
            class="w-full"
            :options="newFormInline.higherDeptOptions"
            :props="{
              value: 'id',
              label: 'name',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择上级部门"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入部门名称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="部门负责人">
          <el-select
            v-model="newFormInline.principalId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词搜索用户"
            :remote-method="remoteMethod"
            :loading="loading"
            clearable
          >
            <el-option
              v-for="item in userOptions"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            >
              <span>{{ item.username }}</span>
              <span class="text-gray-400 ml-2">({{ item.phone }})</span>
            </el-option>
          </el-select>
        </el-form-item>
      </re-col>

      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="newFormInline.sort"
            class="!w-full"
            :min="0"
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="部门状态">
          <el-switch
            v-model="newFormInline.status"
            inline-prompt
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="停用"
            :style="switchStyle"
          />
        </el-form-item>
      </re-col>

      <re-col>
        <el-form-item label="备注">
          <el-input
            v-model="newFormInline.remark"
            placeholder="请输入备注信息"
            type="textarea"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
