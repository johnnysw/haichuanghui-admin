<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="800px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-position="left"
      :disabled="mode === 'view'"
    >
      <!-- 基本信息 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-1 h-5 bg-primary rounded mr-3" />
          基本信息
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入分类名称" />
          </el-form-item>
          <el-form-item label="分类代码" prop="code">
            <el-input v-model="form.code" placeholder="请输入分类代码" />
            <div class="text-xs text-gray-500 mt-1">
              用于URL路径，建议使用英文和下划线
            </div>
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
        </div>
        <el-form-item label="分类描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述（可选）"
          />
        </el-form-item>
      </div>

      <!-- 图标设置 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-1 h-5 bg-primary rounded mr-3" />
          图标设置
        </h3>
        <el-form-item label="分类图标" prop="icon">
          <div class="w-full">
            <el-select
              v-model="form.icon"
              placeholder="请选择分类图标"
              class="w-full"
            >
              <el-option label="无图标" :value="undefined">
                <div class="flex items-center">
                  <span class="text-gray-400 mr-2">无</span>
                  <span>无图标</span>
                </div>
              </el-option>
              <el-option
                v-for="option in iconOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              >
                <div class="flex items-center">
                  <el-icon class="mr-2">
                    <component :is="useRenderIcon(option.icon)" />
                  </el-icon>
                  <span>{{ option.label }}</span>
                </div>
              </el-option>
            </el-select>
            <div class="mt-3">
              <span class="text-sm text-gray-600">预览：</span>
              <el-icon v-if="form.icon" class="ml-2 text-gray-600" size="20">
                <component :is="useRenderIcon(form.icon)" />
              </el-icon>
              <span v-else class="ml-2 text-gray-400">无图标</span>
            </div>
          </div>
        </el-form-item>
      </div>

      <!-- 显示设置 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-1 h-5 bg-primary rounded mr-3" />
          显示设置
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <el-form-item label="导航显示">
            <el-switch
              v-model="form.isNavigation"
              active-text="显示"
              inactive-text="隐藏"
            />
            <div class="text-xs text-gray-500 mt-1">
              是否在前台导航菜单中显示
            </div>
          </el-form-item>
        </div>
      </div>

      <!-- 查看模式下显示额外信息 -->
      <div v-if="mode === 'view' && formData" class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-1 h-5 bg-primary rounded mr-3" />
          其他信息
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >分类ID</label
            >
            <div class="text-gray-900">{{ formData.id }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >层级</label
            >
            <div class="text-gray-900">{{ formData.level }}级分类</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >文章数量</label
            >
            <div class="text-blue-600 font-medium">
              {{ formData.articleCount }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >审核状态</label
            >
            <el-tag :type="getStatusType(formData.status)" effect="plain">
              {{ getStatusText(formData.status) }}
            </el-tag>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >创建时间</label
            >
            <div class="text-gray-900">
              {{ formatDateTime(formData.createdTime) }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >更新时间</label
            >
            <div class="text-gray-900">
              {{ formatDateTime(formData.updatedTime) }}
            </div>
          </div>
        </div>
        <div v-if="formData.reviewComment" class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >审核意见</label
          >
          <div class="bg-gray-50 p-3 rounded text-gray-900">
            {{ formData.reviewComment }}
          </div>
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
import { createCategory, updateCategory } from "../api/index";
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
  code: "",
  description: "",
  icon: "",
  displayOrder: 0,
  parentId: undefined,
  isActive: true,
  isNavigation: false
});

// 图标选项
const iconOptions = [
  {
    value: "ri:calendar-event-line",
    label: "活动",
    icon: "ri:calendar-event-line"
  },
  { value: "ri:government-line", label: "政策", icon: "ri:government-line" },
  { value: "ri:bar-chart-line", label: "报告", icon: "ri:bar-chart-line" },
  { value: "ri:line-chart-line", label: "动态", icon: "ri:line-chart-line" },
  { value: "ri:rocket-line", label: "技术", icon: "ri:rocket-line" },
  { value: "ri:building-line", label: "企业", icon: "ri:building-line" },
  {
    value: "ri:money-dollar-circle-line",
    label: "投资",
    icon: "ri:money-dollar-circle-line"
  },
  { value: "ri:user-star-line", label: "人才", icon: "ri:user-star-line" },
  { value: "ri:global-line", label: "国际", icon: "ri:global-line" },
  { value: "ri:lightbulb-line", label: "创新", icon: "ri:lightbulb-line" },
  { value: "ri:newspaper-line", label: "新闻", icon: "ri:newspaper-line" },
  { value: "ri:file-text-line", label: "文档", icon: "ri:file-text-line" },
  { value: "ri:trophy-line", label: "竞赛", icon: "ri:trophy-line" },
  {
    value: "ri:graduation-cap-line",
    label: "教育",
    icon: "ri:graduation-cap-line"
  },
  { value: "ri:community-line", label: "社区", icon: "ri:community-line" }
];

// 表单验证规则
const rules: FormRules = {
  name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
  code: [
    { required: true, message: "请输入分类代码", trigger: "blur" },
    {
      pattern: /^[a-z_]+$/,
      message: "分类代码只能包含小写字母和下划线",
      trigger: "blur"
    }
  ],
  displayOrder: [{ required: true, message: "请输入显示顺序", trigger: "blur" }]
};

// 监听弹窗显示状态
watch(
  () => props.visible,
  visible => {
    if (visible) {
      if (props.mode === "add") {
        resetForm();
      } else if (props.formData) {
        // 编辑或查看模式，填充表单数据
        form.value = {
          name: props.formData.name,
          code: props.formData.code,
          description: props.formData.description || "",
          icon: props.formData.icon || "",
          displayOrder: props.formData.displayOrder,
          parentId: props.formData.parentId,
          isActive: props.formData.isActive,
          isNavigation: props.formData.isNavigation
        };
      }
    }
  }
);

// 重置表单
const resetForm = () => {
  form.value = {
    name: "",
    code: "",
    description: "",
    icon: "",
    displayOrder: 0,
    parentId: undefined,
    isActive: true,
    isNavigation: false
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

    if (props.mode === "add") {
      await createCategory(form.value);
      ElMessage.success("新增成功");
    } else {
      await updateCategory(props.formData!.id, form.value);
      ElMessage.success("修改成功");
    }

    emit("success");
    handleCancel();
  } catch (error) {
    console.error("提交失败:", error);
    ElMessage.error("提交失败");
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
const getStatusType = (status: number) => {
  switch (status) {
    case 0:
      return "warning";
    case 1:
      return "success";
    case 2:
      return "danger";
    default:
      return "info";
  }
};

const getStatusText = (status: number) => {
  switch (status) {
    case 0:
      return "待审核";
    case 1:
      return "已审核";
    case 2:
      return "已拒绝";
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
