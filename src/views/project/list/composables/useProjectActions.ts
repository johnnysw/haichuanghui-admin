import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import { deviceDetection } from "@pureadmin/utils";
import type { FormItemProps, ProjectInfo } from "../types/types";
import { ref, h } from "vue";
import { useRouter } from "vue-router";
import { createProject, updateProject, deleteProject } from "../api";
import ProjectForm from "../components/ProjectForm.vue";

export function useProjectActions(onRefresh?: () => void) {
  const router = useRouter();
  const formRef = ref();

  function openDetail(row: ProjectInfo) {
    router.push(`/project/detail/${row.id}`);
  }

  function handleDelete(row: ProjectInfo) {
    ElMessageBox.confirm(
      `确认要删除项目名为"${row.name}"的这条数据吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        draggable: true
      }
    )
      .then(async () => {
        const result = await deleteProject(row.id);
        if (result.code === 200) {
          message("删除成功", { type: "success" });
          onRefresh?.(); // 刷新数据
        } else {
          message("删除失败: " + result.message, { type: "error" });
        }
      })
      .catch(() => {
        message("已取消删除", { type: "info" });
      });
  }

  function openDialog(title = "新增", row?: ProjectInfo) {
    addDialog({
      title: `${title}创业项目`,
      props: {
        formInline: {
          id: row?.id ?? null,
          name: row?.name ?? "",
          companyName: row?.companyName ?? "",
          shortDescription: row?.shortDescription ?? "",
          fullDescription: row?.fullDescription ?? "",
          description: row?.description ?? "",
          industryId: row?.industryId ?? null,
          regionId: row?.regionId ?? null,
          location: row?.location ?? "",
          fundingStageId: row?.fundingStageId ?? null,
          fundingAmount: row?.fundingAmount ?? "",
          valuation: row?.valuation ?? "",
          fundingNeeds: row?.fundingNeeds ?? "",
          introduction: row?.introduction ?? "",
          coreTechnology: row?.coreTechnology ?? "",
          businessModel: row?.businessModel ?? "",
          teamInfo: row?.teamInfo ?? "",
          fundingHistory: row?.fundingHistory ?? "",
          developmentPlan: row?.developmentPlan ?? "",
          marketAnalysis: row?.marketAnalysis ?? "",
          competitiveAdvantage: row?.competitiveAdvantage ?? "",
          foundingDate: row?.foundingDate ?? "",
          status: row?.status ?? 0,
          isRecommended: row?.isRecommended ?? false,
          logoUrl: row?.logoUrl ?? "",
          images: row?.images ?? [],
          businessPlanUrl: row?.businessPlanUrl ?? "",
          contactEmail: row?.contactEmail ?? "",
          contactPhone: row?.contactPhone ?? "",
          websiteUrl: row?.websiteUrl ?? "",
          socialMedia: row?.socialMedia ?? ""
        }
      },
      width: "70%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(ProjectForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        
        function chores() {
          message(`${title}成功`, { type: "success" });
          done(); // 关闭弹框
          // 这里应该刷新表格数据，但由于组合式API的限制，我们在主页面中处理
        }
        
        FormRef.validate(async (valid) => {
          if (valid) {
            try {
              let result;
              if (title === "新增") {
                result = await createProject(curData);
              } else {
                result = await updateProject(curData.id!, curData);
              }
              
              if (result.code === 200) {
                chores();
                onRefresh?.(); // 刷新数据
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