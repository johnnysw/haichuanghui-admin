import { ref, reactive, computed, h, onMounted } from 'vue'
import { ElMessage, ElTag, ElLink } from 'element-plus'
import { getInvestorRequestList, updateRequestStatus } from '../api'
import { useRequestFilter } from './useRequestFilter'
import type {
  InvestorRequestItem,
  RequestQueryParams,
  RequestType
} from '../types/types'
import { REQUEST_TYPE_MAP, REQUEST_STATUS_MAP, RequestStatus } from '../types/types'
import type { PaginationProps } from '@pureadmin/table'

export function useRequestTable() {
  const loading = ref(false)
  const requestList = ref<InvestorRequestItem[]>([])
  const total = ref(0)

  // 使用筛选器
  const { filterForm, formRef, dateRange, typeOptions, statusOptions, resetForm } =
    useRequestFilter()

  // 分页配置
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 50, 100]
  })

  // 获取请求数据
  const getRequestData = async () => {
    loading.value = true
    try {
      const params: RequestQueryParams = {
        page: pagination.currentPage,
        limit: pagination.pageSize,
        search: filterForm.search || undefined,
        type: filterForm.type || undefined,
        status:
          filterForm.status !== undefined && filterForm.status !== ''
            ? filterForm.status
            : undefined,
        startDate: filterForm.startDate || undefined,
        endDate: filterForm.endDate || undefined
      }

      const response = await getInvestorRequestList(params)

      if (response.code === 200 && response.data) {
        requestList.value = response.data.list || []
        total.value = response.data.total || 0
        pagination.total = response.data.total || 0
        pagination.currentPage = response.data.currentPage || 1
        pagination.pageSize = response.data.pageSize || 10
      } else {
        ElMessage.error(response.message || '获取请求列表失败')
      }
    } catch (error) {
      console.error('获取请求列表失败:', error)
      ElMessage.error('获取请求列表失败')
    } finally {
      loading.value = false
    }
  }

  // 搜索
  const handleSearch = () => {
    // 处理日期范围
    if (dateRange.value && dateRange.value.length === 2) {
      filterForm.startDate = dateRange.value[0].toISOString().split('T')[0]
      const endDate = new Date(dateRange.value[1])
      endDate.setHours(23, 59, 59, 999)
      filterForm.endDate = endDate.toISOString().split('T')[0]
    } else {
      filterForm.startDate = ''
      filterForm.endDate = ''
    }

    pagination.currentPage = 1
    getRequestData()
  }

  // 重置
  const handleReset = () => {
    resetForm(formRef.value)
    filterForm.search = ''
    filterForm.type = ''
    filterForm.status = ''
    filterForm.startDate = ''
    filterForm.endDate = ''
    pagination.currentPage = 1
    getRequestData()
  }

  // 筛选条件改变
  const handleFilterChange = () => {
    pagination.currentPage = 1
    getRequestData()
  }

  // 分页大小改变
  const handleSizeChange = (val: number) => {
    pagination.pageSize = val
    pagination.currentPage = 1
    getRequestData()
  }

  // 当前页改变
  const handleCurrentChange = (val: number) => {
    pagination.currentPage = val
    getRequestData()
  }

  // 构建完整文件 URL
  const getFullFileUrl = (url: string): string => {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    if (url.startsWith('/public/')) {
      return `${import.meta.env.VITE_API_BASE_URL}${url}`
    }
    return `${import.meta.env.VITE_API_BASE_URL}/public${url.startsWith('/') ? url : `/${url}`}`
  }

  // 下载 BP 文件
  const downloadBP = (row: InvestorRequestItem) => {
    if (row.bpFileUrl) {
      const link = document.createElement('a')
      link.href = getFullFileUrl(row.bpFileUrl)
      link.download = row.bpFileName || 'BP.pdf'
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // 查看详情（暂时只显示消息）
  const viewDetail = (row: InvestorRequestItem) => {
    ElMessage.info(`查看详情功能开发中 - ID: ${row.id}`)
  }

  // 切换状态
  const handleStatusToggle = async (row: InvestorRequestItem) => {
    const newStatus =
      row.status === RequestStatus.PENDING ? RequestStatus.READ : RequestStatus.PENDING

    try {
      await updateRequestStatus({
        id: row.id,
        type: row.type,
        status: newStatus
      })

      // 更新本地数据
      row.status = newStatus
      if (newStatus === RequestStatus.READ) {
        row.readTime = new Date().toISOString()
      }

      ElMessage.success('状态已更新')
    } catch (error) {
      ElMessage.error('状态更新失败')
    }
  }

  // 表格列定义
  const columns: TableColumnList = [
    {
      type: 'index',
      width: 55,
      align: 'center',
      fixed: 'left'
    },
    {
      label: '请求类型',
      prop: 'type',
      minWidth: 100,
      align: 'center',
      cellRenderer: ({ row }) => {
        const typeInfo = REQUEST_TYPE_MAP[row.type as RequestType]
        return h(
          ElTag,
          {
            type: typeInfo?.type || 'info',
            effect: 'light',
            size: 'small'
          },
          () => typeInfo?.label || '未知'
        )
      }
    },
    {
      label: '发送人',
      prop: 'senderName',
      minWidth: 100,
      showOverflowTooltip: true
    },
    {
      label: '联系方式',
      prop: 'senderContact',
      minWidth: 130,
      showOverflowTooltip: true,
      cellRenderer: ({ row }) => {
        return row.senderPhone || row.senderEmail || '-'
      }
    },
    {
      label: '投资人',
      prop: 'investorName',
      minWidth: 100,
      showOverflowTooltip: true
    },
    {
      label: '投资机构',
      prop: 'investorInstitution',
      minWidth: 150,
      showOverflowTooltip: true,
      cellRenderer: ({ row }) => row.investorInstitution || '-'
    },
    {
      label: 'BP文件名/会议主题',
      prop: 'title',
      minWidth: 200,
      showOverflowTooltip: true,
      cellRenderer: ({ row }) => {
        if (row.type === 'bp') {
          if (row.bpFileName && row.bpFileUrl) {
            // 可下载的BP文件链接
            return h(
              'span',
              {
                style: {
                  color: '#409eff',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                },
                onClick: () => downloadBP(row)
              },
              row.bpFileName
            )
          }
          return row.bpFileName || '-'
        } else {
          return row.subject || '-'
        }
      }
    },
    {
      label: '期望时间',
      prop: 'preferredTime',
      minWidth: 150,
      cellRenderer: ({ row }) => {
        if (row.type === 'bp') {
          return '-'
        }
        if (!row.preferredTime) return '-'
        const date = new Date(row.preferredTime)
        return date
          .toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
          .replace(/\//g, '-')
      }
    },
    {
      label: '留言',
      prop: 'message',
      minWidth: 150,
      showOverflowTooltip: true,
      cellRenderer: ({ row }) => row.message || '-'
    },
    {
      label: '状态',
      prop: 'status',
      width: 100,
      align: 'center',
      cellRenderer: ({ row }) => {
        const statusInfo = REQUEST_STATUS_MAP[row.status]
        return h(
          ElTag,
          {
            type: statusInfo?.type || 'info',
            effect: 'light',
            size: 'small',
            style: { cursor: 'pointer' },
            onClick: () => handleStatusToggle(row)
          },
          () => statusInfo?.label || '未知'
        )
      }
    },
    {
      label: '提交时间',
      prop: 'createdTime',
      minWidth: 150,
      cellRenderer: ({ row }) => {
        if (!row.createdTime) return '-'
        const date = new Date(row.createdTime)
        return date
          .toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
          .replace(/\//g, '-')
      }
    }
  ]

  // 组件挂载时获取数据
  onMounted(() => {
    getRequestData()
  })

  const isShow = ref(false)

  return {
    filterForm,
    formRef,
    dateRange,
    loading,
    requestList,
    total,
    typeOptions,
    statusOptions,
    columns,
    pagination,
    isShow,
    handleSearch,
    handleReset,
    handleFilterChange,
    getRequestData,
    handleSizeChange,
    handleCurrentChange,
    downloadBP,
    handleStatusToggle
  }
}

