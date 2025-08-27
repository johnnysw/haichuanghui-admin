import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { isPhone, isEmail } from "@pureadmin/utils";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  nickname: [{ required: true, message: "昵称为必填项", trigger: "blur" }],
  username: [{ required: true, message: "名称为必填项", trigger: "blur" }],
  password: [{ required: true, message: "密码为必填项", trigger: "blur" }],
  wechat: [{ required: false, message: "微信号为必填项", trigger: "blur" }],
  deptId: [{
    required: true,
    validator: (rule, value, callback) => {
      if (value === undefined || value === null || value === '') {
        callback(new Error('归属部门为必填项'));
      } else {
        callback();
      }
    },
    trigger: ['blur', 'change']
  }],
  phone: [
    { required: true, message: "手机号为必填项", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback();
        } else if (!isPhone(value)) {
          callback(new Error("请输入正确的手机号码格式"));
        } else {
          callback();
        }
      },
      trigger: "blur"
      // trigger: "click" // 如果想在点击确定按钮时触发这个校验，trigger 设置成 click 即可
    }
  ],
  email: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback();
        } else if (!isEmail(value)) {
          callback(new Error("请输入正确的邮箱格式"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});