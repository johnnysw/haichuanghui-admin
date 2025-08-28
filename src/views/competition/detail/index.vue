<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCompetitionDetail } from "./composables/useCompetitionDetail";
import { useCompetitionDetailActions } from "./composables/useCompetitionDetailActions";
import { ElMessage, ElMessageBox } from "element-plus";
import dayjs from "dayjs";

defineOptions({
  name: "CompetitionDetail"
});

const route = useRoute();
const router = useRouter();

// 获取大赛ID
const competitionId = ref(Number(route.params.id) || 0);

// 使用composables
const { competitionData, loading, statusMap, fetchCompetitionDetail } = useCompetitionDetail();
const { saveCompetition, reviewCompetitionAction, toggleRecommendation } = useCompetitionDetailActions();

// 组件挂载时获取数据
onMounted(() => {
  if (competitionId.value) {
    fetchCompetitionDetail(competitionId.value);
  }
});

// 返回列表页
const goBack = () => {
  router.push("/competition/list");
};

// 审核大赛
const reviewCompetition = (status: number) => {
  if (!competitionData.value) return;

  if (status === 6) {
    // 拒绝时需要输入拒绝原因
    ElMessageBox.prompt("请输入拒绝原因：", "拒绝大赛", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputPattern: /^.{1,200}$/,
      inputErrorMessage: "拒绝原因长度应在1-200个字符之间"
    }).then(({ value }) => {
      reviewCompetitionAction(competitionId.value, status, value);
    }).catch(() => {
      ElMessage.info("已取消拒绝");
    });
  } else {
    const action = status === 1 ? "通过" : "审核";
    ElMessageBox.confirm(`确认要${action}该大赛吗？`, "确认操作", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(async () => {
      const result = await reviewCompetitionAction(competitionId.value, status);
      if (result.success) {
        // 更新本地数据
        if (competitionData.value) {
          competitionData.value.status = status;
          if (status !== 1) {
            competitionData.value.reviewComment = result.data?.reviewComment || "";
            competitionData.value.reviewTime = result.data?.reviewTime || "";
          }
        }
      }
    });
  }
};

// 切换推荐状态
const toggleRecommend = () => {
  if (!competitionData.value) return;

  const newRecommended = !competitionData.value.isRecommended;
  const action = newRecommended ? "推荐" : "取消推荐";

  ElMessageBox.confirm(`确认要${action}该大赛吗？`, "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(async () => {
    const result = await toggleRecommendation(competitionId.value, newRecommended);
    if (result.success) {
      // 更新本地数据
      if (competitionData.value) {
        competitionData.value.isRecommended = newRecommended;
      }
    }
  });
};
</script>

<template>
  <div class="main" v-loading="loading">
    <div class="header">
      <el-page-header @back="goBack" title="返回列表">
        <template #content>
          <span class="text-large font-600 mr-3"> 大赛详情 </span>
        </template>
        <template #extra>
          <div class="flex items-center">
            <el-button type="primary" @click="reviewCompetition(1)" v-if="competitionData?.status === 5">
              通过审核
            </el-button>
            <el-button type="danger" @click="reviewCompetition(6)" v-if="competitionData?.status === 5">
              拒绝
            </el-button>
            <el-button
              :type="competitionData?.isRecommended ? 'warning' : 'success'"
              @click="toggleRecommend"
              v-if="[1, 2, 3].includes(competitionData?.status || 0)"
            >
              {{ competitionData?.isRecommended ? '取消推荐' : '推荐大赛' }}
            </el-button>
          </div>
        </template>
      </el-page-header>
    </div>

    <div class="content" v-if="competitionData">
      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="info-item">
              <span class="label">大赛标题：</span>
              <span class="value">{{ competitionData.title }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="label">大赛状态：</span>
              <span class="value">
                <el-tag
                  :type="competitionData.status === 0 ? 'info' :
                         competitionData.status === 1 ? 'primary' :
                         competitionData.status === 2 ? 'success' :
                         competitionData.status === 3 ? 'warning' :
                         competitionData.status === 4 ? 'danger' :
                         competitionData.status === 5 ? '' :
                         'danger'">
                  {{ statusMap[competitionData.status] }}
                </el-tag>
              </span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="label">行业领域：</span>
              <span class="value">{{ competitionData.industry?.name }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="label">所在地区：</span>
              <span class="value">{{ competitionData.region?.name }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="label">主办方：</span>
              <span class="value">{{ competitionData.organizer }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="label">协办方：</span>
              <span class="value">{{ competitionData.coOrganizers || '无' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="label">开始时间：</span>
              <span class="value">{{ dayjs(competitionData.startTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="label">结束时间：</span>
              <span class="value">{{ dayjs(competitionData.endTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="label">报名截止：</span>
              <span class="value">{{ dayjs(competitionData.registrationDeadline).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="label">举办地点：</span>
              <span class="value">{{ competitionData.location || '无' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="label">线上地址：</span>
              <span class="value">{{ competitionData.onlineUrl || '无' }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="label">是否推荐：</span>
              <span class="value">
                <el-tag :type="competitionData.isRecommended ? 'success' : 'info'">
                  {{ competitionData.isRecommended ? '是' : '否' }}
                </el-tag>
              </span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="label">浏览量：</span>
              <span class="value">{{ competitionData.viewCount }}</span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="info-item">
              <span class="label">报名人数：</span>
              <span class="value">{{ competitionData.registrationCount }}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>详细描述</span>
          </div>
        </template>
        <div class="info-item">
          <div class="label">大赛简介：</div>
          <div class="value rich-text" v-html="competitionData.summary || '无'"></div>
        </div>
        <div class="info-item mt-4">
          <div class="label">大赛详情：</div>
          <div class="value rich-text" v-html="competitionData.description || '无'"></div>
        </div>
      </el-card>

      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>参赛要求</span>
          </div>
        </template>
        <div class="info-item">
          <div class="label">参赛要求：</div>
          <div class="value rich-text" v-html="competitionData.requirements || '无'"></div>
        </div>
        <div class="info-item mt-4">
          <div class="label">材料说明：</div>
          <div class="value rich-text" v-html="competitionData.materialDescription || '无'"></div>
        </div>
      </el-card>

      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>奖项设置</span>
          </div>
        </template>
        <div class="info-item">
          <div class="value rich-text" v-html="competitionData.prizes || '无'"></div>
        </div>
      </el-card>

      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>评委介绍</span>
          </div>
        </template>
        <div class="info-item">
          <div class="value rich-text" v-html="competitionData.judges || '无'"></div>
        </div>
      </el-card>

      <el-card class="mb-4">
        <template #header>
          <div class="card-header">
            <span>赛程安排</span>
          </div>
        </template>
        <div class="info-item">
          <div class="value rich-text" v-html="competitionData.schedule || '无'"></div>
        </div>
      </el-card>

      <el-card v-if="competitionData.status === 6 && competitionData.reviewComment">
        <template #header>
          <div class="card-header">
            <span>拒绝原因</span>
          </div>
        </template>
        <div class="info-item">
          <div class="value">{{ competitionData.reviewComment }}</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.content {
  .info-item {
    margin-bottom: 15px;

    .label {
      font-weight: bold;
      color: #606266;
      min-width: 100px;
      display: inline-block;
    }

    .value {
      color: #303133;
    }

    .rich-text {
      min-height: 20px;
      line-height: 1.6;
    }
  }

  .card-header {
    font-weight: bold;
    color: #303133;
  }

  .mt-4 {
    margin-top: 1rem;
  }

  .mb-4 {
    margin-bottom: 1rem;
  }
}
</style>
