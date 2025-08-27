import "./reset.css";
import dayjs from "dayjs";
import roleForm from "../form/role.vue";
import editForm from "../form/index.vue";
import { zxcvbn } from "@zxcvbn-ts/core";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import userAvatar from "@/assets/user.jpg";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import ReCropperPreview from "@/components/ReCropperPreview";
import type { User, Status, Role } from "@/types/system";
import {
  getKeyList,
  isAllEmpty,
  hideTextAtIndex,
  deviceDetection,
  createFormData
} from "@pureadmin/utils";
import {
  getRoleIds,
  getDeptList,
  getUserList,
  getAllRoleList,
  addUser,
  assignRoles,
  updateUserStatus,
  updateUser,
  deleteUser,
  resetPassword,
  uploadAvatar
} from "@/api/system";
import {
  ElForm,
  ElInput,
  ElFormItem,
  ElProgress,
  ElMessageBox
} from "element-plus";
import {
  type Ref,
  h,
  ref,
  toRaw,
  watch,
  computed,
  reactive,
  onMounted,
  Fragment
} from "vue";
import { getFullImageUrl } from "@/utils/image";

export function useUser(tableRef: Ref, treeRef: Ref) {
  const form = reactive({
    deptId: "",
    username: "",
    phone: "",
    status: undefined as Status,
    pageNum: 1,
    pageSize: 10
  });
  const formRef = ref();
  const ruleFormRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  // 上传头像信息
  const avatarInfo = ref();
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const higherDeptOptions = ref();
  const treeData = ref([]);
  const treeLoading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true // 数据刷新后保留选项
    },
    {
      label: "用户编号",
      prop: "id",
      width: 90
    },
    {
      label: "用户头像",
      prop: "avatar",
      cellRenderer: ({ row }) => (
        <el-image
          fit="cover"
          preview-teleported={true}
          src={getFullImageUrl(row.avatar) || userAvatar}
          preview-src-list={Array.of(row.avatar || userAvatar)}
          class="w-[24px] h-[24px] rounded-full align-middle"
        />
      ),
      width: 90
    },
    {
      label: "用户名称",
      prop: "username",
      minWidth: 130
    },
    {
      label: "用户昵称",
      prop: "nickname",
      minWidth: 130
    },
    {
      label: "微信号",
      prop: "wechat",
      minWidth: 130
    },
    {
      label: "部门",
      prop: "dept.name",
      minWidth: 90
    },
    {
      label: "手机号码",
      prop: "phone",
      minWidth: 90,
      formatter: ({ phone }) => hideTextAtIndex(phone, { start: 3, end: 6 })
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={1}
          inactive-value={0}
          active-text="已启用"
          inactive-text="已停用"
          inline-prompt
          style={switchStyle.value}
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "创建时间",
      minWidth: 90,
      prop: "createTime",
      formatter: ({ createTime }) =>
        dayjs(createTime).format("YYYY-MM-DD HH:mm:ss")
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });
  // 重置的新密码
  const pwdForm = reactive({
    newPwd: ""
  });
  const pwdProgress = [
    { color: "#e74242", text: "非常弱" },
    { color: "#EFBD47", text: "弱" },
    { color: "#ffa500", text: "一般" },
    { color: "#1bbf1b", text: "强" },
    { color: "#008000", text: "非常强" }
  ];
  // 当前密码强度（0-4）
  const curScore = ref();
  const roleOptions = ref([]);

  async function onChange({ row, index }) {
    try {
      await ElMessageBox.confirm(
        `确认要<strong>${row.status === 0 ? "停用" : "启用"}</strong> <strong style='color:var(--el-color-primary)'>${row.username}</strong> 用户吗?`,
        "系统提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          dangerouslyUseHTMLString: true,
          draggable: true
        }
      );

      switchLoadMap.value[index] = { loading: true };

      // 调用修改状态接口
      await updateUserStatus({
        userId: row.id,
        status: row.status
      });

      switchLoadMap.value[index] = { loading: false };
      message("已成功修改用户状态", { type: "success" });

    } catch (error) {
      // 操作取消或接口失败时回滚状态
      row.status = row.status === 0 ? 1 : 0;
      if (error?.message) {
        message(`修改用户状态失败：${error.message}`, {
          type: "error"
        });
      }
    }
  }

  function handleUpdate(row) {
    // console.log(row);
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  function onbatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
    message(`已删除用户编号为 ${getKeyList(curSelected, "id")} 的数据`, {
      type: "success"
    });
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    // 统一使用GET方式调用接口，通过query参数传递筛选条件
    const params = {
      pageNum: form.pageNum,
      pageSize: form.pageSize,
      username: form.username || undefined,
      phone: form.phone || undefined,
      status: form.status !== undefined ? form.status : undefined,
      deptId: form.deptId || undefined
    };
    
    const { data } = await getUserList(params);
    dataList.value = data.list;
    pagination.total = data.total;
    pagination.pageSize = data.pageSize;
    pagination.currentPage = data.currentPage;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    form.deptId = "";
    treeRef.value.onTreeReset();
    onSearch();
  };

  function onTreeSelect({ id, selected }) {
    form.deptId = selected ? id : "";
    onSearch();
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

  function openDialog(title = "新增", row?: User.FormData) {
    addDialog({
      title: `${title}用户`,
      props: {
        formInline: {
          title,
          higherDeptOptions: formatHigherDeptOptions(higherDeptOptions.value),
          deptId: row?.deptId ?? undefined,
          nickname: row?.nickname ?? "",
          username: row?.username ?? "",
          password: row?.password ?? "",
          phone: row?.phone ?? "",
          email: row?.email ?? "",
          wechat: row?.wechat ?? "",
          status: row?.status ?? 1,
          remark: row?.remark ?? ""
        }
      },
      width: "46%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as User.FormData;
        function chores() {
          message(`您${title}了用户名称为 ${curData.username} 的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              addUser({
                username: curData.username,
                nickname: curData.nickname,
                password: curData.password || "", // 确保有值
                deptId: curData.deptId,
                phone: curData.phone,
                email: curData.email,
                wechat: curData.wechat,
                status: curData.status,
                remark: curData.remark,
              }).then(() => {
                chores();
              }).catch(error => {
                message(`新增用户失败：${error.message}`, {
                  type: "error"
                });
              });
            } else {
              // 修改用户
              updateUser({
                id: row.id, // 使用当前编辑行的id
                username: curData.username,
                nickname: curData.nickname,
                deptId: curData.deptId,
                phone: curData.phone,
                email: curData.email,
                wechat: curData.wechat,
                remark: curData.remark
              }).then(() => {
                chores();
              }).catch(error => {
                message(`修改用户失败：${error.message}`, {
                  type: "error"
                });
              });
            }
          }
        });
      }
    });
  }

  const cropRef = ref();
  /** 上传头像 */
  function handleUpload(row) {
    addDialog({
      title: "裁剪、上传头像",
      width: "40%",
      closeOnClickModal: false,
      fullscreen: deviceDetection(),
      contentRenderer: () =>
        h(ReCropperPreview, {
          ref: cropRef,
          imgSrc: getFullImageUrl(row.avatar) || userAvatar,
          onCropper: info => (avatarInfo.value = info)
        }),
      beforeSure: async (done) => {
        // 根据实际业务使用avatarInfo.value和row里的某些字段去调用上传头像接口即可
        try {
          // 将裁剪后的图片转为文件对象
          // const file = new File(
          //   [avatarInfo.value.blob],
          //   'avatar.png',
          //   { type: 'image/png' }
          // );

          // // 调用上传接口
          // await uploadAvatar({
          //   userId: row.id,
          //   file,
          // });

          // message("上传头像成功", { type: "success" });
          // done(); // 关闭弹框
          // onSearch(); // 刷新表格数据
          // 压缩图片
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();

          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = URL.createObjectURL(avatarInfo.value.blob);
          });

          // 设置固定尺寸
          canvas.width = 200;  // 设置合适的尺寸
          canvas.height = 200;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/png', 0.8); // 压缩质量为80%
          });

          await uploadAvatar({
            userId: row.id,
            file: new File([blob as BlobPart], "avatar.png", { type: "image/png" })
          });

          message("上传头像成功", { type: "success" });
          done();
          onSearch();
        } catch (error) {
          message(`上传头像失败：${error.message}`, { type: "error" });
        }
      },
      closeCallBack: () => cropRef.value.hidePopover()
    });
  }

  watch(
    pwdForm,
    ({ newPwd }) =>
      (curScore.value = isAllEmpty(newPwd) ? -1 : zxcvbn(newPwd).score)
  );

  /** 重置密码 */
  function handleReset(row) {
    addDialog({
      title: `重置 ${row.username} 用户的密码`,
      width: "30%",
      draggable: true,
      closeOnClickModal: false,
      fullscreen: deviceDetection(),
      contentRenderer: () => (
        <Fragment>
          <ElForm ref={ruleFormRef} model={pwdForm}>
            <ElFormItem
              prop="newPwd"
              rules={[
                {
                  required: true,
                  message: "请输入新密码",
                  trigger: "blur"
                }
              ]}
            >
              <ElInput
                clearable
                show-password
                type="password"
                v-model={pwdForm.newPwd}
                placeholder="请输入新密码"
              />
            </ElFormItem>
          </ElForm>
          <div class="mt-4 flex">
            {pwdProgress.map(({ color, text }, idx) => (
              <div
                class="w-[19vw]"
                style={{ marginLeft: idx !== 0 ? "4px" : 0 }}
              >
                <ElProgress
                  striped
                  striped-flow
                  duration={curScore.value === idx ? 6 : 0}
                  percentage={curScore.value >= idx ? 100 : 0}
                  color={color}
                  stroke-width={10}
                  show-text={false}
                />
                <p
                  class="text-center"
                  style={{ color: curScore.value === idx ? color : "" }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </Fragment>
      ),
      closeCallBack: () => (pwdForm.newPwd = ""),
      beforeSure: (done) => {
        ruleFormRef.value.validate(valid => {
          if (valid) {
            // 表单规则校验通过
            resetPassword({
              userId: row.id,
              newPassword: pwdForm.newPwd
            }).then(() => {
              message(`已成功重置 ${row.username} 用户的密码`, {
                type: "success"
              });
              done(); // 关闭弹框
              onSearch(); // 刷新表格数据
            }).catch(error => {
              message(`重置密码失败：${error.message}`, {
                type: "error"
              });
            });
          }
        });
      }
    });
  }

  /** 分配角色 */
  async function handleRole(row) {
    // 选中的角色列表
    const ids = (await getRoleIds({ userId: row.id })).data ?? [];
    addDialog({
      title: `分配 ${row.username} 用户的角色`,
      props: {
        formInline: {
          username: row?.username ?? "",
          nickname: row?.nickname ?? "",
          roleOptions: roleOptions.value ?? [],
          ids
        }
      },
      width: "400px",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(roleForm),
      beforeSure: (done, { options }) => {
        const curData = options.props.formInline as any; // 使用 any 类型暂时解决类型问题
        // 根据实际业务使用curData.ids和row里的某些字段去调用修改角色接口即可
        assignRoles({
          userId: row.id,
          roleIds: curData.ids
        }).then(() => {
          message("分配角色成功", { type: "success" });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }).catch(error => {
          message(`分配角色失败：${error.message}`, {
            type: "error"
          });
        });
      }
    });
  }

  /** 删除用户 */
  function handleDelete(row) {
    ElMessageBox.confirm(
      `确认要删除用户 <strong style='color:var(--el-color-primary)'>${row.username}</strong> 吗？此操作不可逆！`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        try {
          await deleteUser(row.id);
          message(`已成功删除用户 ${row.username}`, { type: "success" });
          onSearch(); // 刷新表格数据
        } catch (error) {
          message(`删除用户失败：${error.message}`, { type: "error" });
        }
      })
      .catch(() => {
        // 取消删除操作
      });
  }

  onMounted(async () => {
    treeLoading.value = true;
    onSearch();

    // 归属部门
    const { data } = await getDeptList();
    higherDeptOptions.value = handleTree(data);
    treeData.value = handleTree(data);
    treeLoading.value = false;

    // 角色列表
    roleOptions.value = (await getAllRoleList()).data;
  });

  return {
    form,
    loading,
    columns,
    dataList,
    treeData,
    treeLoading,
    selectedNum,
    pagination,
    buttonClass,
    deviceDetection,
    onSearch,
    resetForm,
    onbatchDel,
    openDialog,
    onTreeSelect,
    handleUpdate,
    handleUpload,
    handleReset,
    handleRole,
    handleDelete,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}