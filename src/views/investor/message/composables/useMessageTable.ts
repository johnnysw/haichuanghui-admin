import { ref, reactive, h, onMounted } from 'vue'
import { ElMessage, ElButton, ElPopconfirm } from 'element-plus'
import { getAdminMessageThreads, deleteAdminMessageThread } from '../api'
import { useMessageFilter } from './useMessageFilter'
import type { MessageThread } from '../types/types'
import type { PaginationProps } from '@pureadmin/table'

export function useMessageTable() {
  const loading = ref(false)
  const threads = ref<MessageThread[]>([])

  const { filterForm, formRef, dateRange, resetForm } = useMessageFilter()

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true,
    pageSizes: [10, 20, 50, 100]
  })

  const getData = async () => {
    loading.value = true
    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.pageSize,
        search: filterForm.search || undefined,
        startDate: filterForm.startDate || undefined,
        endDate: filterForm.endDate || undefined
      }

      const resp = await getAdminMessageThreads(params)

      if (resp.code === 200 && resp.data) {
        threads.value = (resp.data.list || []) as any

        const p = (resp.data as any).pagination
        if (p) {
          pagination.total = p.total || 0
          pagination.currentPage = p.page || 1
          pagination.pageSize = p.limit || 10
        } else {
          pagination.total = resp.data.total || 0
          pagination.currentPage = resp.data.currentPage || 1
          pagination.pageSize = resp.data.pageSize || 10
        }
      } else {
        ElMessage.error(resp.message || '获取留言失败')
      }
    } catch (e) {
      ElMessage.error('获取留言失败')
    } finally {
      loading.value = false
    }
  }

  const handleSearch = () => {
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
    getData()
  }

  const handleReset = () => {
    resetForm(formRef.value)
    filterForm.search = ''
    filterForm.startDate = ''
    filterForm.endDate = ''
    pagination.currentPage = 1
    getData()
  }

  const handleFilterChange = () => {
    pagination.currentPage = 1
    getData()
  }

  const handleSizeChange = (val: number) => {
    pagination.pageSize = val
    pagination.currentPage = 1
    getData()
  }

  const handleCurrentChange = (val: number) => {
    pagination.currentPage = val
    getData()
  }

  const handleDelete = async (row: MessageThread) => {
    const id = row.root?.originalId
    if (!id) return

    try {
      await deleteAdminMessageThread(id)
      ElMessage.success('删除成功')
      getData()
    } catch (e: any) {
      ElMessage.error(e?.message || '删除失败')
    }
  }

  const columns: TableColumnList = [
    {
      type: 'expand',
      slot: 'expand'
    },
    {
      type: 'index',
      width: 55,
      align: 'center'
    },
    {
      label: '发送人',
      prop: 'root.fromName',
      minWidth: 120,
      showOverflowTooltip: true,
      cellRenderer: ({ row }) => formatUser(row.root?.fromName, row.root?.fromRole)
    },
    {
      label: '接收人',
      prop: 'root.toName',
      minWidth: 120,
      showOverflowTooltip: true,
      cellRenderer: ({ row }) => formatUser(row.root?.toName, row.root?.toRole)
    },
    {
      label: '留言内容',
      prop: 'root.content',
      minWidth: 220,
      showOverflowTooltip: true,
      cellRenderer: ({ row }) => row.root?.content || '-'
    },
    {
      label: '最后时间',
      prop: 'lastTime',
      minWidth: 160,
      cellRenderer: ({ row }) => formatDateTime(row.lastTime)
    },
    {
      label: '创建时间',
      prop: 'root.createdTime',
      minWidth: 160,
      cellRenderer: ({ row }) => formatDateTime(row.root?.createdTime)
    },
    {
      label: '操作',
      width: 100,
      align: 'center',
      fixed: 'right',
      cellRenderer: ({ row }) => {
        return h(
          ElPopconfirm,
          {
            title: '确认删除该条留言及其所有回复？',
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            onConfirm: () => handleDelete(row)
          },
          {
            reference: () =>
              h(
                ElButton,
                { type: 'danger', link: true },
                () => '删除'
              )
          }
        )
      }
    }
  ]

  const formatDateTime = (value?: string) => {
    if (!value) return '-'
    const d = new Date(value)
    return d
      .toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
      .replace(/\//g, '-')
  }

  const formatUser = (name?: string, role?: string) => {
    const safeName = name || '-'
    if (!role) return safeName
    return `${safeName}（${role}）`
  }

  onMounted(() => {
    getData()
  })

  return {
    filterForm,
    formRef,
    dateRange,
    loading,
    threads,
    pagination,
    columns,
    handleSearch,
    handleReset,
    handleFilterChange,
    getData,
    handleSizeChange,
    handleCurrentChange,
    formatDateTime,
    formatUser
  }
}
