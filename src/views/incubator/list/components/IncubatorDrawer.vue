<template>
  <el-drawer
    v-model="visible"
    :title="drawerTitle"
    direction="rtl"
    size="70%"
    :before-close="handleClose"
    custom-class="incubator-drawer"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-position="top"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="载体名称" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入载体名称"
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
        <el-col :span="12">
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
        <el-col :span="12">
          <el-form-item label="城市/区域" prop="location">
            <el-input
              v-model="form.location"
              placeholder="请输入城市或区域"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="详细地址" prop="address">
            <el-input
              v-model="form.address"
              placeholder="请输入详细地址"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="官方网站" prop="website">
            <el-input
              v-model="form.website"
              placeholder="请输入官方网站"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

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
        <el-col :span="8">
          <el-form-item label="是否推荐" prop="isRecommended">
            <el-switch
              v-model="form.isRecommended"
              inline-prompt
              active-text="是"
              inactive-text="否"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="form.status"
              placeholder="请选择状态"
              clearable
              style="width: 100%"
            >
              <el-option label="正常" :value="1" />
              <el-option label="已下线" :value="2" />
              <el-option label="禁用" :value="3" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="成立年份" prop="establishedYear">
            <el-input-number
              v-model="form.establishedYear"
              :min="1900"
              :max="2100"
              :controls="false"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="面积(㎡)" prop="area">
            <el-input-number
              v-model="form.area"
              :min="0"
              :controls="false"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入驻企业数" prop="settledCompaniesCount">
            <el-input-number
              v-model="form.settledCompaniesCount"
              :min="0"
              :controls="false"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="成功案例数" prop="successCases">
            <el-input-number
              v-model="form.successCases"
              :min="0"
              :controls="false"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
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
          <el-form-item label="载体简介" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
              placeholder="请输入载体简介"
            />
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
        <el-tab-pane label="详细介绍" name="detailedIntro">
          <div class="wangeditor-container">
            <Toolbar
              :editor="detailedIntroEditorRef"
              :defaultConfig="toolbarConfig"
              mode="default"
              class="wangeditor-toolbar"
            />
            <Editor
              v-model="form.detailedIntro"
              :defaultConfig="editorConfig"
              mode="default"
              class="wangeditor-editor"
              @onCreated="handleDetailedIntroCreated"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="环境展示" name="environmentShowcase">
          <div class="wangeditor-container">
            <Toolbar
              :editor="environmentShowcaseEditorRef"
              :defaultConfig="toolbarConfig"
              mode="default"
              class="wangeditor-toolbar"
            />
            <Editor
              v-model="form.environmentShowcase"
              :defaultConfig="editorConfig"
              mode="default"
              class="wangeditor-editor"
              @onCreated="handleEnvironmentShowcaseCreated"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="入驻企业" name="residentEnterprises">
          <div class="wangeditor-container">
            <Toolbar
              :editor="residentEnterprisesEditorRef"
              :defaultConfig="toolbarConfig"
              mode="default"
              class="wangeditor-toolbar"
            />
            <Editor
              v-model="form.residentEnterprises"
              :defaultConfig="editorConfig"
              mode="default"
              class="wangeditor-editor"
              @onCreated="handleResidentEnterprisesCreated"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="服务内容" name="serviceContent">
          <div class="wangeditor-container">
            <Toolbar
              :editor="serviceContentEditorRef"
              :defaultConfig="toolbarConfig"
              mode="default"
              class="wangeditor-toolbar"
            />
            <Editor
              v-model="form.serviceContent"
              :defaultConfig="editorConfig"
              mode="default"
              class="wangeditor-editor"
              @onCreated="handleServiceContentCreated"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="政策支持" name="policySupport">
          <div class="wangeditor-container">
            <Toolbar
              :editor="policySupportEditorRef"
              :defaultConfig="toolbarConfig"
              mode="default"
              class="wangeditor-toolbar"
            />
            <Editor
              v-model="form.policySupport"
              :defaultConfig="editorConfig"
              mode="default"
              class="wangeditor-editor"
              @onCreated="handlePolicySupportCreated"
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
import type { IncubatorItem } from "../types/types";
import {
  createIncubator,
  updateIncubator,
  getCenterTypeList,
  getRegionList,
  getIndustryList
} from "../api";
import { uploadImage } from "@/api/upload";
import { getFullImageUrl } from "@/utils/image";

// 导入 wangEditor
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import type {
  IDomEditor,
  IEditorConfig,
  IToolbarConfig
} from "@wangeditor/editor";

const DEFAULT_HTML = "<p><br></p>";

type DrawerFormData = Partial<
  IncubatorItem & {
    description?: string;
    detailedIntro?: string;
    environmentShowcase?: string;
    residentEnterprises?: string;
    serviceContent?: string;
    policySupport?: string;
    contactPerson?: string;
    contactPhone?: string;
    contactEmail?: string;
    website?: string;
    address?: string;
    location?: string;
    logo?: string;
    area?: number;
    settledCompaniesCount?: number;
    successCases?: number;
    establishedYear?: number;
    isRecommended?: boolean;
    status?: number;
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
const drawerTitle = ref("新增载体");
const submitLoading = ref(false);
const activeTab = ref("detailedIntro");

const formRef = ref<FormInstance>();

const form = reactive<
  Partial<
    IncubatorItem & {
      description: string;
      detailedIntro: string;
      environmentShowcase: string;
      residentEnterprises: string;
      serviceContent: string;
      policySupport: string;
      industries: Array<{ id: number; name: string }>;
      contactPerson: string;
      contactPhone: string;
      contactEmail: string;
      website: string;
      address: string;
      location: string;
      logo: string;
      area?: number;
      settledCompaniesCount?: number;
      successCases?: number;
      establishedYear?: number;
      isRecommended: boolean;
      status: number;
    }
  >
>({
  id: undefined,
  name: "",
  centerTypeId: undefined,
  regionId: undefined,
  location: "",
  address: "",
  contactPerson: "",
  contactPhone: "",
  contactEmail: "",
  website: "",
  isRecommended: false,
  status: 1,
  area: undefined,
  settledCompaniesCount: undefined,
  successCases: undefined,
  establishedYear: undefined,
  description: "",
  detailedIntro: DEFAULT_HTML,
  environmentShowcase: DEFAULT_HTML,
  residentEnterprises: DEFAULT_HTML,
  serviceContent: DEFAULT_HTML,
  policySupport: DEFAULT_HTML,
  industries: [],
  logo: ""
});

const rules = reactive<FormRules>({
  name: [{ required: true, message: "请输入载体名称", trigger: "blur" }],
  centerTypeId: [
    { required: true, message: "请选择中心类型", trigger: "change" }
  ],
  regionId: [{ required: true, message: "请选择地区", trigger: "change" }]
});

const regionOptions = ref<Array<{ id: number; name: string }>>([]);
const centerTypeOptions = ref<Array<{ id: number; name: string }>>([]);
const industryOptions = ref<Array<{ id: number; name: string }>>([]);

const logoDisplayUrl = ref<string>("");

// 富文本编辑器引用 - 使用 shallowRef
const detailedIntroEditorRef = shallowRef<IDomEditor>();
const environmentShowcaseEditorRef = shallowRef<IDomEditor>();
const residentEnterprisesEditorRef = shallowRef<IDomEditor>();
const serviceContentEditorRef = shallowRef<IDomEditor>();
const policySupportEditorRef = shallowRef<IDomEditor>();

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
  applyEditorContent(detailedIntroEditorRef.value, form.detailedIntro);
  applyEditorContent(
    environmentShowcaseEditorRef.value,
    form.environmentShowcase
  );
  applyEditorContent(
    residentEnterprisesEditorRef.value,
    form.residentEnterprises
  );
  applyEditorContent(serviceContentEditorRef.value, form.serviceContent);
  applyEditorContent(policySupportEditorRef.value, form.policySupport);
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

// 富文本编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      async customUpload(file: File, insertFn: Function) {
        try {
          const result = await uploadImage(file, "incubator");
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

// 编辑器创建回调
const handleDetailedIntroCreated = (editor: IDomEditor) => {
  detailedIntroEditorRef.value = editor;
  applyEditorContent(editor, form.detailedIntro);
};

const handleEnvironmentShowcaseCreated = (editor: IDomEditor) => {
  environmentShowcaseEditorRef.value = editor;
  applyEditorContent(editor, form.environmentShowcase);
};

const handleResidentEnterprisesCreated = (editor: IDomEditor) => {
  residentEnterprisesEditorRef.value = editor;
  applyEditorContent(editor, form.residentEnterprises);
};

const handleServiceContentCreated = (editor: IDomEditor) => {
  serviceContentEditorRef.value = editor;
  applyEditorContent(editor, form.serviceContent);
};

const handlePolicySupportCreated = (editor: IDomEditor) => {
  policySupportEditorRef.value = editor;
  applyEditorContent(editor, form.policySupport);
};

// 判断行业是否已选中
function isIndustrySelected(industryId: number): boolean {
  return form.industries?.some(item => item.id === industryId) || false;
}

// 切换行业选中状态
function toggleIndustry(industry: { id: number; name: string }) {
  if (!form.industries) {
    form.industries = [];
  }

  const index = form.industries.findIndex(item => item.id === industry.id);
  if (index > -1) {
    // 已选中，则取消选中
    form.industries.splice(index, 1);
  } else {
    // 未选中，则添加
    form.industries.push({ id: industry.id, name: industry.name });
  }
}

function fillForm(data?: DrawerFormData) {
  if (!data) {
    resetForm();
    return;
  }
  const value = data || {};

  // 确保富文本字段有默认值
  const formData = {
    id: value.id,
    name: value.name || "",
    centerTypeId: value.centerTypeId ?? value.centerType?.id,
    regionId: value.regionId ?? value.region?.id,
    location: value.location || "",
    address: value.address || "",
    contactPerson: value.contactPerson || "",
    contactPhone: value.contactPhone || "",
    contactEmail: value.contactEmail || "",
    website: value.website || "",
    isRecommended: value.isRecommended ?? false,
    status: value.status ?? 1,
    area: value.area,
    settledCompaniesCount: value.settledCompaniesCount,
    successCases: value.successCases,
    establishedYear: value.establishedYear,
    description: value.description || "",
    detailedIntro: value.detailedIntro || DEFAULT_HTML,
    environmentShowcase: value.environmentShowcase || DEFAULT_HTML,
    residentEnterprises: value.residentEnterprises || DEFAULT_HTML,
    serviceContent: value.serviceContent || DEFAULT_HTML,
    policySupport: value.policySupport || DEFAULT_HTML,
    industries: value.industries || [],
    logo: value.logo || ""
  };

  // 使用 Object.assign 更新表单，v-model 会自动同步到编辑器
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
    centerTypeId: undefined,
    regionId: undefined,
    location: "",
    address: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    website: "",
    isRecommended: false,
    status: 1,
    area: undefined,
    settledCompaniesCount: undefined,
    successCases: undefined,
    establishedYear: undefined,
    description: "",
    detailedIntro: DEFAULT_HTML,
    environmentShowcase: DEFAULT_HTML,
    residentEnterprises: DEFAULT_HTML,
    serviceContent: DEFAULT_HTML,
    policySupport: DEFAULT_HTML,
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
    };

    if (form.id) {
      await updateIncubator(form.id, submitData);
      ElMessage.success("更新成功");
    } else {
      await createIncubator(submitData);
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
    const res = await uploadImage(file as File, "incubator");
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

// 组件销毁时，销毁所有编辑器
onBeforeUnmount(() => {
  const editors = [
    detailedIntroEditorRef.value,
    environmentShowcaseEditorRef.value,
    residentEnterprisesEditorRef.value,
    serviceContentEditorRef.value,
    policySupportEditorRef.value
  ];

  editors.forEach(editor => {
    if (editor) {
      editor.destroy();
    }
  });
});

const exposeMethods = {
  open(data?: Partial<IncubatorItem>) {
    if (data) {
      drawerTitle.value = "编辑载体";
      fillForm(data as any);
    } else {
      drawerTitle.value = "新增载体";
      resetForm();
    }
    visible.value = true;
  }
};

defineExpose(exposeMethods);
</script>

<style scoped>
.incubator-drawer :deep(.el-drawer__header) {
  margin-bottom: 12px !important;
  font-size: 18px;
  font-weight: 600;
}

.incubator-drawer :deep(.el-drawer__body) {
  padding-bottom: 0;
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

/* 确保编辑器在抽屉中正常显示 - 文本区域必须 >= 300px */
.wangeditor-container :deep(.w-e-text-container) {
  min-height: 320px !important;
  height: 320px !important;
}

.wangeditor-container :deep(.w-e-text) {
  min-height: 320px !important;
  height: 320px !important;
}

/* 确保滚动容器也有足够高度 */
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
