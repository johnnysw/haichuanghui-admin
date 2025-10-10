<template>
  <el-drawer
    v-model="drawerVisible"
    :title="drawerTitle"
    direction="rtl"
    size="65%"
    :before-close="handleClose"
    custom-class="event-drawer"
  >
    <el-form
      ref="formRef"
      :model="formInline"
      :rules="rules"
      label-width="120px"
      label-position="top"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="活动标题" prop="title">
            <el-input
              v-model="formInline.title"
              placeholder="请输入活动标题"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="活动类型" prop="eventTypeId">
            <el-select
              v-model="formInline.eventTypeId"
              placeholder="请选择活动类型"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="type in eventTypeOptions"
                :key="type.id"
                :label="type.name"
                :value="type.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="地区" prop="regionId">
            <el-select
              v-model="formInline.regionId"
              placeholder="请选择地区"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="region in regionOptions"
                :key="region.id"
                :label="region.name"
                :value="region.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主办方" prop="organizer">
            <el-input
              v-model="formInline.organizer"
              placeholder="请输入主办方"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="协办方" prop="coOrganizers">
            <el-input
              v-model="formInline.coOrganizers"
              placeholder="请输入协办方"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否推荐" prop="isRecommended">
            <el-switch
              v-model="formInline.isRecommended"
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="formInline.startTime"
              type="datetime"
              placeholder="请选择开始时间"
              style="width: 100%"
              value-format="YYYY-MM-DD HH:mm:ss"
              :teleported="false"
              :popper-class="'event-date-picker-popper'"
              placement="bottom-start"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="formInline.endTime"
              type="datetime"
              placeholder="请选择结束时间"
              style="width: 100%"
              value-format="YYYY-MM-DD HH:mm:ss"
              :teleported="false"
              :popper-class="'event-date-picker-popper'"
              placement="bottom-start"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="报名截止时间" prop="registrationDeadline">
            <el-date-picker
              v-model="formInline.registrationDeadline"
              type="datetime"
              placeholder="请选择报名截止时间"
              style="width: 100%"
              value-format="YYYY-MM-DD HH:mm:ss"
              :teleported="false"
              :popper-class="'event-date-picker-popper'"
              placement="bottom-start"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="举办地点" prop="location">
            <el-input
              v-model="formInline.location"
              placeholder="请输入举办地点"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="线上链接" prop="onlineUrl">
            <el-input
              v-model="formInline.onlineUrl"
              placeholder="请输入线上链接"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="formInline.status"
              placeholder="请选择状态"
              clearable
              style="width: 100%"
            >
              <el-option label="草稿" :value="0" />
              <el-option label="报名中" :value="1" />
              <el-option label="进行中" :value="2" />
              <el-option label="已结束" :value="3" />
              <el-option label="已取消" :value="4" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="最大参与人数" prop="maxParticipants">
            <el-input-number
              v-model="formInline.maxParticipants"
              :min="0"
              :max="999999"
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报名费用" prop="registrationFee">
            <el-input-number
              v-model="formInline.registrationFee"
              :min="0"
              :precision="2"
              :step="0.01"
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="价格说明" prop="priceNote">
            <el-input
              v-model="formInline.priceNote"
              type="textarea"
              placeholder="请输入价格说明"
              :rows="2"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="海报图片" prop="poster">
            <div class="event-poster-upload-container">
              <el-upload
                class="poster-uploader"
                drag
                :http-request="customUploadRequest"
                :show-file-list="false"
                :before-upload="beforePosterUpload"
              >
                <div
                  v-if="!formInline.poster"
                  class="poster-upload-placeholder"
                >
                  <el-icon class="poster-uploader-icon"
                    ><upload-filled
                  /></el-icon>
                  <div class="poster-upload-text-container">
                    <div class="poster-upload-text">点击或拖拽上传活动海报</div>
                    <div class="poster-upload-hint">
                      支持 JPG、PNG 格式，建议尺寸 800x600
                    </div>
                  </div>
                </div>
                <div v-else class="poster-preview-container">
                  <img :src="posterDisplayUrl" class="poster-preview" />
                  <div class="poster-preview-overlay">
                    <el-button
                      type="primary"
                      size="small"
                      @click.stop="replacePoster"
                    >
                      <el-icon><edit /></el-icon>
                      更换
                    </el-button>
                    <el-button
                      type="danger"
                      size="small"
                      @click.stop="removePoster"
                    >
                      <el-icon><delete /></el-icon>
                      删除
                    </el-button>
                  </div>
                </div>
              </el-upload>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 活动详情标签页 -->
      <el-tabs v-model="activeTab" class="event-detail-tabs">
        <el-tab-pane label="活动详情" name="description">
          <div class="wangeditor-container">
            <Toolbar
              :editor="descriptionEditorRef"
              :defaultConfig="toolbarConfig"
              mode="default"
              class="wangeditor-toolbar"
            />
            <Editor
              v-model="formInline.description"
              :defaultConfig="editorConfig"
              mode="default"
              class="wangeditor-editor"
              style="height: 400px"
              @onCreated="handleDescriptionCreated"
            />
          </div>
        </el-tab-pane>

        <el-tab-pane label="活动日程" name="schedule">
          <div class="wangeditor-container">
            <Toolbar
              :editor="scheduleEditorRef"
              :defaultConfig="toolbarConfig"
              mode="default"
              class="wangeditor-toolbar"
            />
            <Editor
              v-model="formInline.schedule"
              :defaultConfig="editorConfig"
              mode="default"
              class="wangeditor-editor"
              style="height: 400px"
              @onCreated="handleScheduleCreated"
            />
          </div>
        </el-tab-pane>

        <el-tab-pane label="常见问题" name="faq">
          <div class="wangeditor-container">
            <Toolbar
              :editor="faqEditorRef"
              :defaultConfig="toolbarConfig"
              mode="default"
              class="wangeditor-toolbar"
            />
            <Editor
              v-model="formInline.faq"
              :defaultConfig="editorConfig"
              mode="default"
              class="wangeditor-editor"
              style="height: 400px"
              @onCreated="handleFaqCreated"
            />
    </div>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <template #footer>
      <div style="flex: auto">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  onMounted,
  defineExpose,
  watch,
  onBeforeUnmount,
  shallowRef,
  computed,
  nextTick
} from "vue";
import { getEventTypes, getRegionList } from "../api";
import { message } from "@/utils/message";
import { uploadImage } from "@/api/upload";
import { getFullImageUrl } from "@/utils/image";
import type { EventForm, OptionItem } from "../types/types";
import type { Response } from "@/types/response";
import type { FileUploadResult } from "@/api/upload";

// 添加上传相关的导入
import { UploadFilled, Edit, Delete } from "@element-plus/icons-vue";

// 导入 wangEditor
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import type {
  IDomEditor,
  IEditorConfig,
  IToolbarConfig
} from "@wangeditor/editor";

const props = defineProps<{
  title: string;
  formData?: EventForm;
  visible: boolean;
  mode: "create" | "edit";
}>();

const emit = defineEmits<{
  (e: "update:visible", visible: boolean): void;
  (e: "submit", data: EventForm, mode: "create" | "edit"): void;
}>();

const drawerVisible = ref(false);
const drawerTitle = ref(props.title);
const formRef = ref();
const submitLoading = ref(false);
const activeTab = ref("description");

const DEFAULT_HTML = "<p><br></p>";

const formInline = reactive<EventForm>({
  id: undefined,
  title: "",
  eventTypeId: null,
  regionId: null,
  organizer: "",
  coOrganizers: "",
  status: 0,
  startTime: "",
  endTime: "",
  registrationDeadline: "",
  location: "",
  onlineUrl: "",
  isRecommended: false,
  poster: "",
  summary: "",
  description: DEFAULT_HTML,
  schedule: DEFAULT_HTML,
  faq: DEFAULT_HTML,
  maxParticipants: null,
  registrationFee: null,
  priceNote: ""
});

const eventTypeOptions = ref<OptionItem[]>([]);
const regionOptions = ref<OptionItem[]>([]);

// 计算属性：用于图片显示的完整URL
const posterDisplayUrl = computed(() => {
  if (!formInline.poster) return "";
  return getFullImageUrl(formInline.poster);
});

// 富文本编辑器引用 - 必须使用 shallowRef
const descriptionEditorRef = shallowRef<IDomEditor>();
const scheduleEditorRef = shallowRef<IDomEditor>();
const faqEditorRef = shallowRef<IDomEditor>();

// 标准化富文本内容
function normalizeEditorHtml(value?: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    return DEFAULT_HTML;
  }
  return value;
}

// 应用编辑器内容
function applyEditorContent(editor: IDomEditor | undefined, value?: string) {
  if (!editor) return;
  
  // 检查编辑器是否已销毁
  if (editor.isDestroyed) return;
  
  const html = normalizeEditorHtml(value);
  
  // 只有当内容真正不同时才设置
  try {
    const currentHtml = editor.getHtml();
    if (currentHtml !== html) {
      editor.setHtml(html);
    }
  } catch (error) {
    // 如果获取或设置内容时出错，静默处理
    console.warn('Editor content update failed:', error);
  }
}

// 同步所有编辑器的值
function syncEditorValues() {
  applyEditorContent(descriptionEditorRef.value, formInline.description);
  applyEditorContent(scheduleEditorRef.value, formInline.schedule);
  applyEditorContent(faqEditorRef.value, formInline.faq);
}

// 富文本编辑器工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    "bold",
    "underline",
    "italic",
    "through",
    "color",
    "bgColor",
    "|",
    "fontSize",
    "fontFamily",
    "lineHeight",
    "|",
    "bulletedList",
    "numberedList",
    "todo",
    "|",
    "justifyLeft",
    "justifyRight",
    "justifyCenter",
    "justifyJustify",
    "|",
    "insertLink",
    "uploadImage",
    "|",
    "undo",
    "redo"
  ]
};

// 富文本编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: "请输入内容...",
  scroll: true,
  MENU_CONF: {
    // 配置图片上传
    uploadImage: {
      async customUpload(file: File, insertFn: Function) {
        try {
          const result: Response<FileUploadResult> = await uploadImage(
            file,
            "event"
          );
          if (result && result.code === 200 && result.data?.url) {
            const fullImageUrl = getFullImageUrl(result.data.url);
            insertFn(fullImageUrl, "", fullImageUrl);
            message("图片上传成功", { type: "success" });
          } else {
            message(result?.message || "图片上传失败", { type: "error" });
          }
        } catch (error: any) {
          const errorMsg =
            error?.response?.data?.message || error.message || "图片上传失败";
          message(errorMsg, { type: "error" });
        }
      }
    }
  }
};

// 监听props.title变化
watch(
  () => props.title,
  newVal => {
    if (newVal) {
      drawerTitle.value = newVal;
    }
  },
  { immediate: true }
);

// 填充表单数据
function fillForm(data?: EventForm) {
  if (!data) {
    resetForm();
    return;
  }

  const formData = { ...data };
  if (formData.eventTypeId === 0) formData.eventTypeId = null;
  if (formData.regionId === 0) formData.regionId = null;

  // 处理富文本内容，确保有默认值
  formData.description = normalizeEditorHtml(formData.description);
  formData.schedule = normalizeEditorHtml(formData.schedule);
  formData.faq = normalizeEditorHtml(formData.faq);

  // 处理数字类型字段，确保是 number 或 null
  if (formData.maxParticipants !== undefined && formData.maxParticipants !== null) {
    formData.maxParticipants = Number(formData.maxParticipants);
  }
  if (formData.registrationFee !== undefined && formData.registrationFee !== null) {
    formData.registrationFee = Number(formData.registrationFee);
  }

  // 更新表单数据
  Object.assign(formInline, formData);
  
  // 只在抽屉可见时同步编辑器内容，避免在关闭状态下操作编辑器
  if (drawerVisible.value) {
    // 使用 nextTick 确保 DOM 已更新
    nextTick(() => {
      syncEditorValues();
    });
  }
}

// 监听props.formData变化
watch(
  () => props.formData,
  newVal => {
    if (newVal) {
      fillForm(newVal);
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

// 监听props.visible变化
watch(
  () => props.visible,
  newVal => {
    drawerVisible.value = newVal;
    
    // 如果抽屉关闭，延迟同步编辑器以避免状态错误
    if (!newVal) {
      // 抽屉关闭时，不立即同步编辑器
      // 等待下次打开时再同步
    }
  },
  { immediate: true }
);

// 监听drawerVisible变化
watch(
  () => drawerVisible.value,
  newVal => {
    emit("update:visible", newVal);
  }
);

// 表单验证规则
const rules = reactive({
  title: [{ required: true, message: "活动标题不能为空", trigger: "blur" }],
  organizer: [{ required: true, message: "主办方不能为空", trigger: "blur" }],
  status: [{ required: true, message: "状态不能为空", trigger: "change" }]
});

// 获取活动类型选项
const fetchEventTypes = async () => {
  try {
    const result = await getEventTypes();
    if (result.code === 200) {
      eventTypeOptions.value = result.data || [];
    }
  } catch (error) {
    console.error("获取活动类型失败:", error);
  }
};

// 获取地区选项
const fetchRegions = async () => {
  try {
    const result = await getRegionList();
    if (result.code === 200) {
      regionOptions.value = result.data || [];
    }
  } catch (error) {
    console.error("获取地区失败:", error);
  }
};

// 编辑器创建回调
const handleDescriptionCreated = (editor: IDomEditor) => {
  descriptionEditorRef.value = editor;
  applyEditorContent(editor, formInline.description);
};

const handleScheduleCreated = (editor: IDomEditor) => {
  scheduleEditorRef.value = editor;
  applyEditorContent(editor, formInline.schedule);
};

const handleFaqCreated = (editor: IDomEditor) => {
  faqEditorRef.value = editor;
  applyEditorContent(editor, formInline.faq);
};

// 组件挂载时获取选项数据
onMounted(() => {
  fetchEventTypes();
  fetchRegions();
});

// 组件销毁时销毁编辑器
onBeforeUnmount(() => {
  const editors = [
    descriptionEditorRef.value,
    scheduleEditorRef.value,
    faqEditorRef.value
  ];

  editors.forEach(editor => {
    if (editor == null) return;
    editor.destroy();
  });
});

// 显示抽屉
const showDrawer = () => {
  drawerVisible.value = true;
};

// 关闭抽屉
const handleClose = () => {
  drawerVisible.value = false;
  resetForm();
};

// 取消操作
const handleCancel = () => {
  handleClose();
};

// 提交表单
const handleSubmit = () => {
  if (!formRef.value) return;

  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      emit("submit", { ...formInline }, props.mode);
      handleClose();
    }
  });
};

// 重置表单
function resetForm() {
  // 清除表单验证
  if (formRef.value) {
    formRef.value.clearValidate();
  }

  Object.assign(formInline, {
    id: undefined,
    title: "",
    eventTypeId: null,
    regionId: null,
    organizer: "",
    coOrganizers: "",
    status: 0,
    startTime: "",
    endTime: "",
    registrationDeadline: "",
    location: "",
    onlineUrl: "",
    isRecommended: false,
    poster: "",
    summary: "",
    description: DEFAULT_HTML,
    schedule: DEFAULT_HTML,
    faq: DEFAULT_HTML,
    maxParticipants: null,
    registrationFee: null,
    priceNote: ""
  });

  // 只在抽屉可见时同步编辑器内容
  if (drawerVisible.value) {
    nextTick(() => {
      syncEditorValues();
    });
  }
}

// 自定义上传请求函数，用于 el-upload 组件的 http-request 属性
async function customUploadRequest(options: any) {
  const { file, onSuccess, onError } = options;

  // 检查文件是否存在
  if (!file) {
    const errorMsg = "请选择要上传的图片文件";
    message(errorMsg, { type: "error" });
    onError(new Error(errorMsg));
    return;
  }

  // 文件类型验证
  const isImage = file.type.startsWith("image/");
  if (!isImage) {
    const errorMsg = "只能上传图片文件";
    message(errorMsg, { type: "error" });
    onError(new Error(errorMsg));
    return;
  }

  // 文件大小验证 (5MB)
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    const errorMsg = "图片大小不能超过 5MB";
    message(errorMsg, { type: "error" });
    onError(new Error(errorMsg));
    return;
  }

  try {
    // 调用上传API，传递模块参数 'event'
    const result: Response<FileUploadResult> = await uploadImage(
      file,
      "event"
    );

    if (result && result.code === 200 && result.data?.url) {
      // 上传成功，更新表单中的海报URL（存储相对路径）
      formInline.poster = result.data.url;
      message(result.message || "上传图片成功", { type: "success" });
      // 调用 onSuccess 回调
      onSuccess(result);
    } else {
      // 上传失败
      const errorMsg = result?.message || "上传失败";
      message(errorMsg, { type: "error" });
      onError(new Error(errorMsg));
    }
  } catch (error: any) {
    // 捕获上传过程中的错误
    const errorMsg =
      error?.response?.data?.message || error.message || "上传请求失败";
    message(errorMsg, { type: "error" });
    onError(error);
  }
}

// 海报上传前的验证
const beforePosterUpload = (file: File) => {
  // 这里可以添加一些简单的预检查，但主要验证在 customUploadRequest 中进行
  return true;
};

// 更换图片
const replacePoster = (event: Event) => {
  // 触发文件选择对话框来更换图片
  const uploadElement = document.querySelector(
    ".poster-uploader .el-upload"
  ) as HTMLElement;
  if (uploadElement) {
    uploadElement.click();
  }
};

// 移除图片
const removePoster = (event: Event) => {
  formInline.poster = "";
};

defineExpose({
  showDrawer,
  resetForm
});
</script>

<style scoped>
.event-drawer :deep(.el-drawer__header) {
  margin-bottom: 15px !important;
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

/* 标签页样式 */
.event-detail-tabs {
  margin-top: 20px;
}

.event-detail-tabs :deep(.el-tabs__header) {
  margin-bottom: 20px;
}

.event-detail-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
}

.event-detail-tabs :deep(.el-tab-pane) {
  padding: 0;
}

/* 修复日期选择器弹出层定位问题 */
.event-date-picker-popper {
  z-index: 3000 !important;
}

/* wangEditor 样式 */
.wangeditor-container {
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  overflow: hidden;
}

.wangeditor-toolbar {
  border-bottom: 1px solid var(--el-border-color);
}

.wangeditor-editor {
  min-height: 320px;
  overflow-y: auto;
}

/* 确保编辑器在抽屉中正常显示 */
.wangeditor-container .w-e-text-container {
  min-height: 320px !important;
  height: 320px !important;
}

.wangeditor-container .w-e-text {
  min-height: 320px !important;
  height: 320px !important;
}

.wangeditor-container .w-e-scroll {
  min-height: 320px !important;
}

/* 海报上传样式 */
.event-poster-upload-container {
  width: 100%;
}

/* 仅针对活动海报上传的 el-upload-dragger 样式覆盖 */
.event-poster-upload-container :deep(.el-upload-dragger) {
  padding: 0 !important;
  margin: 0 !important;
}

.poster-uploader {
  width: 100%;
}

.poster-uploader .el-upload {
  width: 100%;
  border: 1px dashed var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.poster-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.poster-upload-placeholder {
  padding: 8px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
}

.poster-uploader-icon {
  font-size: 36px;
  color: var(--el-text-color-secondary);
  margin-right: 12px;
  margin-bottom: 0;
}

.poster-upload-text-container {
  text-align: left;
}

.poster-upload-text {
  font-size: 14px;
  color: var(--el-text-color-primary);
  margin-bottom: 2px;
}

.poster-upload-hint {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.poster-preview-container {
  position: relative;
  width: 100%;
  height: 100px;
  overflow: hidden;
  border-radius: 8px;
}

.poster-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.poster-preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s;
}

.poster-preview-container:hover .poster-preview-overlay {
  opacity: 1;
}
</style>
