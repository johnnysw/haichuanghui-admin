import { reactive } from "vue";
import type { FormRules } from "element-plus";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  parentId: [{
    required: true,
    message: "上级部门为必填项",
    trigger: ['blur', 'change']
  }],
  name: [{ required: true, message: "部门名称为必填项", trigger: "blur" }],
  sort: [{ required: true, message: "显示顺序为必填项", trigger: "blur" }]
});
