import { ref, reactive, computed, onMounted } from "vue";
import type { FormInstance, FormRules, UploadRequestOptions } from "element-plus";
import { message } from "@/utils/message";
import { getFullImageUrl } from "@/utils/image";
import { uploadImage } from "@/api/upload";
import type { Response } from "@/types/response";
import type { FileUploadResult } from "@/api/upload";
import { getContactInfo, updateContactInfo } from "../api";
import {
  defaultContactForm,
  type ContactFormModel,
  type ContactInfo,
} from "../types/types";

/** 邮箱校验正则 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 管理后台联系方式表单逻辑
 */
export const useContact = () => {
  const formRef = ref<FormInstance>();
  const formModel = reactive<ContactFormModel>({ ...defaultContactForm });
  const originalData = ref<ContactFormModel>({ ...defaultContactForm });

  const loading = ref(false);
  const submitLoading = ref(false);
  const uploading = ref(false);

  const qrPreview = computed(() => {
    if (!formModel.wechatQr) return "";
    return getFullImageUrl(formModel.wechatQr);
  });

  /** 表单规则（全部为可选字段，只做长度与格式校验） */
  const rules: FormRules<ContactFormModel> = {
    phone: [
      {
        trigger: "blur",
        validator: (_, value, callback) => {
          if (!value) return callback();
          const trimmed = value.trim();
          if (trimmed.length > 50) {
            callback(new Error("联系电话长度不能超过50个字符"));
            return;
          }
          callback();
        },
      },
    ],
    email: [
      {
        trigger: "blur",
        validator: (_, value, callback) => {
          if (!value) return callback();
          const trimmed = value.trim();
          if (trimmed.length > 100) {
            callback(new Error("邮箱长度不能超过100个字符"));
            return;
          }
          if (!EMAIL_PATTERN.test(trimmed)) {
            callback(new Error("请输入有效的邮箱地址"));
            return;
          }
          callback();
        },
      },
    ],
    wechat: [
      {
        trigger: "blur",
        validator: (_, value, callback) => {
          if (!value) return callback();
          const trimmed = value.trim();
          if (trimmed.length > 100) {
            callback(new Error("微信号长度不能超过100个字符"));
            return;
          }
          callback();
        },
      },
    ],
    address: [
      {
        trigger: "blur",
        validator: (_, value, callback) => {
          if (!value) return callback();
          const trimmed = value.trim();
          if (trimmed.length > 255) {
            callback(new Error("联系地址长度不能超过255个字符"));
            return;
          }
          callback();
        },
      },
    ],
    about: [
      {
        trigger: "blur",
        validator: (_, value, callback) => {
          if (!value) return callback();
          const trimmed = value.trim();
          if (trimmed.length > 2000) {
            callback(new Error("关于海创荟介绍长度不能超过2000字符"));
            return;
          }
          callback();
        },
      },
    ],
    quickLinks: [
      {
        trigger: ["change", "blur"],
        validator: (_, value, callback) => {
          if (!Array.isArray(value)) {
            callback(new Error("快捷链接数据格式不正确"));
            return;
          }

          for (const item of value) {
            if (!item) continue;
            const name = (item.name ?? "").trim();
            const url = (item.url ?? "").trim();

            if (!name && !url) {
              continue;
            }

            if (!name) {
              callback(new Error("快捷链接名称不能为空"));
              return;
            }

            if (name.length > 50) {
              callback(new Error("快捷链接名称不能超过50个字符"));
              return;
            }

            if (!url) {
              callback(new Error("快捷链接地址不能为空"));
              return;
            }

            if (url.length > 255) {
              callback(new Error("快捷链接地址不能超过255个字符"));
              return;
            }
          }

          callback();
        },
      },
    ],
  };

  /** 生成默认快捷链接数组 */
  const normalizeQuickLinks = (links: ContactInfo["quickLinks"]) => {
    if (!Array.isArray(links)) return [];
    return links
      .filter((item) => item && typeof item === "object")
      .map((item) => ({
        name: (item.name ?? "").trim(),
        url: (item.url ?? "").trim(),
      }))
      .filter((item) => item.name || item.url);
  };

  /** 将接口数据写入表单 */
  const assignForm = (data?: ContactInfo | null) => {
    const payload: ContactFormModel = {
      phone: data?.phone ?? "",
      email: data?.email ?? "",
      wechat: data?.wechat ?? "",
      address: data?.address ?? "",
      about: data?.about ?? "",
      wechatQr: data?.wechatQr ?? null,
      quickLinks: normalizeQuickLinks(data?.quickLinks),
    };

    Object.assign(formModel, payload);
    originalData.value = {
      ...payload,
      quickLinks: payload.quickLinks.map((item) => ({ ...item })),
    };
  };

  /**
   * 加载联系方式数据
   */
  const fetchContact = async () => {
    loading.value = true;
    try {
      const res = await getContactInfo();
      if (res.code === 200) {
        assignForm(res.data ?? null);
      } else {
        message(res.message || "获取联系方式失败", { type: "error" });
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || "获取联系方式失败";
      message(errorMsg, { type: "error" });
    } finally {
      loading.value = false;
    }
  };

  /**
   * 自定义上传处理（上传微信二维码图片）
   */
  const handleUploadQr = async (options: UploadRequestOptions) => {
    const file = options.file as File;
    uploading.value = true;

    try {
      const res: Response<FileUploadResult> = await uploadImage(file, "system");
      if (res.code === 200 && res.data?.url) {
        formModel.wechatQr = res.data.url;
        message(res.message || "上传成功", { type: "success" });
        options.onSuccess?.(res, file);
      } else {
        const errMsg = res.message || "上传失败";
        message(errMsg, { type: "error" });
        options.onError?.(new Error(errMsg));
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || "上传失败";
      message(errorMsg, { type: "error" });
      options.onError?.(new Error(errorMsg));
    } finally {
      uploading.value = false;
    }
  };

  /** 清除二维码图片 */
  const handleRemoveQr = () => {
    formModel.wechatQr = null;
    message("已移除二维码图片", { type: "info" });
  };

  /** 重置回初始数据 */
  const handleReset = () => {
    Object.assign(formModel, {
      ...originalData.value,
      quickLinks: originalData.value.quickLinks.map((item) => ({ ...item })),
    });
    formRef.value?.clearValidate();
  };

  /** 提交表单 */
  const handleSubmit = async () => {
    if (!formRef.value) return;

    const valid = await formRef.value.validate().catch(() => false);
    if (!valid) return;

    const payload: ContactFormModel = {
      phone: formModel.phone.trim(),
      email: formModel.email.trim(),
      wechat: formModel.wechat.trim(),
      address: formModel.address.trim(),
      about: formModel.about.trim(),
      wechatQr: formModel.wechatQr,
      quickLinks: formModel.quickLinks
        .map((item) => ({
          name: item.name.trim(),
          url: item.url.trim(),
        }))
        .filter((item) => item.name || item.url),
    };

    submitLoading.value = true;
    try {
      const res = await updateContactInfo(payload);
      if (res.code === 200) {
        assignForm(res.data ?? payload);
        message(res.message || "联系方式更新成功", { type: "success" });
      } else {
        message(res.message || "联系方式更新失败", { type: "error" });
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || "联系方式更新失败";
      message(errorMsg, { type: "error" });
    } finally {
      submitLoading.value = false;
    }
  };

  onMounted(fetchContact);

  /** 注册子表单实例，便于校验 */
  const registerForm = (instance: FormInstance) => {
    formRef.value = instance;
  };

  return {
    formModel,
    rules,
    loading,
    submitLoading,
    uploading,
    qrPreview,
    fetchContact,
    handleSubmit,
    handleReset,
    handleUploadQr,
    handleRemoveQr,
    registerForm,
  };
};

