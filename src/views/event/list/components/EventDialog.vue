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
          <el-form-item label="活动名称" prop="title">
            <el-input v-model="form.title" placeholder="请输入活动名称" />
          </el-form-item>
          <el-form-item label="活动类型" prop="type">
            <el-select
              v-model="form.type"
              placeholder="请选择活动类型"
              class="w-full"
            >
              <el-option label="创业培训" value="创业培训" />
              <el-option label="项目路演" value="项目路演" />
              <el-option label="投融资对接" value="投融资对接" />
              <el-option label="行业论坛" value="行业论坛" />
              <el-option label="创业沙龙" value="创业沙龙" />
              <el-option label="政策宣讲" value="政策宣讲" />
            </el-select>
          </el-form-item>
          <el-form-item label="主办方" prop="organizer">
            <el-input v-model="form.organizer" placeholder="请输入主办方名称" />
          </el-form-item>
          <el-form-item label="活动地点">
            <el-input v-model="form.location" placeholder="请输入城市" />
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入详细地址" />
          </el-form-item>
          <el-form-item label="最大参与人数">
            <el-input-number
              v-model="form.maxParticipants"
              :min="1"
              class="w-full"
            />
          </el-form-item>
        </div>
        <el-form-item label="活动描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入活动描述"
          />
        </el-form-item>
      </div>

      <!-- 时间安排 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-1 h-5 bg-primary rounded mr-3" />
          时间安排
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="form.startTime"
              type="datetime"
              placeholder="选择开始时间"
              value-format="YYYY-MM-DDTHH:mm:ssZ"
              class="w-full"
            />
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              placeholder="选择结束时间"
              value-format="YYYY-MM-DDTHH:mm:ssZ"
              class="w-full"
            />
          </el-form-item>
          <el-form-item label="报名开始时间">
            <el-date-picker
              v-model="form.registrationStartTime"
              type="datetime"
              placeholder="选择报名开始时间"
              value-format="YYYY-MM-DDTHH:mm:ssZ"
              class="w-full"
            />
          </el-form-item>
          <el-form-item label="报名结束时间">
            <el-date-picker
              v-model="form.registrationEndTime"
              type="datetime"
              placeholder="选择报名结束时间"
              value-format="YYYY-MM-DDTHH:mm:ssZ"
              class="w-full"
            />
          </el-form-item>
        </div>
      </div>

      <!-- 联系信息 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-1 h-5 bg-primary rounded mr-3" />
          联系信息
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <el-form-item label="联系人" prop="contactPerson">
            <el-input
              v-model="form.contactPerson"
              placeholder="请输入联系人姓名"
            />
          </el-form-item>
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input
              v-model="form.contactPhone"
              placeholder="请输入联系电话"
            />
          </el-form-item>
          <el-form-item label="联系邮箱">
            <el-input
              v-model="form.contactEmail"
              placeholder="请输入联系邮箱"
            />
          </el-form-item>
        </div>
      </div>

      <!-- 活动详情 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-1 h-5 bg-primary rounded mr-3" />
          活动详情
        </h3>
        <el-form-item label="参与要求">
          <el-input
            v-model="form.requirements"
            type="textarea"
            :rows="2"
            placeholder="请输入参与要求"
          />
        </el-form-item>
        <el-form-item label="活动议程">
          <el-input
            v-model="form.agenda"
            type="textarea"
            :rows="3"
            placeholder="请输入活动议程"
          />
        </el-form-item>
        <el-form-item label="活动收益">
          <el-input
            v-model="form.benefits"
            type="textarea"
            :rows="2"
            placeholder="请输入活动收益"
          />
        </el-form-item>
      </div>

      <!-- 活动标签 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <div class="w-1 h-5 bg-primary rounded mr-3" />
          活动标签
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
import { ref, computed, watch, nextTick } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { createEvent, updateEvent } from "../api/index";
import type { Event, EventCreateForm } from "../types/types";

interface Props {
  visible: boolean;
  mode: "add" | "edit" | "view";
  formData?: Event | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:visible": [value: boolean];
  success: [];
}>();

const formRef = ref<FormInstance>();
const loading = ref(false);
const tagInput = ref("");

// 弹窗标题
const dialogTitle = computed(() => {
  switch (props.mode) {
    case "add":
      return "新增活动";
    case "edit":
      return "编辑活动";
    case "view":
      return "查看活动";
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
const form = ref<EventCreateForm>({
  title: "",
  description: "",
  type: "",
  organizer: "",
  poster: "",
  location: "",
  address: "",
  startTime: "",
  endTime: "",
  registrationStartTime: "",
  registrationEndTime: "",
  maxParticipants: 100,
  contactPerson: "",
  contactPhone: "",
  contactEmail: "",
  requirements: "",
  agenda: "",
  benefits: "",
  tags: []
});

// 表单验证规则
const rules: FormRules = {
  title: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择活动类型", trigger: "change" }],
  organizer: [{ required: true, message: "请输入主办方名称", trigger: "blur" }],
  address: [{ required: true, message: "请输入详细地址", trigger: "blur" }],
  startTime: [{ required: true, message: "请选择开始时间", trigger: "change" }],
  endTime: [{ required: true, message: "请选择结束时间", trigger: "change" }],
  contactPerson: [
    { required: true, message: "请输入联系人姓名", trigger: "blur" }
  ],
  contactPhone: [
    { required: true, message: "请输入联系电话", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号码",
      trigger: "blur"
    }
  ]
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
          description: props.formData.description || "",
          type: props.formData.type,
          organizer: props.formData.organizer,
          poster: props.formData.poster || "",
          location: props.formData.location,
          address: props.formData.address,
          startTime: props.formData.startTime,
          endTime: props.formData.endTime,
          registrationStartTime: props.formData.registrationStartTime || "",
          registrationEndTime: props.formData.registrationEndTime || "",
          maxParticipants: props.formData.maxParticipants || 100,
          contactPerson: props.formData.contactPerson,
          contactPhone: props.formData.contactPhone,
          contactEmail: props.formData.contactEmail,
          requirements: props.formData.requirements || "",
          agenda: props.formData.agenda || "",
          benefits: props.formData.benefits || "",
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
    description: "",
    type: "",
    organizer: "",
    poster: "",
    location: "",
    address: "",
    startTime: "",
    endTime: "",
    registrationStartTime: "",
    registrationEndTime: "",
    maxParticipants: 100,
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    requirements: "",
    agenda: "",
    benefits: "",
    tags: []
  };
  tagInput.value = "";
  nextTick(() => {
    formRef.value?.clearValidate();
  });
};

// 标签相关方法
const addTag = () => {
  if (tagInput.value.trim()) {
    if (!form.value.tags) {
      form.value.tags = [];
    }
    form.value.tags.push(tagInput.value.trim());
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
      await createEvent(form.value);
      ElMessage.success("新增成功");
    } else {
      await updateEvent(props.formData!.id, form.value);
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
</style>
