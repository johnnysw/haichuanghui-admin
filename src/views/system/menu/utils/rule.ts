import type { FormRules } from "element-plus";
import { Menu } from "@/types/system";

/** 表单校验规则 */
export const formRules: FormRules = {
  /** 菜单类型 */
  menuType: [
    {
      required: true,
      message: "请选择菜单类型",
      trigger: "change",
      type: "number"
    }
  ],
  /** 菜单名称 */
  title: [
    {
      required: true,
      message: "请输入菜单名称",
      trigger: "blur"
    },
    {
      min: 2,
      max: 50,
      message: "菜单名称长度应在2-50个字符之间",
      trigger: "blur"
    }
  ],
  /** 路由名称 */
  name: [
    {
      required: true,
      message: "请输入路由名称",
      trigger: "blur"
    },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: "路由名称只能包含字母、数字和下划线，且必须以字母开头",
      trigger: "blur"
    }
  ],
  /** 路由路径 */
  path: [
    {
      required: true,
      message: "请输入路由路径",
      trigger: "blur"
    },
    {
      pattern: /^\//,
      message: "路由路径必须以/开头",
      trigger: "blur"
    }
  ],
  /** 组件路径 */
  component: [
    {
      required: false,
      message: "请输入组件路径",
      trigger: "blur"
    }
  ],
  /** 排序号 */
  rank: [
    {
      required: true,
      message: "请输入排序号",
      trigger: "blur",
      type: "number"
    },
    {
      min: 0,
      max: 9999,
      message: "排序号必须在0-9999之间",
      trigger: "blur",
      type: "number"
    }
  ],
  /** 权限标识 */
  auths: [
    {
      required: false,
      message: "请输入权限标识",
      trigger: "blur"
    },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9:]*$/,
      message: "权限标识只能包含字母、数字和冒号，且必须以字母开头",
      trigger: "blur"
    }
  ],
  /** iframe链接 */
  frameSrc: [
    {
      required: false,
      message: "请输入iframe链接",
      trigger: "blur"
    },
    {
      pattern: /^(https?:)?\/\/.+/,
      message: "请输入有效的URL地址",
      trigger: "blur"
    }
  ]
};

/** 根据菜单类型获取验证规则 */
export const getRulesByMenuType = (menuType: Menu.MenuType): FormRules => {
  const rules = { ...formRules };

  // 如果是按钮类型
  if (menuType === 3) {
    // 按钮类型必须填写权限标识
    rules.auths[0].required = true;
    // 按钮类型不需要验证以下字段
    delete rules.name;
    delete rules.path;
    delete rules.component;
  }

  // 如果是外链类型
  if (menuType === 2) {
    // 外链类型不需要验证组件路径
    delete rules.component;
  }

  // 如果是iframe类型
  if (menuType === 1) {
    // iframe类型必须填写iframe链接
    rules.frameSrc[0].required = true;
    // iframe类型不需要验证组件路径
    delete rules.component;
  }

  return rules;
};
