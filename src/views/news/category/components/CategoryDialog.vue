<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <!-- 查看模式 -->
    <div v-if="mode === 'view' && formData" class="p-6">
      <!-- 头部：分类名称 -->
      <div class="mb-8 pb-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-gray-500 mb-2">分类名称</div>
            <h2 class="text-2xl font-bold text-gray-900">{{ form.name }}</h2>
          </div>
          <div class="flex items-center gap-3">
            <el-tag :type="form.isActive ? 'success' : 'danger'" size="large" effect="plain">
              {{ form.isActive ? "启用" : "禁用" }}
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 详细信息卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <!-- 父级分类 -->
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center mb-2">
            <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div class="text-sm text-gray-500">父级分类</div>
          </div>
          <div class="text-lg font-semibold text-gray-900">
            {{ getParentCategoryName() || "顶级分类" }}
          </div>
        </div>

        <!-- 显示顺序 -->
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center mb-2">
            <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
            <div class="text-sm text-gray-500">显示顺序</div>
          </div>
          <div class="text-lg font-semibold text-gray-900">
            {{ form.displayOrder }}
          </div>
        </div>

        <!-- 文章数量 -->
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center mb-2">
            <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="text-sm text-gray-500">文章数量</div>
          </div>
          <div class="text-lg font-semibold text-green-600">
            {{ formData.articleCount }} 篇
          </div>
        </div>
      </div>

      <!-- 分类描述 -->
      <div class="bg-blue-50 rounded-lg p-5">
        <div class="flex items-start">
          <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 mt-0.5">
            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <div class="flex-1">
            <div class="text-sm font-medium text-gray-700 mb-2">分类描述</div>
            <div class="text-gray-900 leading-relaxed">
              {{ form.description || "暂无描述" }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增/编辑模式 -->
    <el-form
      v-else
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-position="left"
    >
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-1 h-5 bg-primary rounded mr-3" />
          基本信息
        </h3>
        <div class="grid grid-cols-1 gap-6">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入分类名称" />
          </el-form-item>
          <el-form-item label="父级分类" prop="parentId">
            <el-select
              v-model="form.parentId"
              placeholder="请选择父级分类（可选）"
              class="w-full"
            >
              <el-option label="无（作为顶级分类）" :value="undefined" />
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
                :disabled="mode === 'edit' && category.id === currentCategoryId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="显示顺序" prop="displayOrder">
            <el-input-number
              v-model="form.displayOrder"
              :min="0"
              :max="999"
              placeholder="请输入显示顺序"
              class="w-full"
            />
          </el-form-item>
          <el-form-item label="分类描述" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="请输入分类描述（可选）"
            />
          </el-form-item>
          <el-form-item label="启用状态">
            <el-switch
              v-model="form.isActive"
              active-text="启用"
              inactive-text="禁用"
            />
            <div class="text-xs text-gray-500 mt-1">
              禁用后该分类将不会在前台显示
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          v-if="mode !== 'view'"
          type="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ mode === "add" ? "创建" : "保存" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { createCategory, updateCategory, getCategoryDetail } from "../api/index";
import type { NewsCategory, CategoryCreateForm } from "../types/types";

interface Props {
  visible: boolean;
  mode: "add" | "edit" | "view";
  formData?: NewsCategory | null;
  categories: NewsCategory[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:visible": [value: boolean];
  success: [];
}>();

const formRef = ref<FormInstance>();
const loading = ref(false);

// 当前分类ID（编辑时用于排除自己）
const currentCategoryId = computed(() => props.formData?.id);

// 弹窗标题
const dialogTitle = computed(() => {
  switch (props.mode) {
    case "add":
      return "新增分类";
    case "edit":
      return "编辑分类";
    case "view":
      return "查看分类";
    default:
      return "";
  }
});

// 弹窗显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: value => emit("update:visible", value)
});

// 表单数据
const form = ref<CategoryCreateForm>({
  name: "",
  description: "",
  displayOrder: 0,
  parentId: undefined,
  isActive: true
});

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
  displayOrder: [{ required: true, message: "请输入显示顺序", trigger: "blur" }]
};

// 监听弹窗显示状态
watch(
  () => props.visible,
  async visible => {
    if (visible) {
      if (props.mode === "add") {
        resetForm();
      } else if (props.formData?.id) {
        // 编辑或查看模式，调用详情接口获取完整数据
        loading.value = true;
        try {
          const response = await getCategoryDetail(props.formData.id);
          if (response.code === 200 && response.data) {
            const detail = response.data;
            form.value = {
              name: detail.name,
              description: detail.description || "",
              displayOrder: detail.displayOrder,
              parentId: detail.parentId,
              isActive: detail.isActive
            };
          } else {
            throw new Error(response.message || "获取分类详情失败");
          }
        } catch (error: any) {
          console.error("获取分类详情失败:", error);
          ElMessage.error(error.message || "获取分类详情失败");
          dialogVisible.value = false;
        } finally {
          loading.value = false;
        }
      }
    }
  }
);

// 重置表单
const resetForm = () => {
  form.value = {
    name: "",
    description: "",
    displayOrder: 0,
    parentId: undefined,
    isActive: true
  };
  nextTick(() => {
    formRef.value?.clearValidate();
  });
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    let response;
    if (props.mode === "add") {
      response = await createCategory(form.value);
    } else {
      response = await updateCategory(props.formData!.id, form.value);
    }

    if (response.code === 200) {
      ElMessage.success(props.mode === "add" ? "新增成功" : "修改成功");
      emit("success");
      handleCancel();
    } else {
      throw new Error(response.message || "提交失败");
    }
  } catch (error: any) {
    console.error("提交失败:", error);
    ElMessage.error(error.message || "提交失败");
  } finally {
    loading.value = false;
  }
};

// 取消
const handleCancel = () => {
  dialogVisible.value = false;
  resetForm();
};

// 工具函数
const getParentCategoryName = () => {
  if (!form.value.parentId) return null;
  const parent = props.categories.find(cat => cat.id === form.value.parentId);
  return parent ? parent.name : null;
};

const getStatusType = (status: number) => {
  switch (status) {
    case 0:
      return "danger";
    case 1:
      return "success";
    default:
      return "info";
  }
};

const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return "禁用";
    case 1:
      return "启用";
    default:
      return "未知";
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
</script>

<style scoped lang="scss">
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-select-dropdown__item) {
  height: auto;
  padding: 8px 20px;
}
</style>
