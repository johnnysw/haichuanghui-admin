<template>
  <el-drawer
    v-model="dialogVisible"
    :title="dialogTitle"
    direction="rtl"
    size="70%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
      :disabled="mode === 'view'"
      class="drawer-form"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <el-form-item label="资讯摘要" prop="summary" class="md:col-span-2">
          <el-input
            v-model="form.summary"
            type="textarea"
            :rows="3"
            placeholder="请输入资讯摘要"
          />
        </el-form-item>

        <el-form-item label="封面图片" prop="coverImage" class="md:col-span-2">
          <div class="cover-uploader-wrapper">
            <el-upload
              class="cover-uploader"
              drag
              :show-file-list="false"
              :http-request="handleCoverUpload"
              :before-upload="beforeCoverUpload"
            >
              <template v-if="!form.coverImage">
                <div class="cover-placeholder">
                  <el-icon class="cover-icon"><UploadFilled /></el-icon>
                  <div class="cover-text">点击或拖拽上传封面图片</div>
                  <div class="cover-tip">
                    建议尺寸：400x240像素，支持 JPG、PNG 格式，文件大小不超过 5MB
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="cover-preview">
                  <img :src="coverImageDisplayUrl" alt="cover" />
                  <div class="cover-preview__mask">
                    <el-button size="small" type="primary">重新上传</el-button>
                    <el-button
                      size="small"
                      type="danger"
                      @click.stop="removeCoverImage"
                      >移除</el-button
                    >
                  </div>
                </div>
              </template>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="正文内容" prop="content" class="md:col-span-2">
          <div class="wangeditor">
            <Toolbar
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              :mode="editorMode"
              style="border-bottom: 1px solid #e5e7eb"
            />
            <Editor
              v-model="form.content"
              :defaultConfig="editorConfig"
              :mode="editorMode"
              style="height: 360px; overflow-y: hidden"
              @onCreated="handleCreated"
              @onBlur="
                () =>
                  formRef?.validateField && formRef?.validateField('content')
              "
            />
          </div>
        </el-form-item>

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

        <el-form-item label="浏览量" prop="viewCount">
          <el-input-number
            v-model="form.viewCount"
            :min="0"
            :step="1"
            placeholder="请输入浏览量"
            class="w-full"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="点赞数" prop="likeCount">
          <el-input-number
            v-model="form.likeCount"
            :min="0"
            :step="1"
            placeholder="请输入点赞数"
            class="w-full"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="收藏数" prop="favoriteCount">
          <el-input-number
            v-model="form.favoriteCount"
            :min="0"
            :step="1"
            placeholder="请输入收藏数"
            class="w-full"
            controls-position="right"
          />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <div class="drawer-footer">
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
  </el-drawer>
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
import { Plus, UploadFilled } from "@element-plus/icons-vue";
import type { FormInstance, FormRules, UploadRequestOptions } from "element-plus";
import { createNews, updateNews, getNewsDetail } from "../api/index";
import type { NewsItem, NewsCreateForm, NewsCategory } from "../types/types";
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { uploadImage } from "@/api/upload";
import { getFullImageUrl } from "@/utils/image";

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
const coverImageDisplayUrl = ref<string>("");

// 富文本编辑器
const editorMode = "default";
const editorRef = shallowRef();
const toolbarConfig: any = { excludeKeys: "fullScreen" };
const editorConfig = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      async customUpload(file: File, insertFn: Function) {
        try {
          const result = await uploadImage(file, "news");
          if (result && result.code === 200 && result.data?.url) {
            const fullImageUrl = getFullImageUrl(result.data.url);
            insertFn(fullImageUrl, "", fullImageUrl);
            ElMessage.success(result.message || "图片上传成功");
          } else {
            ElMessage.error(result?.message || "图片上传失败");
          }
        } catch (error: any) {
          ElMessage.error(error?.message || "图片上传失败");
        }
      }
    }
  }
} as any;
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
  viewCount: 0,
  likeCount: 0,
  favoriteCount: 0
});

// 表单验证规则
const rules: FormRules = {
  title: [{ required: true, message: "请输入资讯标题", trigger: "blur" }],
  content: [{ required: true, message: "请输入正文内容", trigger: "blur" }],
  categoryId: [{ required: true, message: "请选择分类", trigger: "change" }]
};

// 监听弹窗显示状态
watch(
  () => props.visible,
  async visible => {
    if (visible) {
      if (props.mode === "add") {
        resetForm();
      } else if (props.formData) {
        // 编辑或查看模式，先获取完整的资讯详情
        try {
          const response = await getNewsDetail(props.formData.id);
          if (response.code === 200 && response.data) {
            const detail = response.data;
            form.value = {
              title: detail.title,
              subtitle: detail.subtitle || "",
              author: detail.author,
              source: detail.source || "",
              summary: detail.summary || "",
              content: detail.content || "",
              coverImage: detail.coverImage || "",
              publishTime: detail.publishTime || "",
              categoryId: detail.categoryId,
              isRecommended: detail.isRecommended,
              isTop: detail.isTop,
              viewCount: detail.viewCount || 0,
              likeCount: detail.likeCount || 0,
              favoriteCount: detail.favoriteCount || 0
            };
            updateCoverImagePreview();
          } else {
            ElMessage.error("获取资讯详情失败");
          }
        } catch (error) {
          console.error("获取资讯详情失败:", error);
          ElMessage.error("获取资讯详情失败");
        }
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
    viewCount: 0,
    likeCount: 0,
    favoriteCount: 0
  };
  updateCoverImagePreview();
  nextTick(() => {
    formRef.value?.clearValidate();
  });
};

// 更新封面图片预览
const updateCoverImagePreview = () => {
  coverImageDisplayUrl.value = form.value.coverImage
    ? getFullImageUrl(form.value.coverImage)
    : "";
};

// 封面图片上传
const handleCoverUpload = async (options: UploadRequestOptions) => {
  const { file, onError, onSuccess } = options;
  try {
    const res = await uploadImage(file as File, "news");
    if (res.code === 200 && res.data?.url) {
      form.value.coverImage = res.data.url;
      updateCoverImagePreview();
      ElMessage.success(res.message || "上传成功");
      onSuccess?.(res as any);
    } else {
      const msg = res.message || "上传失败";
      ElMessage.error(msg);
      onError?.(msg as any);
    }
  } catch (error: any) {
    const msg = error?.message || "上传失败";
    ElMessage.error(msg);
    onError?.(msg as any);
  }
};

// 封面图片上传前验证
const beforeCoverUpload = (file: File) => {
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    ElMessage.error("仅支持上传图片文件");
    return false;
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    ElMessage.error("图片大小不能超过 5MB");
    return false;
  }
  return true;
};

// 移除封面图片
const removeCoverImage = () => {
  form.value.coverImage = "";
  updateCoverImagePreview();
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    let response;
    if (props.mode === "add") {
      response = await createNews(form.value);
    } else {
      response = await updateNews(props.formData!.id, form.value);
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
</script>

<style scoped lang="scss">
.drawer-form {
  padding: 0 20px 20px;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.cover-uploader-wrapper {
  width: 100%;
}

.cover-uploader {
  width: 400px;
  height: 240px;
  border-radius: 8px;
}

.cover-uploader :deep(.el-upload-dragger) {
  width: 400px;
  height: 240px;
  padding: 0;
  border: 1px dashed var(--el-border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.cover-placeholder {
  text-align: center;
}

.cover-icon {
  font-size: 32px;
  color: var(--el-text-color-secondary);
  margin-bottom: 6px;
}

.cover-text {
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.cover-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

.cover-preview {
  position: relative;
  width: 400px;
  height: 240px;
  border-radius: 8px;
  overflow: hidden;
}

.cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-preview__mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.55);
  opacity: 0;
  transition: opacity 0.3s;
}

.cover-preview:hover .cover-preview__mask {
  opacity: 1;
}

.cover-preview__mask .el-button {
  width: 96px;
}

.wangeditor {
  border: 1px solid var(--el-border-color);
  border-radius: 4px;
  overflow: hidden;
}
</style>
