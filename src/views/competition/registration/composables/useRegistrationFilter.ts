import { reactive, ref } from "vue";

export function useRegistrationFilter() {
  const form = reactive({
    status: ""
  });
  const formRef = ref();

  const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
  };

  return {
    form,
    formRef,
    resetForm
  };
}