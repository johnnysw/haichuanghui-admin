<template>
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
      <el-col :span="12">
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="formInline.startTime"
            type="datetime"
            placeholder="请选择开始时间"
            style="width: 100%"
            value-format="YYYY-MM-DD HH:mm:ss"
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
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="地点" prop="location">
          <el-input
            v-model="formInline.location"
            placeholder="请输入地点"
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
      <el-col :span="24">
        <el-form-item label="海报图片" prop="poster">
          <el-input
            v-model="formInline.poster"
            placeholder="请输入海报图片URL"
            clearable
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="24">
        <el-form-item label="大赛简介" prop="summary">
          <el-input
            v-model="formInline.summary"
            type="textarea"
            placeholder="请输入大赛简介"
            :rows="3"
            clearable
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="24">
        <el-form-item label="大赛主题" prop="description">
          <el-input
            v-model="formInline.description"
            type="textarea"
            placeholder="请输入大赛主题"
            :rows="4"
            clearable
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="24">
        <el-form-item label="参赛条件" prop="requirements">
          <el-input
            v-model="formInline.requirements"
            type="textarea"
            placeholder="请输入参赛条件"
            :rows="3"
            clearable
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="24">
        <el-form-item label="支持政策" prop="prizes">
          <el-input
            v-model="formInline.prizes"
            type="textarea"
            placeholder="请输入支持政策"
            :rows="3"
            clearable
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="24">
        <el-form-item label="大赛流程" prop="schedule">
          <el-input
            v-model="formInline.schedule"
            type="textarea"
            placeholder="请输入大赛流程"
            :rows="3"
            clearable
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { getIndustryList, getRegionList } from "../api";
import type { FormItemProps } from "../types/types";

const props = defineProps<{
  formInline: FormItemProps;
}>();

const formRef = ref();
const industryOptions = ref<Array<{ id: number; name: string }>>([]);
const regionOptions = ref<Array<{ id: number; name: string }>>([]);

// 表单验证规则
const rules = reactive({
  title: [{ required: true, message: "大赛标题不能为空", trigger: "blur" }],
  industryId: [{ required: true, message: "行业领域不能为空", trigger: "change" }],
  regionId: [{ required: true, message: "地区不能为空", trigger: "change" }],
  organizer: [{ required: true, message: "主办方不能为空", trigger: "blur" }],
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

// 组件挂载时获取选项数据
onMounted(() => {
  fetchIndustryOptions();
  fetchRegionOptions();
});

defineExpose({
  getRef: () => formRef.value
});
</script>