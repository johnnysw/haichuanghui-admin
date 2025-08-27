<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { getMine, updateUserAvatar, updateCurrentUserInfo } from "@/api/user";
import type { FormInstance, FormRules } from "element-plus";
import ReCropperPreview from "@/components/ReCropperPreview";
import { createFormData, deviceDetection } from "@pureadmin/utils";
import { uploadImage, type FileUploadResult } from "@/api/upload";
import type { Response } from "@/types/response";
import uploadLine from "@iconify-icons/ri/upload-line";
import { getFullImageUrl } from "@/utils/image";
import { useNav } from "@/layout/hooks/useNav";

const emit = defineEmits(['avatarUpdated', 'infoUpdated']);

const { logout } = useNav();

defineOptions({
  name: "Profile"
});

const imgSrc = ref("");
const cropperBlob = ref();
const cropRef = ref();
const uploadRef = ref();
const isShow = ref(false);
const userInfoFormRef = ref<FormInstance>();
const isMobile = ref(deviceDetection());

const userInfos = reactive({
  avatar: "",
  nickname: "",
  email: "",
  phone: "",
  remark: ""
});

const loading = ref(false);
const submitLoading = ref(false);

const rules = reactive<FormRules>({
  nickname: [{ required: true, message: "昵称必填", trigger: "blur" }]
});

function queryEmail(queryString, callback) {
  const emailList = [
    { value: "@qq.com" },
    { value: "@126.com" },
    { value: "@163.com" }
  ];
  let results = [];
  let queryList = [];
  emailList.map(item =>
    queryList.push({ value: queryString.split("@")[0] + item.value })
  );
  results = queryString
    ? queryList.filter(
        item =>
          item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      )
    : queryList;
  callback(results);
}

const onChange = uploadFile => {
  const reader = new FileReader();
  reader.onload = e => {
    imgSrc.value = e.target.result as string;
    isShow.value = true;
  };
  reader.readAsDataURL(uploadFile.raw);
};

const handleClose = () => {
  cropRef.value.hidePopover();
  uploadRef.value.clearFiles();
  isShow.value = false;
};

const onCropper = ({ blob }) => (cropperBlob.value = blob);

const handleSubmitImage = async () => {
  if (!cropperBlob.value) {
    message("请先裁剪图片", { type: "warning" });
    return;
  }

  const avatarFile = new File([cropperBlob.value], "avatar.png", { type: cropperBlob.value.type });

  try {
    const res: Response<FileUploadResult> = await uploadImage(avatarFile, 'avatar');

    if (res && res.success === true && res.data?.url) {
      const fullAvatarUrl = getFullImageUrl(res.data.url);
      const avatarPathForBackend = res.data.url;

      userInfos.avatar = fullAvatarUrl;
      message(res.message || "更新头像成功", { type: "success" });
      handleClose();

      try {
        const updateRes = await updateUserAvatar(avatarPathForBackend);
        if (updateRes.code === 200) {
          emit('avatarUpdated', fullAvatarUrl);
        } else {
          message(updateRes.message || '保存头像信息失败', { type: "error" });
        }
      } catch (saveError: any) {
        console.error("保存头像信息失败:", saveError);
        const saveErrorMsg = saveError?.response?.data?.message || saveError.message || '未知错误';
        message(`保存头像失败: ${saveErrorMsg}`, { type: "error" });
      }
    } else {
      message(`上传头像失败: ${res?.message || '未知错误'}`, { type: "error" });
    }
  } catch (error: any) {
    console.error("更新头像请求失败:", error);
    const errorMsg = error?.response?.data?.message || error.message || '请检查网络或联系管理员';
    message(`更新头像失败: ${errorMsg}`, { type: "error" });
  }
};

const onSubmit = async (formEl: FormInstance) => {
  if (!formEl) return;

  ElMessageBox.confirm(
    '确认更新用户信息吗？更新后需要重新登录。',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(async () => {
    submitLoading.value = true;
    await formEl.validate((valid, fields) => {
      if (valid) {
        updateCurrentUserInfo(userInfos)
          .then((res) => {
            if (res.code === 200) {
              emit('infoUpdated', { nickname: userInfos.nickname });
              message("更新信息成功，请重新登录", { type: "success" });
              logout();
            } else {
              message(res.message || '更新信息失败', { type: "error" });
            }
          })
          .catch((error) => {
            console.error("更新信息失败:", error);
            message(`更新信息失败: ${error.message || '请稍后重试'}`, { type: "error" });
          })
          .finally(() => {
            submitLoading.value = false;
          });
      } else {
        console.log("error submit!", fields);
        submitLoading.value = false;
      }
    });
  })
  .catch(() => {
    // 用户点击"取消"或关闭弹窗，不做任何操作
  });
};

onMounted(async () => {
  loading.value = true;
  const res = await getMine();
  userInfos.nickname = res.data.nickname;
  userInfos.email = res.data.email;
  userInfos.phone = res.data.phone;
  userInfos.remark = res.data.remark;
  userInfos.avatar = getFullImageUrl(res.data.avatar);
  loading.value = false;
});
</script>

<template>
  <div
    :class="[
      'min-w-[180px]',
      isMobile ? 'max-w-[100%]' : 'max-w-[70%]'
    ]"
  >
    <h3 class="my-8">个人信息</h3>
    <el-form
      ref="userInfoFormRef"
      label-position="top"
      :rules="rules"
      :model="userInfos"
    >
      <el-form-item label="头像">
        <el-avatar :size="80" :src="userInfos.avatar" />
        <el-upload
          ref="uploadRef"
          accept="image/*"
          action="#"
          :limit="1"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onChange"
        >
          <el-button plain class="ml-4">
            <IconifyIconOffline :icon="uploadLine" />
            <span class="ml-2">更新头像</span>
          </el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="userInfos.nickname" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-autocomplete
          v-model="userInfos.email"
          :fetch-suggestions="queryEmail"
          :trigger-on-focus="false"
          placeholder="请输入邮箱"
          clearable
          class="w-full"
        />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input
          v-model="userInfos.phone"
          placeholder="请输入联系电话"
          clearable
        />
      </el-form-item>
      <el-form-item label="简介">
        <el-input
          v-model="userInfos.remark"
          placeholder="请输入简介"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 8 }"
          maxlength="56"
          show-word-limit
        />
      </el-form-item>
      <el-button
        type="primary"
        :loading="submitLoading"
        @click="onSubmit(userInfoFormRef)"
      >
        更新信息
      </el-button>
    </el-form>
    <el-dialog
      v-model="isShow"
      width="40%"
      title="编辑头像"
      :fullscreen="isMobile"
      destroy-on-close
      :before-close="handleClose"
    >
      <ReCropperPreview ref="cropRef" :imgSrc="imgSrc" @cropper="onCropper" />
      <template #footer>
        <div class="dialog-footer">
          <el-button bg text @click="handleClose">取消</el-button>
          <el-button bg text type="primary" @click="handleSubmitImage">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
