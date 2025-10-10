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
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="formInline.title" placeholder="请输入活动标题" clearable />
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
          <el-input v-model="formInline.organizer" placeholder="请输入主办方" clearable />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item label="协办方" prop="coOrganizers">
          <el-input v-model="formInline.coOrganizers" placeholder="请输入协办方" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="状态" prop="status">
          <el-select v-model="formInline.status" placeholder="请选择状态" clearable style="width: 100%">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
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
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择开始时间"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="formInline.endTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择结束时间"
            style="width: 100%"
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
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择报名截止时间"
            style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="地点" prop="location">
          <el-input v-model="formInline.location" placeholder="请输入地点" clearable />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="12">
        <el-form-item label="线上链接" prop="onlineUrl">
          <el-input v-model="formInline.onlineUrl" placeholder="请输入线上链接" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="海报地址" prop="poster">
          <el-input v-model="formInline.poster" placeholder="请输入海报图片URL" clearable />
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
          <el-input v-model="formInline.priceNote" type="textarea" placeholder="请输入价格说明" :rows="2" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="24">
        <el-form-item label="活动简介" prop="summary">
          <el-input v-model="formInline.summary" type="textarea" placeholder="请输入活动简介" :rows="3" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="24">
        <el-form-item label="活动详情" prop="description">
          <el-input v-model="formInline.description" type="textarea" placeholder="请输入活动详情" :rows="4" />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="24">
        <el-form-item label="活动日程" prop="schedule">
          <el-input v-model="formInline.schedule" type="textarea" placeholder="请输入活动日程" :rows="3" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import { ElForm, type FormRules } from "element-plus";
import { getEventTypes, getRegionList } from "../api";
import type { EventForm, OptionItem } from "../types/types";

const props = defineProps<{
  formInline: EventForm;
}>();

const formRef = ref<InstanceType<typeof ElForm>>();
const eventTypeOptions = ref<OptionItem[]>([]);
const regionOptions = ref<OptionItem[]>([]);

const statusOptions = [
  { label: "草稿", value: 0 },
  { label: "报名中", value: 1 },
  { label: "进行中", value: 2 },
  { label: "已结束", value: 3 },
  { label: "已取消", value: 4 },
];

const rules = reactive<FormRules<EventForm>>({
  title: [{ required: true, message: "活动标题不能为空", trigger: "blur" }],
  organizer: [{ required: true, message: "主办方不能为空", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
});

const fetchEventTypes = async () => {
  try {
    const res = await getEventTypes();
    if (res.code === 200) {
      eventTypeOptions.value = res.data || [];
    }
  } catch (error) {
    console.error("获取活动类型失败", error);
  }
};

const fetchRegions = async () => {
  try {
    const res = await getRegionList();
    if (res.code === 200) {
      regionOptions.value = res.data || [];
    }
  } catch (error) {
    console.error("获取地区失败", error);
  }
};

onMounted(() => {
  fetchEventTypes();
  fetchRegions();
});

defineExpose({
  getRef: () => formRef.value,
});
</script>

