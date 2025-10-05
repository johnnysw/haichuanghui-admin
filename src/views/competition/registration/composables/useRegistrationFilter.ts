import { reactive, ref } from "vue";
import { REGISTRATION_STATUS_MAP } from "../types/types";

type FormModel = {
  status: string | number | "";
  teamName: string;
  contactName: string;
  contactPhone: string;
};

const INITIAL_FORM: FormModel = {
  status: "",
  teamName: "",
  contactName: "",
  contactPhone: "",
};

const STATUS_OPTIONS = Object.entries(REGISTRATION_STATUS_MAP).map(([value, meta]) => ({
  value: Number(value),
  label: meta.text,
}));

export function useRegistrationFilter() {
  const form = reactive<FormModel>({ ...INITIAL_FORM });
  const formRef = ref();

  const statusOptions = [
    { value: "", label: "全部状态" },
    ...STATUS_OPTIONS,
  ];

  const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    Object.assign(form, { ...INITIAL_FORM });
  };

  return {
    form,
    formRef,
    statusOptions,
    resetForm,
  };
}