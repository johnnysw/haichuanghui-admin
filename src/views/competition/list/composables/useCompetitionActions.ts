import CompetitionForm from "../components/CompetitionForm.vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import { deviceDetection } from "@pureadmin/utils";
import type { FormItemProps } from "../types/types";
import { reactive, ref, h } from "vue";
import { useRouter } from "vue-router";
import { createCompetition, updateCompetition, deleteCompetition } from "../api";
import type { Competition } from "@/types/competition";

export function useCompetitionActions() {
  const router = useRouter();
  const formRef = ref();

  function openDetail(row: Competition.CompetitionInfo) {
    router.push(`/competition/detail/${row.id}`);
  }

  function handleDelete(row: Competition.CompetitionInfo) {
    ElMessageBox.confirm(
      `确认要删除大赛名为${row.title}的这条数据吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true
      }
    )
      .then(async () => {
        const result = await deleteCompetition(row.id);
        if (result.code === 200) {
          message("删除成功", { type: "success" });
        } else {
          message("删除失败: " + result.message, { type: "error" });
        }
      })
      .catch(() => {
        message("已取消删除", { type: "info" });
      });
  }

  function openDialog(title = "新增", row?: Competition.CompetitionInfo) {
    addDialog({
      title: `${title}创业大赛`,
      props: {
        formInline: {
          id: row?.id ?? null,
          title: row?.title ?? "",
          industryId: row?.industryId ?? "",
          regionId: row?.regionId ?? "",
          organizer: row?.organizer ?? "",
          coOrganizers: row?.coOrganizers ?? "",
          startTime: row?.startTime ?? "",
          endTime: row?.endTime ?? "",
          registrationDeadline: row?.registrationDeadline ?? "",
          location: row?.location ?? "",
          onlineUrl: row?.onlineUrl ?? "",
          description: row?.description ?? "",
          summary: row?.summary ?? "",
          materialDescription: row?.materialDescription ?? "",
          requirements: row?.requirements ?? "",
          prizes: row?.prizes ?? "",
          judges: row?.judges ?? "",
          schedule: row?.schedule ?? "",
          status: row?.status ?? 0,
          isRecommended: row?.isRecommended ?? false,
          poster: row?.poster ?? ""
        }
      },
      width: "60%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(CompetitionForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        
        function chores() {
          message(`${title}成功`, { type: "success" });
          done(); // 关闭弹框
        }
        
        FormRef.validate(async (valid) => {
          if (valid) {
            try {
              let result;
              if (title === "新增") {
                result = await createCompetition(curData);
              } else {
                result = await updateCompetition(curData.id!, curData);
              }
              
              if (result.code === 200) {
                chores();
              } else {
                message(`${title}失败: ${result.message}`, { type: "error" });
              }
            } catch (error) {
              message(`${title}失败: ${error.message}`, { type: "error" });
            }
          }
        });
      }
    });
  }

  return {
    openDetail,
    handleDelete,
    openDialog
  };
}