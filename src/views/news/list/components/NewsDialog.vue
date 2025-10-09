<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="900px"
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
          <el-form-item label="资讯标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入资讯标题" />
          </el-form-item>
          <el-form-item label="副标题" prop="subtitle">
            <el-input
              v-model="form.subtitle"
              placeholder="请输入副标题（可选）"
            />
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input v-model="form.author" placeholder="请输入作者" />
          </el-form-item>
          <el-form-item label="来源" prop="source">
            <el-input v-model="form.source" placeholder="请输入来源（可选）" />
          </el-form-item>
          <el-form-item label="分类" prop="categoryId">
            <el-select
              v-model="form.categoryId"
              placeholder="请选择分类"
              class="w-full"
            >
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间" prop="publishTime">
            <el-date-picker
              v-model="form.publishTime"
              type="datetime"
              placeholder="选择发布时间"
              value-format="YYYY-MM-DDTHH:mm:ssZ"
              class="w-full"
            />
          </el-form-item>
        </div>
        <el-form-item label="资讯摘要" prop="summary">
          <el-input
            v-model="form.summary"
            type="textarea"
            :rows="3"
            placeholder="请输入资讯摘要"
          />
        </el-form-item>
      </div>

      <!-- 封面图片 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-1 h-5 bg-primary rounded mr-3" />
          封面图片
        </h3>
        <el-form-item label="封面图片" prop="coverImage">
          <div class="w-full">
            <el-upload
              class="cover-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeUpload"
              accept="image/*"
            >
              <img
                v-if="form.coverImage"
                :src="form.coverImage"
                class="cover-image"
              />
              <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="text-xs text-gray-500 mt-2">
              建议尺寸：400x240像素，支持 JPG、PNG 格式，文件大小不超过 2MB
            </div>
          </div>
        </el-form-item>
      </div>

      <!-- 内容编辑 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-1 h-5 bg-primary rounded mr-3" />
          内容编辑
        </h3>
        <el-form-item label="正文内容" prop="content">
          <div class="wangeditor">
            <Toolbar
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              :mode="mode"
              style="border-bottom: 1px solid #e5e7eb"
            />
            <Editor
              v-model="form.content"
              :defaultConfig="editorConfig"
              :mode="mode"
              style="height: 360px; overflow-y: hidden"
              @onCreated="handleCreated"
              @onBlur="
                () =>
                  formRef?.value?.validateField &&
                  formRef.value?.validateField('content')
              "
            />
          </div>
        </el-form-item>
      </div>

      <!-- 状态设置 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-1 h-5 bg-primary rounded mr-3" />
          状态设置
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <el-form-item label="推荐状态">
            <el-switch
              v-model="form.isRecommended"
              active-text="推荐"
              inactive-text="不推荐"
            />
          </el-form-item>
          <el-form-item label="置顶状态">
            <el-switch
              v-model="form.isTop"
              active-text="置顶"
              inactive-text="不置顶"
            />
          </el-form-item>
        </div>
      </div>

      <!-- SEO设置 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-1 h-5 bg-primary rounded mr-3" />
          SEO设置
        </h3>
        <el-form-item label="SEO标题" prop="seoTitle">
          <el-input
            v-model="form.seoTitle"
            placeholder="请输入SEO标题（可选）"
          />
        </el-form-item>
        <el-form-item label="SEO关键词" prop="seoKeywords">
          <el-input
            v-model="form.seoKeywords"
            placeholder="请输入SEO关键词，用逗号分隔（可选）"
          />
        </el-form-item>
        <el-form-item label="SEO描述" prop="seoDescription">
          <el-input
            v-model="form.seoDescription"
            type="textarea"
            :rows="2"
            placeholder="请输入SEO描述（可选）"
          />
        </el-form-item>
      </div>

      <!-- 资讯标签 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-1 h-5 bg-primary rounded mr-3" />
          资讯标签
        </h3>
        <el-form-item label="标签">
          <div class="w-full">
            <div class="flex flex-wrap gap-2 mb-2">
              <el-tag
                v-for="(tag, index) in form.tags"
                :key="index"
                closable
                @close="removeTag(index)"
              >
                {{ tag }}
              </el-tag>
            </div>
            <div class="flex gap-2">
              <el-input
                v-model="tagInput"
                placeholder="输入标签后按回车添加"
                style="width: 200px"
                @keyup.enter="addTag"
              />
              <el-button @click="addTag">添加标签</el-button>
            </div>
          </div>
        </el-form-item>
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
import {
  ref,
  computed,
  watch,
  nextTick,
  onBeforeUnmount,
  shallowRef
} from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import { createNews, updateNews } from "../api/index";
import type { NewsItem, NewsCreateForm, NewsCategory } from "../types/types";
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

interface Props {
  visible: boolean;
  mode: "add" | "edit" | "view";
  formData?: NewsItem | null;
  categories: NewsCategory[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:visible": [value: boolean];
  success: [];
}>();

const formRef = ref<FormInstance>();
const loading = ref(false);
const tagInput = ref("");

// 富文本编辑器
const mode = "default";
const editorRef = shallowRef();
const toolbarConfig: any = { excludeKeys: "fullScreen" };
const editorConfig = { placeholder: "请输入内容..." } as any;
const handleCreated = (editor: any) => {
  editorRef.value = editor;
};

onBeforeUnmount(() => {
  const editor = editorRef.value as any;
  if (editor) editor.destroy();
});

// 弹窗标题
const dialogTitle = computed(() => {
  switch (props.mode) {
    case "add":
      return "新增资讯";
    case "edit":
      return "编辑资讯";
    case "view":
      return "查看资讯";
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
const form = ref<NewsCreateForm>({
  title: "",
  subtitle: "",
  author: "",
  source: "",
  summary: "",
  content: "",
  coverImage: "",
  publishTime: "",
  categoryId: undefined,
  isRecommended: false,
  isTop: false,
  seoTitle: "",
  seoKeywords: "",
  seoDescription: "",
  tags: []
});

// 表单验证规则
const rules: FormRules = {
  title: [{ required: true, message: "请输入资讯标题", trigger: "blur" }],
  author: [{ required: true, message: "请输入作者", trigger: "blur" }],
  content: [{ required: true, message: "请输入正文内容", trigger: "blur" }],
  categoryId: [{ required: true, message: "请选择分类", trigger: "change" }]
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
          title: props.formData.title,
          subtitle: props.formData.subtitle || "",
          author: props.formData.author,
          source: props.formData.source || "",
          summary: props.formData.summary || "",
          content: props.formData.content || "",
          coverImage: props.formData.coverImage || "",
          publishTime: props.formData.publishTime || "",
          categoryId: props.formData.categoryId,
          isRecommended: props.formData.isRecommended,
          isTop: props.formData.isTop,
          seoTitle: props.formData.seoTitle || "",
          seoKeywords: props.formData.seoKeywords || "",
          seoDescription: props.formData.seoDescription || "",
          tags: [...(props.formData.tags || [])]
        };
      }
    }
  }
);

// 重置表单
const resetForm = () => {
  form.value = {
    title: "",
    subtitle: "",
    author: "",
    source: "",
    summary: "",
    content: "",
    coverImage: "",
    publishTime: "",
    categoryId: undefined,
    isRecommended: false,
    isTop: false,
    seoTitle: "",
    seoKeywords: "",
    seoDescription: "",
    tags: []
  };
  tagInput.value = "";
  nextTick(() => {
    formRef.value?.clearValidate();
  });
};

// 文件上传前的处理
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith("image/");
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error("只能上传图片格式的文件!");
    return false;
  }
  if (!isLt2M) {
    ElMessage.error("上传图片大小不能超过 2MB!");
    return false;
  }

  // 模拟上传成功，生成一个临时URL
  const reader = new FileReader();
  reader.onload = e => {
    form.value.coverImage = e.target?.result as string;
  };
  reader.readAsDataURL(file);

  return false; // 阻止默认上传行为
};

// 标签相关方法
const addTag = () => {
  if (tagInput.value.trim()) {
    if (!form.value.tags) {
      form.value.tags = [];
    }
    if (!form.value.tags.includes(tagInput.value.trim())) {
      form.value.tags.push(tagInput.value.trim());
    }
    tagInput.value = "";
  }
};

const removeTag = (index: number) => {
  form.value.tags?.splice(index, 1);
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    if (props.mode === "add") {
      await createNews(form.value);
      ElMessage.success("新增成功");
    } else {
      await updateNews(props.formData!.id, form.value);
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
</script>

<style scoped lang="scss">
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cover-uploader {
  :deep(.el-upload) {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    &:hover {
      border-color: var(--el-color-primary);
    }
  }
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fafafa;
}

.cover-image {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
}
</style>
