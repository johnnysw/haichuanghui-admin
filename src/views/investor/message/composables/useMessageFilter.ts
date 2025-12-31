import { reactive, ref } from 'vue'
import type { MessageQueryParams } from '../types/types'

export function useMessageFilter() {
  const filterForm = reactive<MessageQueryParams>({
    page: 1,
    limit: 10,
    search: '',
    startDate: '',
    endDate: ''
  })

  const formRef = ref()

  const dateRange = ref<[Date, Date] | null>(null)

  const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    dateRange.value = null
    filterForm.startDate = ''
    filterForm.endDate = ''
  }

  return {
    filterForm,
    formRef,
    dateRange,
    resetForm
  }
}
