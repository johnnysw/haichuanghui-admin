import { reactive, ref } from 'vue'
import type { RequestQueryParams } from '../types/types'

export function useRequestFilter() {
  const filterForm = reactive<RequestQueryParams>({
    page: 1,
    limit: 10,
    search: '',
    type: '', // 请求类型
    status: '', // 状态
    startDate: '',
    endDate: ''
  })

  const formRef = ref()

  // 日期范围（用于 el-date-picker）
  const dateRange = ref<[Date, Date] | null>(null)

  // 请求类型选项
  const typeOptions = [
    { label: '全部', value: '' },
    { label: 'BP投递', value: 'bp' },
    { label: '线上会议', value: 'online_meeting' },
    { label: '线下约见', value: 'offline_meeting' }
  ]

  // 状态选项
  const statusOptions = [
    { label: '全部', value: '' },
    { label: '待查看', value: 0 },
    { label: '已查看', value: 1 }
  ]

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
    typeOptions,
    statusOptions,
    resetForm
  }
}

