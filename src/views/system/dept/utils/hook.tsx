import dayjs from "dayjs";
import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { getDeptList, addDept, updateDept, deleteDept } from "@/api/system";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import { reactive, ref, onMounted, h } from "vue";
import type { Dept } from "@/types/system";
import { cloneDeep, isAllEmpty, deviceDetection } from "@pureadmin/utils";
import { ElMessageBox } from "element-plus";

export function useDept() {
  const form = reactive({
    name: "",
    status: null
  });

  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  const { tagStyle } = usePublicHooks();

  const columns: TableColumnList = [
    {
      label: "部门名称",
      prop: "name",
      width: 180,
      align: "left"
    },
    {
      label: "排序",
      prop: "sort",
      minWidth: 70
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 100,
      cellRenderer: ({ row, props }) => (
        <el-tag size={props.size} style={tagStyle.value(row.status)}>
          {row.status === 1 ? "启用" : "停用"}
        </el-tag>
      )
    },
    {
      label: "备注",
      prop: "remark",
      minWidth: 150
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  function resetForm(formEl) {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    // 统一使用GET方式调用接口，通过query参数传递筛选条件
    const params = {
      name: form.name || undefined,
      status: form.status !== null ? form.status : undefined
    };
    
    const { data } = await getDeptList(params);
    let newData = data;
    if (!isAllEmpty(form.name)) {
      // 前端搜索部门名称
      newData = newData.filter(item => item.name.includes(form.name));
    }
    if (!isAllEmpty(form.status)) {
      // 前端搜索状态
      newData = newData.filter(item => item.status === form.status);
    }
    dataList.value = handleTree(newData); // 处理成树结构
    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  function formatHigherDeptOptions(treeList) {
    // 根据返回数据的status字段值判断追加是否禁用disabled字段，返回处理后的树结构，用于上级部门级联选择器的展示（实际开发中也是如此，不可能前端需要的每个字段后端都会返回，这时需要前端自行根据后端返回的某些字段做逻辑处理）
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].disabled = treeList[i].status === 0 ? true : false;
      formatHigherDeptOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  function openDialog(title = "新增", row?: Dept.FormData) {
    addDialog({
      title: `${title}部门`,
      props: {
        formInline: {
          id: row?.id ?? undefined,
          higherDeptOptions: formatHigherDeptOptions(cloneDeep(dataList.value)),
          parentId: row?.parentId ?? 0,
          name: row?.name ?? "",
          principalId: row?.principalId ?? undefined,
          sort: row?.sort ?? 0,
          status: row?.status ?? 1,
          remark: row?.remark ?? ""
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as Dept.FormData;
        
        FormRef.validate(async valid => {
          if (valid) {
            try {
              if (title === "新增") {
                await addDept(curData);
                message("新增部门成功", { type: "success" });
              } else {
                await updateDept(curData);
                message("修改部门成功", { type: "success" });
              }
              done(); // 关闭弹框
              onSearch(); // 刷新表格数据
            } catch (error) {
              message(`${title}部门失败：${error.message}`, { type: "error" });
            }
          }
        });
      }
    });
  }

  async function handleDelete(row: Dept.BaseDept) {
    try {
      await ElMessageBox.confirm(
        `确认要删除部门"${row.name}"吗？删除后将无法恢复，请谨慎操作！`,
        "删除确认",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }
      );

      await deleteDept(row.id);
      message("删除成功", { type: "success" });
      onSearch(); // 刷新表格数据
    } catch (err) {
      if (err !== "cancel") {
        message(`删除失败：${err.message}`, { type: "error" });
      }
    }
  }

  onMounted(() => {
    onSearch();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    /** 搜索 */
    onSearch,
    /** 重置 */
    resetForm,
    /** 新增、修改部门 */
    openDialog,
    /** 删除部门 */
    handleDelete,
    handleSelectionChange
  };
}