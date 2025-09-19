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
      :rules="formRules"
      label-width="120px"
      class="project-form"
    >
      <el-tabs v-model="activeTab" type="card">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <el-form-item label="项目名称" prop="name" class="col-span-1 md:col-span-2">
              <el-input
                v-model="form.name"
                placeholder="请输入项目名称"
                :disabled="props.mode === 'view'"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="行业分类" prop="industry">
              <el-select
                v-model="form.industry"
                placeholder="请选择行业分类"
                :disabled="props.mode === 'view'"
                class="w-full"
              >
                <el-option
                  v-for="option in INDUSTRY_OPTIONS"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="项目阶段" prop="stage">
              <el-select
                v-model="form.stage"
                placeholder="请选择项目阶段"
                :disabled="props.mode === 'view'"
                class="w-full"
              >
                <el-option
                  v-for="option in STAGE_OPTIONS"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="融资轮次" prop="fundingStage">
              <el-select
                v-model="form.fundingStage"
                placeholder="请选择融资轮次"
                :disabled="props.mode === 'view'"
                class="w-full"
              >
                <el-option
                  v-for="option in FUNDING_STAGE_OPTIONS"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="项目状态" prop="status">
              <el-select
                v-model="form.status"
                placeholder="请选择状态"
                :disabled="props.mode === 'view'"
                class="w-full"
              >
                <el-option label="正常" :value="1" />
                <el-option label="审核中" :value="2" />
                <el-option label="已拒绝" :value="3" />
                <el-option label="禁用" :value="0" />
              </el-select>
            </el-form-item>

            <el-form-item label="项目地区" prop="location">
              <el-input
                v-model="form.location"
                placeholder="请输入项目地区"
                :disabled="props.mode === 'view'"
              />
            </el-form-item>

            <el-form-item label="成立日期" prop="establishedDate">
              <el-date-picker
                v-model="form.establishedDate"
                type="date"
                placeholder="请选择成立日期"
                :disabled="props.mode === 'view'"
                class="w-full"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>

            <el-form-item label="项目LOGO" prop="logo" class="col-span-1 md:col-span-2">
              <el-input
                v-model="form.logo"
                placeholder="请输入LOGO图片URL"
                :disabled="props.mode === 'view'"
              />
              <div v-if="form.logo" class="mt-2">
                <el-image
                  :src="form.logo"
                  alt="LOGO预览"
                  fit="cover"
                  class="w-20 h-20 border rounded"
                />
              </div>
            </el-form-item>

            <el-form-item label="项目描述" prop="description" class="col-span-1 md:col-span-2">
              <el-input
                v-model="form.description"
                type="textarea"
                placeholder="请输入项目描述"
                :disabled="props.mode === 'view'"
                :rows="3"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </div>
        </el-tab-pane>

        <!-- 团队信息 -->
        <el-tab-pane label="团队信息" name="team">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <el-form-item label="创始人" prop="founder">
              <el-input
                v-model="form.founder"
                placeholder="请输入创始人姓名"
                :disabled="props.mode === 'view'"
              />
            </el-form-item>

            <el-form-item label="团队规模" prop="teamSize">
              <el-input-number
                v-model="form.teamSize"
                :min="1"
                :max="1000"
                :disabled="props.mode === 'view'"
                class="w-full"
              />
            </el-form-item>

            <el-form-item label="联系电话" prop="founderPhone">
              <el-input
                v-model="form.founderPhone"
                placeholder="请输入联系电话"
                :disabled="props.mode === 'view'"
              />
            </el-form-item>

            <el-form-item label="联系邮箱" prop="founderEmail">
              <el-input
                v-model="form.founderEmail"
                placeholder="请输入联系邮箱"
                :disabled="props.mode === 'view'"
              />
            </el-form-item>
          </div>
        </el-tab-pane>

        <!-- 财务信息 -->
        <el-tab-pane label="财务信息" name="financial">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <el-form-item label="注册资金(万元)" prop="registeredCapital">
              <el-input-number
                v-model="form.registeredCapital"
                :min="0"
                :max="100000"
                :disabled="props.mode === 'view'"
                class="w-full"
              />
            </el-form-item>

            <el-form-item label="当前估值(万元)" prop="currentValuation">
              <el-input-number
                v-model="form.currentValuation"
                :min="0"
                :max="1000000"
                :disabled="props.mode === 'view'"
                class="w-full"
              />
            </el-form-item>

            <el-form-item label="融资需求(万元)" prop="fundingNeeds">
              <el-input-number
                v-model="form.fundingNeeds"
                :min="0"
                :max="100000"
                :disabled="props.mode === 'view'"
                class="w-full"
              />
            </el-form-item>

            <el-form-item label="财务状况" prop="financialSituation" class="col-span-1 md:col-span-2">
              <el-input
                v-model="form.financialSituation"
                type="textarea"
                placeholder="请输入财务状况描述"
                :disabled="props.mode === 'view'"
                :rows="3"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>
          </div>
        </el-tab-pane>

        <!-- 商业模式 -->
        <el-tab-pane label="商业模式" name="business">
          <div class="space-y-4">
            <el-form-item label="商业模式" prop="businessModel">
              <el-input
                v-model="form.businessModel"
                type="textarea"
                placeholder="请描述商业模式"
                :disabled="props.mode === 'view'"
                :rows="3"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="目标市场" prop="targetMarket">
              <el-input
                v-model="form.targetMarket"
                type="textarea"
                placeholder="请描述目标市场"
                :disabled="props.mode === 'view'"
                :rows="3"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="竞争优势" prop="competitiveAdvantage">
              <el-input
                v-model="form.competitiveAdvantage"
                type="textarea"
                placeholder="请描述竞争优势"
                :disabled="props.mode === 'view'"
                :rows="3"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>

            <el-form-item label="风险评估" prop="riskAssessment">
              <el-input
                v-model="form.riskAssessment"
                type="textarea"
                placeholder="请描述风险评估"
                :disabled="props.mode === 'view'"
                :rows="3"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>
          </div>
        </el-tab-pane>

        <!-- 其他设置 -->
        <el-tab-pane label="其他设置" name="settings">
          <div class="space-y-4">
            <el-form-item label="是否推荐">
              <el-switch
                v-model="form.isRecommended"
                :disabled="props.mode === 'view'"
                active-text="推荐"
                inactive-text="普通"
              />
            </el-form-item>

            <el-form-item label="是否精选">
              <el-switch
                v-model="form.isFeatured"
                :disabled="props.mode === 'view'"
                active-text="精选"
                inactive-text="普通"
              />
            </el-form-item>

            <el-form-item label="项目图片" prop="images">
              <el-input
                v-model="imageInput"
                placeholder="请输入图片URL，按回车添加"
                :disabled="props.mode === 'view'"
                @keyup.enter="addImage"
              />
              <div v-if="form.images.length > 0" class="mt-2 space-y-2">
                <div
                  v-for="(image, index) in form.images"
                  :key="index"
                  class="flex items-center space-x-2"
                >
                  <el-image
                    :src="image"
                    alt="项目图片"
                    fit="cover"
                    class="w-16 h-12 border rounded"
                  />
                  <span class="flex-1 text-sm text-gray-600">{{ image }}</span>
                  <el-button
                    v-if="props.mode !== 'view'"
                    type="danger"
                    size="small"
                    @click="removeImage(index)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="相关文档" prop="documents">
              <el-input
                v-model="documentInput"
                placeholder="请输入文档名称，按回车添加"
                :disabled="props.mode === 'view'"
                @keyup.enter="addDocument"
              />
              <div v-if="form.documents.length > 0" class="mt-2">
                <el-tag
                  v-for="(doc, index) in form.documents"
                  :key="index"
                  :closable="props.mode !== 'view'"
                  class="mr-2 mb-2"
                  @close="removeDocument(index)"
                >
                  {{ doc }}
                </el-tag>
              </div>
            </el-form-item>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">
          {{ props.mode === 'view' ? '关闭' : '取消' }}
        </el-button>
        <el-button
          v-if="props.mode !== 'view'"
          type="primary"
          :loading="submitLoading"
          @click="handleSubmit"
        >
          {{ props.mode === 'add' ? '创建' : '更新' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from "vue";
import { ElMessage } from "element-plus";
import { createProject, updateProject } from "../../api";
import { 
  INDUSTRY_OPTIONS, 
  STAGE_OPTIONS, 
  FUNDING_STAGE_OPTIONS 
} from "../../types/types";
import type { ProjectItem, ProjectCreateForm } from "../../types/types";
import type { FormInstance, FormRules } from "element-plus";

interface Props {
  visible: boolean;
  mode: "add" | "edit" | "view";
  formData?: ProjectItem | null;
}

interface Emits {
  (e: "update:visible", value: boolean): void;
  (e: "success"): void;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  mode: "add",
  formData: null
});

const emit = defineEmits<Emits>();

const formRef = ref<FormInstance>();
const submitLoading = ref(false);
const activeTab = ref("basic");
const imageInput = ref("");
const documentInput = ref("");

// 表单数据
const form = reactive<ProjectCreateForm>({
  name: "",
  description: "",
  industry: "",
  stage: "",
  founder: "",
  founderPhone: "",
  founderEmail: "",
  teamSize: 1,
  location: "",
  establishedDate: "",
  registeredCapital: 0,
  currentValuation: 0,
  fundingNeeds: 0,
  fundingStage: "",
  businessModel: "",
  targetMarket: "",
  competitiveAdvantage: "",
  financialSituation: "",
  riskAssessment: "",
  logo: "",
  images: [],
  documents: [],
  status: 1,
  isRecommended: false,
  isFeatured: false
});

// 表单验证规则
const formRules: FormRules = {
  name: [
    { required: true, message: "请输入项目名称", trigger: "blur" }
  ],
  industry: [
    { required: true, message: "请选择行业分类", trigger: "change" }
  ],
  stage: [
    { required: true, message: "请选择项目阶段", trigger: "change" }
  ],
  founder: [
    { required: true, message: "请输入创始人姓名", trigger: "blur" }
  ],
  founderPhone: [
    { required: true, message: "请输入联系电话", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号码", trigger: "blur" }
  ],
  founderEmail: [
    { required: true, message: "请输入联系邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
  ],
  location: [
    { required: true, message: "请输入项目地区", trigger: "blur" }
  ],
  description: [
    { required: true, message: "请输入项目描述", trigger: "blur" }
  ]
};

// 弹窗标题
const dialogTitle = computed(() => {
  const titleMap = {
    add: "新增项目",
    edit: "编辑项目", 
    view: "查看项目"
  };
  return titleMap[props.mode];
});

// 弹窗显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value)
});

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    name: "",
    description: "",
    industry: "",
    stage: "",
    founder: "",
    founderPhone: "",
    founderEmail: "",
    teamSize: 1,
    location: "",
    establishedDate: "",
    registeredCapital: 0,
    currentValuation: 0,
    fundingNeeds: 0,
    fundingStage: "",
    businessModel: "",
    targetMarket: "",
    competitiveAdvantage: "",
    financialSituation: "",
    riskAssessment: "",
    logo: "",
    images: [],
    documents: [],
    status: 1,
    isRecommended: false,
    isFeatured: false
  });
  activeTab.value = "basic";
  imageInput.value = "";
  documentInput.value = "";
};

// 添加图片
const addImage = () => {
  if (imageInput.value.trim()) {
    form.images.push(imageInput.value.trim());
    imageInput.value = "";
  }
};

// 删除图片
const removeImage = (index: number) => {
  form.images.splice(index, 1);
};

// 添加文档
const addDocument = () => {
  if (documentInput.value.trim()) {
    form.documents.push(documentInput.value.trim());
    documentInput.value = "";
  }
};

// 删除文档
const removeDocument = (index: number) => {
  form.documents.splice(index, 1);
};

// 监听弹窗显示状态
watch(() => props.visible, (visible) => {
  if (visible) {
    if (props.mode === "add") {
      resetForm();
    } else if (props.formData && (props.mode === "edit" || props.mode === "view")) {
      Object.assign(form, {
        name: props.formData.name,
        description: props.formData.description,
        industry: props.formData.industry,
        stage: props.formData.stage,
        founder: props.formData.founder,
        founderPhone: props.formData.founderPhone,
        founderEmail: props.formData.founderEmail,
        teamSize: props.formData.teamSize,
        location: props.formData.location,
        establishedDate: props.formData.establishedDate,
        registeredCapital: props.formData.registeredCapital,
        currentValuation: props.formData.currentValuation,
        fundingNeeds: props.formData.fundingNeeds,
        fundingStage: props.formData.fundingStage,
        businessModel: props.formData.businessModel,
        targetMarket: props.formData.targetMarket,
        competitiveAdvantage: props.formData.competitiveAdvantage,
        financialSituation: props.formData.financialSituation,
        riskAssessment: props.formData.riskAssessment,
        logo: props.formData.logo,
        images: [...props.formData.images],
        documents: [...props.formData.documents],
        status: props.formData.status,
        isRecommended: props.formData.isRecommended,
        isFeatured: props.formData.isFeatured
      });
    }
    
    nextTick(() => {
      formRef.value?.clearValidate();
    });
  }
});

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    const valid = await formRef.value.validate();
    if (!valid) return;

    submitLoading.value = true;

    if (props.mode === "add") {
      await createProject(form);
      ElMessage.success("项目创建成功");
    } else if (props.mode === "edit" && props.formData) {
      await updateProject(props.formData.id, form);
      ElMessage.success("项目更新成功");
    }

    emit("success");
  } catch (error) {
    console.error("提交失败:", error);
    ElMessage.error("操作失败，请重试");
  } finally {
    submitLoading.value = false;
  }
};

// 取消操作
const handleCancel = () => {
  dialogVisible.value = false;
};
</script>

<style lang="scss" scoped>
.project-form {
  .el-form-item {
    margin-bottom: 18px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>