<template>
  <el-drawer
    v-model="drawerVisible"
    :title="drawerTitle"
    direction="rtl"
    size="50%"
    :before-close="handleClose"
    custom-class="competition-drawer"
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
          <el-form-item label="大赛标题" prop="title">
            <el-input
              v-model="formInline.title"
              placeholder="请输入大赛标题"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行业领域" prop="industryId">
            <el-select
              v-model="formInline.industryId"
              placeholder="请选择行业领域"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="industry in industryOptions"
                :key="industry.id"
                :label="industry.name"
                :value="industry.id"
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
        <el-col :span="24">
          <el-form-item label="主办方 logo" prop="organizerLogo">
            <div class="organizer-logo-upload-container">
              <div class="logo-upload-area">
                <el-upload
                  class="organizer-logo-uploader"
                  drag
                  :http-request="customLogoUploadRequest"
                  :show-file-list="false"
                  :before-upload="beforeLogoUpload"
                >
                <div v-if="!formInline.organizerLogo" class="logo-upload-placeholder">
                  <el-icon class="logo-uploader-icon"><upload-filled /></el-icon>
                  <div class="logo-upload-text">点击或拖拽上传</div>
                </div>
                <div v-else class="logo-preview-container">
                  <img :src="logoDisplayUrl" class="logo-preview" />
                  <div class="logo-preview-overlay">
                    <el-button type="primary" size="small" @click.stop="replaceLogo">
                      <el-icon><edit /></el-icon>
                      更换
                    </el-button>
                    <el-button type="danger" size="small" @click.stop="removeLogo">
                      <el-icon><delete /></el-icon>
                      删除
                    </el-button>
                  </div>
                </div>
                </el-upload>
              </div>
              <div class="logo-upload-info">
                <div class="logo-info-title">主办方 logo 上传说明</div>
                <div class="logo-info-item">• 支持 JPG、PNG 格式图片</div>
                <div class="logo-info-item">• 建议尺寸：200x200 像素</div>
                <div class="logo-info-item">• 文件大小：不超过 2MB</div>
                <div class="logo-info-item">• 建议使用正方形图片，确保显示效果</div>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="开始日期" prop="startTime">
            <el-date-picker
              v-model="formInline.startTime"
              type="date"
              placeholder="请选择开始日期"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              :teleported="false"
              :popper-class="'competition-date-picker-popper'"
              placement="bottom-start"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束日期" prop="endTime">
            <el-date-picker
              v-model="formInline.endTime"
              type="date"
              placeholder="请选择结束日期"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              :teleported="false"
              :popper-class="'competition-date-picker-popper'"
              placement="bottom-start"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="报名截止日期" prop="registrationDeadline">
            <el-date-picker
              v-model="formInline.registrationDeadline"
              type="date"
              placeholder="请选择报名截止日期"
              style="width: 100%"
              value-format="YYYY-MM-DD"
              :teleported="false"
              :popper-class="'competition-date-picker-popper'"
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
          <el-form-item label="是否推荐" prop="isRecommended">
            <el-switch
              v-model="formInline.isRecommended"
              active-text="是"
              inactive-text="否"
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
              <el-option label="审核中" :value="5" />
              <el-option label="已拒绝" :value="6" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="海报图片" prop="poster">
            <div class="competition-poster-upload-container">
              <el-upload
                class="poster-uploader"
                drag
                :http-request="customUploadRequest"
                :show-file-list="false"
                :before-upload="beforePosterUpload"
              >
              <div v-if="!formInline.poster" class="poster-upload-placeholder">
                <el-icon class="poster-uploader-icon"><upload-filled /></el-icon>
                <div class="poster-upload-text-container">
                  <div class="poster-upload-text">点击或拖拽上传大赛海报</div>
                  <div class="poster-upload-hint">支持 JPG、PNG 格式，建议尺寸 800x600</div>
                </div>
              </div>
              <div v-else class="poster-preview-container">
                <img :src="posterDisplayUrl" class="poster-preview" />
                <div class="poster-preview-overlay">
                  <el-button type="primary" size="small" @click.stop="replacePoster">
                    <el-icon><edit /></el-icon>
                    更换
                  </el-button>
                  <el-button type="danger" size="small" @click.stop="removePoster">
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

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="大赛简介" prop="summary">
            <div class="wangeditor-container">
              <Toolbar
                :editor="summaryEditorRef"
                :defaultConfig="toolbarConfig"
                mode="default"
                class="wangeditor-toolbar"
              />
              <Editor
                v-model="formInline.summary"
                :defaultConfig="editorConfig"
                mode="default"
                class="wangeditor-editor"
                style="height: 320px;"
                @onCreated="handleSummaryCreated"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="大赛主题" prop="description">
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
                style="height: 320px;"
                @onCreated="handleDescriptionCreated"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="组织机构" prop="coOrganizers">
            <div class="wangeditor-container">
              <Toolbar
                :editor="coOrganizersEditorRef"
                :defaultConfig="toolbarConfig"
                mode="default"
                class="wangeditor-toolbar"
              />
              <Editor
                v-model="formInline.coOrganizers"
                :defaultConfig="editorConfig"
                mode="default"
                class="wangeditor-editor"
                style="height: 320px;"
                @onCreated="handleCoOrganizersCreated"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="参赛条件" prop="requirements">
            <div class="wangeditor-container">
              <Toolbar
                :editor="requirementsEditorRef"
                :defaultConfig="toolbarConfig"
                mode="default"
                class="wangeditor-toolbar"
              />
              <Editor
                v-model="formInline.requirements"
                :defaultConfig="editorConfig"
                mode="default"
                class="wangeditor-editor"
                style="height: 320px;"
                @onCreated="handleRequirementsCreated"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="政策支持" prop="prizes">
            <div class="wangeditor-container">
              <Toolbar
                :editor="prizesEditorRef"
                :defaultConfig="toolbarConfig"
                mode="default"
                class="wangeditor-toolbar"
              />
              <Editor
                v-model="formInline.prizes"
                :defaultConfig="editorConfig"
                mode="default"
                class="wangeditor-editor"
                style="height: 320px;"
                @onCreated="handlePrizesCreated"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="大赛流程" prop="schedule">
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
                style="height: 320px;"
                @onCreated="handleScheduleCreated"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="评委信息" prop="judges">
            <div class="wangeditor-container">
              <Toolbar
                :editor="judgesEditorRef"
                :defaultConfig="toolbarConfig"
                mode="default"
                class="wangeditor-toolbar"
              />
              <Editor
                v-model="formInline.judges"
                :defaultConfig="editorConfig"
                mode="default"
                class="wangeditor-editor"
                style="height: 320px;"
                @onCreated="handleJudgesCreated"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="赛事资料说明" prop="materialDescription">
            <div class="wangeditor-container">
              <Toolbar
                :editor="materialDescriptionEditorRef"
                :defaultConfig="toolbarConfig"
                mode="default"
                class="wangeditor-toolbar"
              />
              <Editor
                v-model="formInline.materialDescription"
                :defaultConfig="editorConfig"
                mode="default"
                class="wangeditor-editor"
                style="height: 320px;"
                @onCreated="handleMaterialDescriptionCreated"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="赛事资料">
            <div class="materials-management">
              <!-- 文件上传区域 -->
              <div class="upload-section">
                <el-upload
                  class="materials-uploader"
                  drag
                  multiple
                  :http-request="customMaterialUploadRequest"
                  :show-file-list="false"
                  :before-upload="beforeMaterialUpload"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z,.jpg,.jpeg,.png"
                >
                  <div class="upload-placeholder">
                    <el-icon class="upload-icon"><upload-filled /></el-icon>
                    <div class="upload-text">点击或拖拽上传赛事资料</div>
                    <div class="upload-hint">支持 PDF、Word、Excel、PPT、压缩包、图片等格式，单个文件不超过 20MB</div>
                  </div>
                </el-upload>
                
                
              </div>

              <!-- 资料列表 -->
              <div class="materials-list" v-if="materials.length > 0">
                <div class="list-header">
                  <span>已上传资料 ({{ materials.length }})</span>
                </div>
                <div 
                  v-for="(material, index) in materials" 
                  :key="material.id || `temp-${index}`"
                  class="material-item"
                >
                  <div class="material-info">
                    <div class="material-icon">
                      <el-icon v-if="material.category === 'download'">
                        <document />
                      </el-icon>
                      <el-icon v-else>
                        <link />
                      </el-icon>
                    </div>
                    <div class="material-details">
                      <div class="material-title-section">
                        <el-input
                          v-if="material.editing"
                          v-model="material.title"
                          size="small"
                          placeholder="请输入文件标题"
                          @blur="finishEditTitle(material, index)"
                          @keyup.enter="finishEditTitle(material, index)"
                          class="title-input"
                          autofocus
                        />
                        <div v-else class="material-title" @click="startEditTitle(material, index)">
                          {{ material.title }}
                          <el-icon class="edit-icon">
                            <edit />
                          </el-icon>
                        </div>
                      </div>
                      <div class="material-meta">
                        <span v-if="material.category === 'download' && material.fileSize">
                          {{ formatFileSize(material.fileSize) }}
                        </span>
                        <span v-if="material.category === 'link'">
                          链接: {{ material.linkType || '外部链接' }}
                        </span>
                        <span class="material-category">
                          {{ material.category === 'download' ? '文件' : '链接' }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="material-actions">
                    <el-button size="small" type="danger" link @click="removeMaterial(index)">
                      删除
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div style="flex: auto">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          确定
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, defineExpose, watch, onBeforeUnmount, shallowRef, computed } from "vue";
import { getIndustryList, getRegionList, createCompetition, updateCompetition } from "../api";
import { message } from "@/utils/message";
import { uploadImage, uploadFile } from "@/api/upload";
import { getFullImageUrl } from "@/utils/image";
import type { FormItemProps, CompetitionMaterial, CompetitionMaterialForm } from "../types/types";
import type { Response } from "@/types/response";
import type { FileUploadResult } from "@/api/upload";
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from "../api/materials";

// 添加上传相关的导入
import { UploadFilled, Edit, Delete, Document } from "@element-plus/icons-vue";

// 导入 wangEditor
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { createEditor, createToolbar } from '@wangeditor/editor';
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';

const props = defineProps<{
  title: string;
  formData?: FormItemProps;
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "update:visible", visible: boolean): void;
  (e: "submit", data: FormItemProps): void;
}>();

const drawerVisible = ref(false);
const drawerTitle = ref(props.title);
const formRef = ref();
const submitLoading = ref(false);

const formInline = reactive<FormItemProps>({
  id: undefined,
  title: "",
  industryId: null,
  regionId: null,
  organizer: "",
  organizerLogo: "",
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
  description: "",
  requirements: "",
  prizes: "",
  judges: "",
  schedule: "",
  materialDescription: ""
});

// 赛事资料列表（扩展editing字段用于编辑状态）
const materials = ref<(CompetitionMaterial & { editing?: boolean })[]>([]);

const industryOptions = ref<Array<{ id: number; name: string }>>([]);
const regionOptions = ref<Array<{ id: number; name: string }>>([]);

// 计算属性：用于图片显示的完整URL
const posterDisplayUrl = computed(() => {
  if (!formInline.poster) return '';
  return getFullImageUrl(formInline.poster);
});

// 计算属性：用于logo显示的完整URL
const logoDisplayUrl = computed(() => {
  if (!formInline.organizerLogo) return '';
  return getFullImageUrl(formInline.organizerLogo);
});

// 富文本编辑器引用 - 必须使用 shallowRef
const summaryEditorRef = shallowRef<IDomEditor>();
const descriptionEditorRef = shallowRef<IDomEditor>();
const coOrganizersEditorRef = shallowRef<IDomEditor>();
const requirementsEditorRef = shallowRef<IDomEditor>();
const prizesEditorRef = shallowRef<IDomEditor>();
const scheduleEditorRef = shallowRef<IDomEditor>();
const judgesEditorRef = shallowRef<IDomEditor>();
const materialDescriptionEditorRef = shallowRef<IDomEditor>();

// 富文本编辑器工具栏配置 - 使用简单模式
const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    'bold',
    'underline',
    'italic',
    'through',
    'color',
    'bgColor',
    '|',
    'fontSize',
    'fontFamily',
    'lineHeight',
    '|',
    'bulletedList',
    'numberedList',
    'todo',
    '|',
    'justifyLeft',
    'justifyRight',
    'justifyCenter',
    'justifyJustify',
    '|',
    'insertLink',
    'uploadImage',
    '|',
    'undo',
    'redo'
  ]
};

// 富文本编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: '请输入内容...',
  scroll: true,
  MENU_CONF: {
    // 配置图片上传
    uploadImage: {
      async customUpload(file: File, insertFn: Function) {
        try {
          const result: Response<FileUploadResult> = await uploadImage(file, "competition");
          if (result && result.code === 200 && result.data?.url) {
            const fullImageUrl = getFullImageUrl(result.data.url);
            insertFn(fullImageUrl, '', fullImageUrl);
            message("图片上传成功", { type: "success" });
          } else {
            message(result?.message || "图片上传失败", { type: "error" });
          }
        } catch (error: any) {
          const errorMsg = error?.response?.data?.message || error.message || "图片上传失败";
          message(errorMsg, { type: "error" });
        }
      }
    }
  }
};

// 监听props.title变化
watch(
  () => props.title,
  (newVal) => {
    if (newVal) {
      drawerTitle.value = newVal;
    }
  },
  { immediate: true }
);

// 监听props.formData变化
watch(
  () => props.formData,
  (newVal) => {
    if (newVal) {
      // 确保industryId和regionId在为0时被设置为null
      const formData = { ...newVal } as FormItemProps;
      if (formData.industryId === 0) formData.industryId = null;
      if (formData.regionId === 0) formData.regionId = null;
      
      // 海报图片URL直接使用数据库中的相对路径，计算属性会处理显示
      // formData.poster 保持原样，不需要转换
      
      // 主办方logo URL直接使用数据库中的相对路径，计算属性会处理显示
      // formData.organizerLogo 保持原样，不需要转换
      
      // 处理富文本内容，确保有默认值
      if (!formData.summary) formData.summary = '<p><br></p>';
      if (!formData.description) formData.description = '<p><br></p>';
      if (!formData.coOrganizers) formData.coOrganizers = '<p><br></p>';
      if (!formData.requirements) formData.requirements = '<p><br></p>';
      if (!formData.prizes) formData.prizes = '<p><br></p>';
      if (!formData.schedule) formData.schedule = '<p><br></p>';
      if (!formData.judges) formData.judges = '<p><br></p>';
      if (!formData.materialDescription) formData.materialDescription = '<p><br></p>';
      
      // 更新表单数据，v-model 会自动同步到编辑器
      Object.assign(formInline, formData);
      
      // 如果是编辑模式，加载竞赛资料
      if (formData.id) {
        loadMaterials(formData.id);
      }
    } else {
      // 仅在没有数据时才重置
      resetForm(); 
    }
  },
  { immediate: true }
);

// 监听props.visible变化
watch(
  () => props.visible,
  (newVal) => {
    drawerVisible.value = newVal;
  },
  { immediate: true }
);

// 监听drawerVisible变化
watch(
  () => drawerVisible.value,
  (newVal) => {
    emit("update:visible", newVal);
  }
);

// 表单验证规则
const rules = reactive({
  title: [{ required: true, message: "大赛标题不能为空", trigger: "blur" }],
  industryId: [
    { required: true, message: "请选择行业领域", trigger: "change" },
    { 
      validator: (rule: any, value: any, callback: any) => {
        if (value === null || value === undefined || value <= 0) {
          callback(new Error('请选择行业领域'));
        } else {
          callback();
        }
      }, 
      trigger: "change" 
    }
  ] as any[],
  regionId: [
    { required: true, message: "请选择地区", trigger: "change" },
    { 
      validator: (rule: any, value: any, callback: any) => {
        if (value === null || value === undefined || value <= 0) {
          callback(new Error('请选择地区'));
        } else {
          callback();
        }
      }, 
      trigger: "change" 
    }
  ] as any[],
  organizer: [{ required: true, message: "主办方不能为空", trigger: "blur" }],
  location: [{ required: true, message: "举办地点不能为空", trigger: "blur" }],
  startTime: [{ required: true, message: "开始时间不能为空", trigger: "change" }],
  endTime: [{ required: true, message: "结束时间不能为空", trigger: "change" }],
  registrationDeadline: [{ required: true, message: "报名截止时间不能为空", trigger: "change" }],
  status: [{ required: true, message: "状态不能为空", trigger: "change" }]
});

// 获取行业领域选项
const fetchIndustryOptions = async () => {
  try {
    const result = await getIndustryList();
    if (result.code === 200) {
      industryOptions.value = result.data.map(item => ({
        id: item.id,
        name: item.name
      }));
    }
  } catch (error) {
    console.error("获取行业领域失败:", error);
  }
};

// 获取地区选项
const fetchRegionOptions = async () => {
  try {
    const result = await getRegionList();
    if (result.code === 200) {
      regionOptions.value = result.data.map(item => ({
        id: item.id,
        name: item.name
      }));
    }
  } catch (error) {
    console.error("获取地区失败:", error);
  }
};

// 编辑器创建回调 - 统一处理
const handleSummaryCreated = (editor: IDomEditor) => {
  summaryEditorRef.value = editor;
};

const handleDescriptionCreated = (editor: IDomEditor) => {
  descriptionEditorRef.value = editor;
};

const handleCoOrganizersCreated = (editor: IDomEditor) => {
  coOrganizersEditorRef.value = editor;
};

const handleRequirementsCreated = (editor: IDomEditor) => {
  requirementsEditorRef.value = editor;
};

const handlePrizesCreated = (editor: IDomEditor) => {
  prizesEditorRef.value = editor;
};

const handleScheduleCreated = (editor: IDomEditor) => {
  scheduleEditorRef.value = editor;
};

const handleJudgesCreated = (editor: IDomEditor) => {
  judgesEditorRef.value = editor;
};

const handleMaterialDescriptionCreated = (editor: IDomEditor) => {
  materialDescriptionEditorRef.value = editor;
};

// 组件挂载时获取选项数据
onMounted(() => {
  fetchIndustryOptions();
  fetchRegionOptions();
});

// 组件销毁时，及时销毁编辑器 - 重要！
onBeforeUnmount(() => {
  const editors = [
    summaryEditorRef.value,
    descriptionEditorRef.value,
    coOrganizersEditorRef.value,
    requirementsEditorRef.value,
    prizesEditorRef.value,
    scheduleEditorRef.value,
    judgesEditorRef.value,
    materialDescriptionEditorRef.value
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
      submitLoading.value = true;
      try {
        // 在提交前处理数据，确保industryId和regionId为null时正确处理
        const submitData = { ...formInline };
        if (submitData.industryId === null) {
          // 根据业务需求决定是否允许null值，如果不允许可以设置为undefined或其他默认值
          delete submitData.industryId;
        }
        if (submitData.regionId === null) {
          // 根据业务需求决定是否允许null值，如果不允许可以设置为undefined或其他默认值
          delete submitData.regionId;
        }
        
        let result;
        if (formInline.id) {
          // 更新大赛
          result = await updateCompetition(formInline.id, submitData);
        } else {
          // 创建大赛
          result = await createCompetition(submitData);
        }
        
        if (result.code === 200) {
          // 保存资料到后端
          const competitionId = formInline.id || result.data.id;
          if (competitionId) {
            await saveMaterials(competitionId);
          }
          
          message(`大赛${formInline.id ? '更新' : '创建'}成功`, { type: "success" });
          emit("submit", { ...formInline });
          handleClose();
        } else {
          message(`大赛${formInline.id ? '更新' : '创建'}失败: ${result.message}`, { type: "error" });
        }
      } catch (error) {
        message(`大赛${formInline.id ? '更新' : '创建'}失败: ${error.message}`, { type: "error" });
      } finally {
        submitLoading.value = false;
      }
    }
  });
};

// 重置表单
function resetForm() {
  Object.assign(formInline, {
    id: undefined,
    title: "",
    industryId: null,
    regionId: null,
    organizer: "",
    organizerLogo: "",
    coOrganizers: "<p><br></p>",
    status: 0,
    startTime: "",
    endTime: "",
    registrationDeadline: "",
    location: "",
    onlineUrl: "",
    isRecommended: false,
    poster: "",
    summary: "<p><br></p>",
    description: "<p><br></p>",
    requirements: "<p><br></p>",
    prizes: "<p><br></p>",
    judges: "<p><br></p>",
    schedule: "<p><br></p>",
    materialDescription: "<p><br></p>"
  });
  
  // 重置资料列表
  materials.value = [];
  
  // 确保表单引用存在并重置验证
  if (formRef.value) {
    formRef.value.resetFields();
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
  const isImage = file.type.startsWith('image/');
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
    // 调用上传API，传递模块参数 'competition'
    const result: Response<FileUploadResult> = await uploadImage(file, "competition");
    
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
    const errorMsg = error?.response?.data?.message || error.message || "上传请求失败";
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
  const uploadElement = document.querySelector('.poster-uploader .el-upload') as HTMLElement;
  if (uploadElement) {
    uploadElement.click();
  }
};

// 移除图片
const removePoster = (event: Event) => {
  formInline.poster = '';
};

// 自定义logo上传请求函数
async function customLogoUploadRequest(options: any) {
  const { file, onSuccess, onError } = options;
  
  // 检查文件是否存在
  if (!file) {
    const errorMsg = "请选择要上传的logo文件";
    message(errorMsg, { type: "error" });
    onError(new Error(errorMsg));
    return;
  }
  
  // 文件类型验证
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    const errorMsg = "只能上传图片文件";
    message(errorMsg, { type: "error" });
    onError(new Error(errorMsg));
    return;
  }

  // 文件大小验证 (2MB)
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    const errorMsg = "logo大小不能超过 2MB";
    message(errorMsg, { type: "error" });
    onError(new Error(errorMsg));
    return;
  }
  
  try {
    // 调用上传API，传递模块参数 'competition'
    const result: Response<FileUploadResult> = await uploadImage(file, "competition");
    
    if (result && result.code === 200 && result.data?.url) {
      // 上传成功，更新表单中的logo URL（存储相对路径）
      formInline.organizerLogo = result.data.url;
      message(result.message || "上传logo成功", { type: "success" });
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
    const errorMsg = error?.response?.data?.message || error.message || "上传请求失败";
    message(errorMsg, { type: "error" });
    onError(error);
  }
}

// logo上传前的验证
const beforeLogoUpload = (file: File) => {
  // 这里可以添加一些简单的预检查，但主要验证在 customLogoUploadRequest 中进行
  return true;
};

// 更换logo
const replaceLogo = (event: Event) => {
  // 触发文件选择对话框来更换logo
  const uploadElement = document.querySelector('.organizer-logo-uploader .el-upload') as HTMLElement;
  if (uploadElement) {
    uploadElement.click();
  }
};

// 移除logo
const removeLogo = (event: Event) => {
  formInline.organizerLogo = '';
};

// ==================== 赛事资料管理方法 ====================

// 文件上传前验证
const beforeMaterialUpload = (file: File) => {
  // 文件大小验证 (20MB)
  const isLt20M = file.size / 1024 / 1024 < 20;
  if (!isLt20M) {
    message("文件大小不能超过 20MB", { type: "error" });
    return false;
  }
  return true;
};

// 自定义资料上传请求
async function customMaterialUploadRequest(options: any) {
  const { file, onSuccess, onError } = options;
  
  try {
    // 调用上传文件API
    const result: Response<FileUploadResult> = await uploadFile(file, "competition");
    
    if (result && result.code === 200 && result.data?.url) {
      // 创建资料对象（临时存储，提交时再保存到数据库）
      const material: CompetitionMaterial & { editing?: boolean } = {
        competitionId: formInline.id || 0, // 新建时为0，编辑时有实际ID
        title: file.name,
        description: "",
        fileUrl: result.data.url,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.name.split('.').pop()?.toLowerCase() || '',
        category: 'download',
        isRequired: false,
        sortOrder: materials.value.length,
        status: 1,
        editing: false
      };
      
      // 添加到材料列表
      materials.value.push(material);
      
      message("文件上传成功", { type: "success" });
      onSuccess(result);
    } else {
      const errorMsg = result?.message || "上传失败";
      message(errorMsg, { type: "error" });
      onError(new Error(errorMsg));
    }
  } catch (error: any) {
    const errorMsg = error?.response?.data?.message || error.message || "上传请求失败";
    message(errorMsg, { type: "error" });
    onError(error);
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};



// 开始编辑标题
const startEditTitle = (material: CompetitionMaterial & { editing?: boolean }, index: number) => {
  material.editing = true;
};

// 完成编辑标题
const finishEditTitle = (material: CompetitionMaterial & { editing?: boolean }, index: number) => {
  if (!material.title || material.title.trim() === '') {
    material.title = material.fileName || '未命名文件';
  }
  material.editing = false;
};

// 删除资料
const removeMaterial = async (index: number) => {
  const material = materials.value[index];
  
  // 如果是已存在的资料（有id），需要先从后端删除
  if (material.id) {
    try {
      await deleteMaterial(material.id);
      message("已删除资料", { type: "success" });
    } catch (error) {
      message("删除资料失败", { type: "error" });
      return; // 如果后端删除失败，不继续删除前端
    }
  }
  
  // 从前端数组中删除
  materials.value.splice(index, 1);
  
  if (!material.id) {
    message("已删除资料", { type: "success" });
  }
};

// 加载竞赛资料列表
const loadMaterials = async (competitionId: number) => {
  if (!competitionId) return;
  
  try {
    const result = await getMaterials({ competitionId });
    if (result.code === 200) {
      // 为每个资料添加编辑状态字段
      materials.value = result.data.list.map(material => ({
        ...material,
        editing: false
      }));
    }
  } catch (error) {
    console.error("加载资料列表失败:", error);
  }
};

// 保存资料到后端
const saveMaterials = async (competitionId: number) => {
  const promises: Promise<any>[] = [];
  
  // 处理所有资料
  materials.value.forEach(material => {
    const materialData = {
      title: material.title,
      description: material.description,
      fileUrl: material.fileUrl,
      fileName: material.fileName,
      fileSize: material.fileSize,
      fileType: material.fileType,
      category: material.category,
      linkUrl: material.linkUrl,
      linkType: material.linkType,
      isRequired: material.isRequired,
      sortOrder: material.sortOrder
    };
    
    if (material.id) {
      // 更新已存在的资料
      promises.push(updateMaterial(material.id, materialData));
    } else {
      // 创建新资料
      promises.push(createMaterial(competitionId, materialData));
    }
  });
  
  if (promises.length > 0) {
    await Promise.all(promises);
  }
};

defineExpose({
  showDrawer,
  resetForm
});
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.competition-drawer :deep(.el-drawer__header) {
  margin-bottom: 15px !important;
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}
</style>

<style scoped>
/* 修复日期选择器弹出层定位问题（使用 teleported 时仅需提升层级） */
.competition-date-picker-popper {
  z-index: 3000 !important;
}

.competition-poster-upload-container{
  width: 100%;
}

/* 仅针对竞赛海报上传的 el-upload-dragger 样式覆盖 */
.competition-poster-upload-container :deep(.el-upload-dragger), .organizer-logo-upload-container :deep(.el-upload-dragger) {
  padding: 0 !important;
  margin: 0 !important;
}

/* 海报上传样式 */
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

/* 主办方logo上传样式 */
.organizer-logo-upload-container {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.logo-upload-area {
  flex-shrink: 0;
}

.organizer-logo-uploader {
  width: 200px;
  height: 200px;
}

.organizer-logo-uploader .el-upload {
  width: 200px;
  height: 200px;
  border: 1px dashed var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.organizer-logo-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.logo-upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  padding: 20px;
  text-align: center;
}

.logo-uploader-icon {
  font-size: 48px;
  color: var(--el-text-color-secondary);
  margin-bottom: 12px;
}

.logo-upload-text {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.logo-preview-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
}

.logo-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.logo-preview-overlay {
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
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.logo-preview-overlay .el-button {
  padding: 4px 8px;
  font-size: 12px;
  min-height: 28px;
}

.logo-preview-container:hover .logo-preview-overlay {
  opacity: 1;
}

.logo-upload-info {
  flex: 1;
  padding: 16px 0;
}

.logo-info-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
}

.logo-info-item {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
  line-height: 1.5;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .organizer-logo-upload-container {
    flex-direction: column;
    gap: 16px;
  }
  
  .logo-upload-area {
    align-self: center;
  }
  
  .logo-upload-info {
    text-align: center;
  }
}

.poster-upload-placeholder {
  padding: 8px;  /* 进一步减少内边距 */
  text-align: center;
  display: flex;  /* 使用flex布局 */
  align-items: center;  /* 垂直居中 */
  justify-content: center;  /* 水平居中 */
  height: 100px;  /* 进一步减小高度 */
}

.poster-uploader-icon {
  font-size: 36px;  /* 增大图标尺寸 */
  color: var(--el-text-color-secondary);
  margin-right: 12px;  /* 右侧添加间距 */
  margin-bottom: 0;  /* 移除底部间距 */
}

.poster-upload-text-container {
  text-align: left;  /* 文字左对齐 */
}

.poster-upload-text {
  font-size: 14px;  /* 字体大小 */
  color: var(--el-text-color-primary);
  margin-bottom: 2px;  /* 减小底部间距 */
}

.poster-upload-hint {
  font-size: 12px;  /* 字体大小 */
  color: var(--el-text-color-secondary);
}

.poster-preview-container {
  position: relative;
  width: 100%;
  height: 100px;  /* 与占位符高度一致 */
  overflow: hidden;
  border-radius: 8px;
}

.poster-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;  /* 填充固定高度 */
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

/* 修复日期选择器在抽屉中的显示问题 */
.competition-date-picker-popper {
  z-index: 3000 !important;
}

/* 内联上传按钮样式 */
.inline-upload {
  display: inline-block;
}

.inline-upload .el-upload {
  border: none !important;
  background: transparent !important;
  height: auto !important;
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
.wangeditor-container .w-e-text-container {
  min-height: 320px !important;
  height: 320px !important;
}

.wangeditor-container .w-e-text {
  min-height: 320px !important;
  height: 320px !important;
}

/* 确保滚动容器也有足够高度 */
.wangeditor-container .w-e-scroll {
  min-height: 320px !important;
}

/* 赛事资料管理样式 */
.materials-management {
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  overflow: hidden;
}

.upload-section {
  padding: 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.materials-uploader {
  width: 100%;
}

.materials-uploader .el-upload {
  width: 100%;
  border: 2px dashed var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.materials-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.upload-placeholder {
  padding: 40px 20px;
  text-align: center;
}

.upload-icon {
  font-size: 48px;
  color: var(--el-text-color-secondary);
  margin-bottom: 16px;
}

.upload-text {
  font-size: 16px;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}



.materials-list {
  max-height: 300px;
  overflow-y: auto;
}

.list-header {
  padding: 12px 20px;
  background-color: var(--el-fill-color-light);
  border-bottom: 1px solid var(--el-border-color-lighter);
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.material-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  transition: background-color 0.2s;
}

.material-item:hover {
  background-color: var(--el-fill-color-lighter);
}

.material-item:last-child {
  border-bottom: none;
}

.material-info {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.material-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-fill-color);
  border-radius: 6px;
  margin-right: 12px;
}

.material-icon .el-icon {
  font-size: 20px;
  color: var(--el-color-primary);
}

.material-details {
  flex: 1;
  min-width: 0;
}



.material-meta {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.material-category {
  background-color: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  line-height: 1;
}

.material-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 文件标题编辑样式 */
.material-title-section {
  margin-bottom: 8px;
}

.material-title {
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  line-height: 1.4;
}

.material-title:hover {
  background-color: var(--el-fill-color-light);
}

.edit-icon {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  opacity: 0;
  transition: opacity 0.2s;
}

.material-title:hover .edit-icon {
  opacity: 1;
}

.title-input {
  width: 100%;
}
</style>


