<template>
  <el-drawer
    v-model="visible"
    :title="drawerTitle"
    direction="rtl"
    size="70%"
    :before-close="handleClose"
    custom-class="offshore-drawer"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-position="top"
    >
      <!-- 基本信息 -->
      <div class="form-section">
        <div class="form-section-title">基本信息</div>
        <el-row :gutter="24">
          <el-col :span="12">
          <el-form-item label="中心名称" prop="name">
              <el-input
                v-model="form.name"
                placeholder="请输入中心名称"
                clearable
              />
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中心类型" prop="centerTypeId">
              <el-select
                v-model="form.centerTypeId"
                placeholder="请选择中心类型"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in centerTypeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
            </el-select>
          </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="简介" prop="description">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="3"
                placeholder="请输入中心简介"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 地区信息 -->
      <div class="form-section">
        <div class="form-section-title">地区信息</div>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="地区" prop="regionId">
              <el-select
                v-model="form.regionId"
                placeholder="请选择地区"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in regionOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
            </el-select>
          </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="国家" prop="country">
              <el-input
                v-model="form.country"
                placeholder="请输入国家"
                clearable
            />
          </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="城市" prop="city">
              <el-input v-model="form.city" placeholder="请输入城市" clearable />
          </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="详细地址" prop="address">
          <el-input
                v-model="form.address"
                placeholder="请输入详细地址"
                clearable
          />
        </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 联系方式 -->
      <div class="form-section">
        <div class="form-section-title">联系方式</div>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="联系人" prop="contactPerson">
              <el-input
                v-model="form.contactPerson"
                placeholder="请输入联系人"
                clearable
              />
          </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item label="联系电话" prop="contactPhone">
              <el-input
                v-model="form.contactPhone"
                placeholder="请输入联系电话"
                clearable
              />
          </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item label="联系邮箱" prop="contactEmail">
              <el-input
                v-model="form.contactEmail"
                placeholder="请输入联系邮箱"
                clearable
              />
          </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="官方网站" prop="website">
              <el-input
                v-model="form.website"
                placeholder="请输入官方网站"
                clearable
              />
          </el-form-item>
          </el-col>
        </el-row>
        </div>

      <!-- 中心数据 -->
      <div class="form-section">
        <div class="form-section-title">中心数据</div>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="成立年份" prop="establishedYear">
              <el-input-number
                v-model="form.establishedYear"
                :min="1900"
                :max="2100"
                :controls="false"
                placeholder="请输入成立年份"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="面积" prop="area">
              <el-input
                v-model="form.area"
                placeholder="如：1000㎡"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="评分" prop="rating">
              <el-input-number
                v-model="form.rating"
                :min="0"
                :max="5"
                :step="0.1"
                :controls="false"
                placeholder="0-5分"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="服务企业数" prop="serviceCount">
              <el-input-number
                v-model="form.serviceCount"
                :min="0"
                :controls="false"
                placeholder="请输入服务企业数"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成功案例数" prop="successCases">
              <el-input-number
                v-model="form.successCases"
                :min="0"
                :controls="false"
                placeholder="请输入成功案例数"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 状态设置 -->
      <div class="form-section">
        <div class="form-section-title">状态设置</div>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="是否推荐" prop="isRecommended">
              <el-switch
                v-model="form.isRecommended"
                inline-prompt
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="form.status"
                placeholder="请选择状态"
                style="width: 100%"
              >
                <el-option label="正常" :value="1" />
                <el-option label="已下线" :value="2" />
                <el-option label="禁用" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <el-row :gutter="24" class="mt-2">
        <el-col :span="24">
          <el-form-item label="Logo 上传" prop="logo">
            <div class="logo-uploader">
              <el-upload
                class="logo-upload"
                drag
                :show-file-list="false"
                :http-request="handleLogoUpload"
                :before-upload="beforeLogoUpload"
              >
                <template v-if="!form.logo">
                  <div class="logo-placeholder">
                    <el-icon class="logo-icon"><UploadFilled /></el-icon>
                    <div class="logo-text">点击或拖拽上传 Logo</div>
                    <div class="logo-tip">支持 JPG/PNG，大小不超过 5MB</div>
        </div>
                </template>
                <template v-else>
                  <div class="logo-preview">
                    <img :src="logoDisplayUrl" alt="logo" />
                    <div class="logo-preview__mask">
                      <el-button size="small" type="primary"
                        >重新上传</el-button
                      >
                      <el-button
                        size="small"
                        type="danger"
                        @click.stop="removeLogo"
                        >移除</el-button
                      >
        </div>
      </div>
                </template>
              </el-upload>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="所属行业" prop="industries">
            <div class="industry-tags-container">
              <div
                v-for="item in industryOptions"
                :key="item.id"
                :class="[
                  'industry-tag',
                  { 'industry-tag-selected': isIndustrySelected(item.id) }
                ]"
                @click="toggleIndustry(item)"
              >
                <span class="industry-tag-text">{{ item.name }}</span>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-tabs v-model="activeTab" class="mt-4">
        <el-tab-pane label="中心介绍" name="introduction">
          <div class="wangeditor-container">
            <Toolbar
              :editor="introductionEditorRef"
              :defaultConfig="toolbarConfig"
              mode="default"
              class="wangeditor-toolbar"
            />
            <Editor
              v-model="form.introduction"
              :defaultConfig="editorConfig"
              mode="default"
              class="wangeditor-editor"
              @onCreated="handleIntroductionCreated"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="环境展示" name="environment">
          <div class="wangeditor-container">
            <Toolbar
              :editor="environmentEditorRef"
              :defaultConfig="toolbarConfig"
              mode="default"
              class="wangeditor-toolbar"
            />
            <Editor
              v-model="form.environment"
              :defaultConfig="editorConfig"
              mode="default"
              class="wangeditor-editor"
              @onCreated="handleEnvironmentCreated"
            />
        </div>
        </el-tab-pane>
        <el-tab-pane label="成功案例" name="successCases">
          <div class="wangeditor-container">
            <Toolbar
              :editor="successCasesEditorRef"
              :defaultConfig="toolbarConfig"
              mode="default"
              class="wangeditor-toolbar"
            />
            <Editor
              v-model="form.successCasesDetail"
              :defaultConfig="editorConfig"
              mode="default"
              class="wangeditor-editor"
              @onCreated="handleSuccessCasesCreated"
            />
      </div>
        </el-tab-pane>
        <el-tab-pane label="国际化服务" name="internationalServices">
          <div class="wangeditor-container">
            <Toolbar
              :editor="internationalEditorRef"
              :defaultConfig="toolbarConfig"
              mode="default"
              class="wangeditor-toolbar"
            />
            <Editor
              v-model="form.internationalServices"
              :defaultConfig="editorConfig"
              mode="default"
              class="wangeditor-editor"
              @onCreated="handleInternationalCreated"
                />
              </div>
        </el-tab-pane>
        <el-tab-pane label="资源优势" name="resourceAdvantages">
          <div class="wangeditor-container">
            <Toolbar
              :editor="resourceEditorRef"
              :defaultConfig="toolbarConfig"
              mode="default"
              class="wangeditor-toolbar"
            />
            <Editor
              v-model="form.resourceAdvantages"
              :defaultConfig="editorConfig"
              mode="default"
              class="wangeditor-editor"
              @onCreated="handleResourceCreated"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <template #footer>
      <div style="flex: auto">
        <el-button @click="handleClose">取消</el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
        >
          保存
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  watch,
  onMounted,
  onBeforeUnmount,
  shallowRef,
  toRaw
} from "vue";
import type {
  FormInstance,
  FormRules,
  UploadRequestOptions
} from "element-plus";
import type { PropType } from "vue";
import { ElMessage } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import type {
  IDomEditor,
  IEditorConfig,
  IToolbarConfig
} from "@wangeditor/editor";
import { uploadImage } from "@/api/upload";
import { getFullImageUrl } from "@/utils/image";
import {
  createOffshore,
  updateOffshore,
  getRegionList,
  getCenterTypeList,
  getIndustryList
} from "../api";
import type {
  OffshoreCenterItem,
  OffshoreSubmitPayload
} from "../types/types";

const DEFAULT_HTML = "<p><br></p>";

type DrawerFormData = Partial<
  OffshoreCenterItem & {
    industries: Array<{ id: number; name: string }>;
  }
> | null;

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: "" },
  formData: { type: Object as PropType<DrawerFormData>, default: null }
});

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "refresh"): void;
}>();

const visible = ref(false);
const drawerTitle = ref("新增离岸中心");
const submitLoading = ref(false);
const activeTab = ref("introduction");

const formRef = ref<FormInstance>();

const form = reactive<
  Partial<
    OffshoreCenterItem & {
      industries: Array<{ id: number; name: string }>;
    }
  >
>({
  id: undefined,
  name: "",
  description: "",
  centerTypeId: undefined,
  regionId: undefined,
  country: "",
  city: "",
  address: "",
  website: "",
  contactPerson: "",
  contactPhone: "",
  contactEmail: "",
  isRecommended: false,
  status: 1,
  establishedYear: undefined,
  area: "",
  serviceCount: undefined,
  successCases: undefined,
  rating: undefined,
  introduction: DEFAULT_HTML,
  environment: DEFAULT_HTML,
  successCasesDetail: DEFAULT_HTML,
  internationalServices: DEFAULT_HTML,
  resourceAdvantages: DEFAULT_HTML,
  logo: "",
  industries: []
});

const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入中心名称", trigger: "blur" }],
  centerTypeId: [
    { required: true, message: "请选择中心类型", trigger: "change" }
  ],
  regionId: [{ required: true, message: "请选择地区", trigger: "change" }]
});

const regionOptions = ref<Array<{ id: number; name: string }>>([]);
const centerTypeOptions = ref<Array<{ id: number; name: string }>>([]);
const industryOptions = ref<Array<{ id: number; name: string }>>([]);

const logoDisplayUrl = ref<string>("");

const introductionEditorRef = shallowRef<IDomEditor>();
const environmentEditorRef = shallowRef<IDomEditor>();
const successCasesEditorRef = shallowRef<IDomEditor>();
const internationalEditorRef = shallowRef<IDomEditor>();
const resourceEditorRef = shallowRef<IDomEditor>();

function normalizeEditorHtml(value?: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    return DEFAULT_HTML;
  }
  return value;
}

function applyEditorContent(editor: IDomEditor | undefined, value?: string) {
  if (!editor) return;
  const html = normalizeEditorHtml(value);
  if (editor.getHtml() !== html) {
    editor.setHtml(html);
  }
}

function syncEditorValues() {
  applyEditorContent(introductionEditorRef.value, form.introduction);
  applyEditorContent(environmentEditorRef.value, form.environment);
  applyEditorContent(successCasesEditorRef.value, form.successCasesDetail);
  applyEditorContent(internationalEditorRef.value, form.internationalServices);
  applyEditorContent(resourceEditorRef.value, form.resourceAdvantages);
}

const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    "bold",
    "underline",
    "italic",
    "through",
    "color",
    "bgColor",
    "fontSize",
    "fontFamily",
    "lineHeight",
    "bulletedList",
    "numberedList",
    "todo",
    "justifyLeft",
    "justifyCenter",
    "justifyRight",
    "justifyJustify",
    "insertLink",
    "uploadImage",
    "undo",
    "redo"
  ]
};

const editorConfig: Partial<IEditorConfig> = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      async customUpload(file: File, insertFn: Function) {
        try {
          const result = await uploadImage(file, "offshore");
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
};

const handleIntroductionCreated = (editor: IDomEditor) => {
  introductionEditorRef.value = editor;
  applyEditorContent(editor, form.introduction);
};

const handleEnvironmentCreated = (editor: IDomEditor) => {
  environmentEditorRef.value = editor;
  applyEditorContent(editor, form.environment);
};

const handleSuccessCasesCreated = (editor: IDomEditor) => {
  successCasesEditorRef.value = editor;
  applyEditorContent(editor, form.successCasesDetail);
};

const handleInternationalCreated = (editor: IDomEditor) => {
  internationalEditorRef.value = editor;
  applyEditorContent(editor, form.internationalServices);
};

const handleResourceCreated = (editor: IDomEditor) => {
  resourceEditorRef.value = editor;
  applyEditorContent(editor, form.resourceAdvantages);
};

function isIndustrySelected(industryId: number): boolean {
  return form.industries?.some(item => item.id === industryId) || false;
}

function toggleIndustry(industry: { id: number; name: string }) {
  if (!form.industries) {
    form.industries = [];
  }

  const index = form.industries.findIndex(item => item.id === industry.id);
  if (index > -1) {
    form.industries.splice(index, 1);
  } else {
    form.industries.push({ id: industry.id, name: industry.name });
  }
}

function fillForm(data?: DrawerFormData) {
  if (!data) {
    resetForm();
    return;
  }
  const value = data || {};

  const formData = {
    id: value.id,
    name: value.name || "",
    description: value.description || "",
    centerTypeId: value.centerTypeId ?? value.centerType?.id,
    regionId: value.regionId ?? value.region?.id,
    country: value.country || "",
    city: value.city || "",
    address: value.address || "",
    website: value.website || "",
    contactPerson: value.contactPerson || "",
    contactPhone: value.contactPhone || "",
    contactEmail: value.contactEmail || "",
    isRecommended: value.isRecommended ?? false,
    status: value.status ?? 1,
    establishedYear: value.establishedYear,
    area: value.area || "",
    serviceCount: value.serviceCount,
    successCases: value.successCases,
    rating: value.rating,
    introduction: value.introduction || DEFAULT_HTML,
    environment: value.environment || DEFAULT_HTML,
    successCasesDetail: value.successCasesDetail || DEFAULT_HTML,
    internationalServices: value.internationalServices || DEFAULT_HTML,
    resourceAdvantages: value.resourceAdvantages || DEFAULT_HTML,
    industries: value.industries || [],
    logo: value.logo || ""
  };

  Object.assign(form, formData);
  updateLogoPreview();
  syncEditorValues();
}

watch(
  () => props.visible,
  value => {
    visible.value = value;
    if (value && props.formData) {
      fillForm(props.formData);
    }
  },
  { immediate: true }
);

watch(
  () => visible.value,
  value => {
    emit("update:visible", value);
  }
);

watch(
  () => props.title,
  value => {
    if (value) drawerTitle.value = value;
  },
  { immediate: true }
);

watch(
  () => props.formData,
  value => {
    if (visible.value && value) {
      fillForm(value);
    }
  }
);

function resetForm() {
  formRef.value?.clearValidate();
  Object.assign(form, {
    id: undefined,
    name: "",
    description: "",
    centerTypeId: undefined,
    regionId: undefined,
    country: "",
    city: "",
    address: "",
    website: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    isRecommended: false,
    status: 1,
    establishedYear: undefined,
    area: "",
    serviceCount: undefined,
    successCases: undefined,
    rating: undefined,
    introduction: DEFAULT_HTML,
    environment: DEFAULT_HTML,
    successCasesDetail: DEFAULT_HTML,
    internationalServices: DEFAULT_HTML,
    resourceAdvantages: DEFAULT_HTML,
    industries: [],
    logo: ""
  });
  updateLogoPreview();
  syncEditorValues();
}

function handleClose() {
  visible.value = false;
  resetForm();
}

async function handleSubmit() {
  if (!formRef.value) return;
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  submitLoading.value = true;
  try {
    const rawForm = toRaw(form);
    const industryIds = (rawForm.industries || [])
      .map(item => Number(item.id))
      .filter(id => !Number.isNaN(id));
    const { industries, ...rest } = rawForm;
    const submitData = {
      ...rest,
      industryIds
    } as OffshoreSubmitPayload;

    if (form.id) {
      await updateOffshore(form.id, submitData);
      ElMessage.success("更新成功");
    } else {
      await createOffshore(submitData);
      ElMessage.success("创建成功");
    }
    emit("refresh");
    handleClose();
  } catch (error) {
    ElMessage.error("保存失败");
  } finally {
    submitLoading.value = false;
  }
}

function updateLogoPreview() {
  logoDisplayUrl.value = form.logo ? getFullImageUrl(form.logo) : "";
}

async function handleLogoUpload(options: UploadRequestOptions) {
  const { file, onError, onSuccess } = options;
  try {
    const res = await uploadImage(file as File, "offshore");
    if (res.code === 200 && res.data?.url) {
      form.logo = res.data.url;
      updateLogoPreview();
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
}

function beforeLogoUpload(file: File) {
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
}

function removeLogo() {
  form.logo = "";
  updateLogoPreview();
}

async function loadOptions() {
  try {
    const [regionRes, typeRes, industryRes] = await Promise.all([
      getRegionList(),
      getCenterTypeList(),
      getIndustryList()
    ]);
    regionOptions.value = regionRes.data || [];
    centerTypeOptions.value = typeRes.data || [];
    industryOptions.value = industryRes.data || [];
  } catch (error) {
    ElMessage.error("加载基础数据失败");
  }
}

onMounted(() => {
  loadOptions();
});

onBeforeUnmount(() => {
  const editors = [
    introductionEditorRef.value,
    environmentEditorRef.value,
    successCasesEditorRef.value,
    internationalEditorRef.value,
    resourceEditorRef.value
  ];

  editors.forEach(editor => {
    if (editor) {
      editor.destroy();
    }
  });
});

const exposeMethods = {
  open(data?: Partial<OffshoreCenterItem>) {
    if (data) {
      drawerTitle.value = "编辑离岸中心";
      fillForm(data as any);
    } else {
      drawerTitle.value = "新增离岸中心";
      resetForm();
    }
    visible.value = true;
  }
};

defineExpose(exposeMethods);
</script>

<style scoped>
.offshore-drawer :deep(.el-drawer__header) {
  margin-bottom: 12px !important;
  font-size: 18px;
  font-weight: 600;
}

.offshore-drawer :deep(.el-drawer__body) {
  padding-bottom: 0;
}

.form-section {
  margin-bottom: 24px;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
}

.form-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #409eff;
  display: inline-block;
}

.logo-uploader {
  width: 100%;
}

.logo-upload {
  width: 160px;
  height: 160px;
  border-radius: 8px;
}

.logo-upload :deep(.el-upload-dragger) {
  width: 160px;
  height: 160px;
  padding: 0;
  border: 1px dashed var(--el-border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.logo-placeholder {
  text-align: center;
}

.logo-icon {
  font-size: 32px;
  color: var(--el-text-color-secondary);
  margin-bottom: 6px;
}

.logo-text {
  font-size: 14px;
  color: var(--el-text-color-primary);
}

.logo-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}

.logo-preview {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 8px;
  overflow: hidden;
}

.logo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-preview__mask {
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

.logo-preview:hover .logo-preview__mask {
  opacity: 1;
}

.logo-preview__mask .el-button {
  width: 96px;
}

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

.wangeditor-container :deep(.w-e-text-container) {
  min-height: 320px !important;
  height: 320px !important;
}

.wangeditor-container :deep(.w-e-text) {
  min-height: 320px !important;
  height: 320px !important;
}

.wangeditor-container :deep(.w-e-scroll) {
  min-height: 320px !important;
}

.industry-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.industry-tag {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 24px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
}

.industry-tag:hover {
  background: #e8f4ff;
  border-color: #4a90e2;
  color: #4a90e2;
}

.industry-tag-selected {
  background: #e8f4ff;
  border-color: #4a90e2;
  color: #4a90e2;
}

.industry-tag-selected:hover {
  background: #d4ebff;
  box-shadow: 0 2px 4px rgba(74, 144, 226, 0.2);
}

.industry-tag-text {
  line-height: 1;
}
</style>
