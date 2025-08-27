<script setup lang="ts">
import { ref, reactive } from "vue";
import { message } from "@/utils/message";
import { deviceDetection } from "@pureadmin/utils";
import type { FormInstance, FormRules } from "element-plus";
import { changeUserPassword } from "@/api/user";
import { useNav } from "@/layout/hooks/useNav";
import { REGEXP_PWD } from "@/views/login/utils/rule";

defineOptions({
  name: "AccountManagement"
});

const dialogVisible = ref(false);
const dialogLoading = ref(false);
const passwordFormRef = ref<FormInstance>();
const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
});

const { logout } = useNav();

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入新密码'));
  } else if (value !== passwordForm.newPassword) {
    callback(new Error("两次输入的新密码不一致!"));
  } else {
    callback();
  }
};

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新密码'));
  } else if (!REGEXP_PWD.test(value)) {
    callback(new Error('密码格式应为6-20位，数字、字母、符号的任意两种组合'));
  } else {
    if (passwordForm.confirmPassword !== '') {
      if (!passwordFormRef.value) return;
      passwordFormRef.value.validateField('confirmPassword', () => null);
    }
    callback();
  }
};

const passwordRules = reactive<FormRules<typeof passwordForm>>({
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, validator: validatePass, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass2, trigger: 'blur' }
  ],
});

const list = ref([
  { title: "账户密码", illustrate: "及时修改密码，保障账户安全", button: "修改", key: 'password' }
  // {
  //   title: "密保手机",
  //   illustrate: "已经绑定手机：158****6789",
  //   button: "修改"
  // },
  // {
  //   title: "密保问题",
  //   illustrate: "未设置密保问题，密保问题可有效保护账户安全",
  //   button: "修改"
  // },
  // {
  //   title: "备用邮箱",
  //   illustrate: "已绑定邮箱：pure***@163.com",
  //   button: "修改"
  // }
]);

const openPasswordDialog = () => {
  passwordForm.oldPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
  passwordFormRef.value?.resetFields();
  dialogLoading.value = false;
  dialogVisible.value = true;
};

const handlePasswordSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid) => {
    if (valid) {
      dialogLoading.value = true;
      changeUserPassword({ oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword })
        .then((res) => {
          if (res.code === 200) {
            message("修改密码成功，请重新登录", { type: "success" });
            dialogVisible.value = false;
            logout();
          } else {
            message(res.message || '修改密码失败', { type: "error" });
          }
        })
        .catch(error => {
          console.error("修改密码失败:", error);
          message(`修改密码失败: ${error.message || '请稍后重试'}`, { type: "error" });
        })
        .finally(() => {
          dialogLoading.value = false;
        });
    }
  });
};

function onClick(item) {
  if (item.key === 'password') {
    openPasswordDialog();
  } else {
    console.log("onClick", item.title);
    message("请根据具体业务自行实现", { type: "success" });
  }
}
</script>

<template>
  <div
    :class="[
      'min-w-[180px]',
      deviceDetection() ? 'max-w-[100%]' : 'max-w-[70%]'
    ]"
  >
    <h3 class="my-8">账户管理</h3>
    <div v-for="(item, index) in list" :key="index">
      <div class="flex items-center">
        <div class="flex-1">
          <p>{{ item.title }}</p>
          <el-text class="mx-1" type="info">{{ item.illustrate }}</el-text>
        </div>
        <el-button type="primary" text @click="onClick(item)">
          {{ item.button }}
        </el-button>
      </div>
      <el-divider />
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="修改密码"
      width="30%"
      draggable
      destroy-on-close
      :fullscreen="deviceDetection()"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
        status-icon
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="6-20位，数字、字母、符号的任意两种组合" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            :loading="dialogLoading"
            @click="handlePasswordSubmit(passwordFormRef)"
          >
            确认修改
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.el-divider--horizontal {
  border-top: 0.1px var(--el-border-color) var(--el-border-style);
}
</style>
