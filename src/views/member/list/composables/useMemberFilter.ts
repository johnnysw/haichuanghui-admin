import { reactive, ref } from "vue";
import type { MemberQueryParams } from "../../types/types";
import { MEMBER_STATUS_OPTIONS } from "../../types/types";

export function useMemberFilter() {
  const filterForm = reactive<MemberQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    status: undefined
  });

  const formRef = ref();

  // 状态选项
  const statusOptions = MEMBER_STATUS_OPTIONS;

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
  };

  return {
    filterForm,
    formRef,
    statusOptions,
    resetForm
  };
}

