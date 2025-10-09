<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
    <div class="p-8">
      <div class="flex flex-col md:flex-row">
        <div class="flex flex-col md:w-1/4 mb-6 md:mb-0">
          <img
            v-if="logoUrl"
            :src="logoUrl"
            :alt="offshore.name"
            class="w-full h-64 md:h-48 object-cover rounded-lg mb-4"
          />
          <div
            v-else
            class="w-full h-64 md:h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center"
          >
            <div class="text-center text-gray-400">
              <el-icon :size="48">
                <component :is="useRenderIcon('ep:office-building')" />
              </el-icon>
              <p class="mt-2">暂无图片</p>
            </div>
          </div>
          <div class="flex flex-col space-y-2 text-sm text-gray-700">
            <div v-if="offshore.address" class="flex items-center">
              <el-icon class="text-gray-500 w-5 h-5 mr-2">
                <component :is="useRenderIcon('ep:location')" />
              </el-icon>
              <span>{{ offshore.address }}</span>
            </div>
            <div
              v-if="offshore.country || offshore.city"
              class="flex items-center"
            >
              <el-icon class="text-gray-500 w-5 h-5 mr-2">
                <component :is="useRenderIcon('ep:flag')" />
              </el-icon>
              <span>{{
                [offshore.country, offshore.city].filter(Boolean).join(" · ")
              }}</span>
            </div>
            <div v-if="offshore.contactPhone" class="flex items-center">
              <el-icon class="text-gray-500 w-5 h-5 mr-2">
                <component :is="useRenderIcon('ep:phone')" />
              </el-icon>
              <span>{{ offshore.contactPhone }}</span>
            </div>
            <div v-if="offshore.website" class="flex items-center">
              <el-icon class="text-gray-500 w-5 h-5 mr-2">
                <component :is="useRenderIcon('ep:link')" />
              </el-icon>
              <a
                :href="offshore.website"
                class="text-primary hover:underline"
                target="_blank"
              >
                官方网站
              </a>
            </div>
            <div v-if="offshore.contactEmail" class="flex items-center">
              <el-icon class="text-gray-500 w-5 h-5 mr-2">
                <component :is="useRenderIcon('ep:message')" />
              </el-icon>
              <span>{{ offshore.contactEmail }}</span>
            </div>
          </div>
        </div>

        <div class="md:w-3/4 md:pl-8">
          <div
            class="flex flex-col md:flex-row md:items-center justify-between mb-4"
          >
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-3xl font-bold text-gray-800">
                  {{ offshore.name }}
                </h1>
                <el-tag :type="statusInfo.type" effect="dark">{{
                  statusInfo.label
                }}</el-tag>
              </div>
              <div class="flex items-center flex-wrap gap-2">
                <el-tag
                  v-if="offshore.centerType"
                  effect="plain"
                  :style="{
                    backgroundColor: typeInfo.bgColor,
                    color: typeInfo.color,
                    borderColor: typeInfo.color
                  }"
                >
                  {{ typeInfo.label }}
                </el-tag>
                <el-tag v-if="offshore.region" type="info" effect="plain">
                  {{ offshore.region.name }}
                </el-tag>
                <el-tag
                  v-if="offshore.isRecommended"
                  type="warning"
                  effect="plain"
                >
                  推荐中心
                </el-tag>
                <el-tag
                  v-for="industry in offshore.industries || []"
                  :key="industry.id"
                  type="success"
                  effect="plain"
                >
                  {{ industry.name }}
                </el-tag>
              </div>
            </div>
          </div>

          <!-- 统计数据卡片 -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6"
          >
            <div
              v-for="card in statisticCards"
              :key="card.key"
              class="bg-gray-50 rounded-lg p-4 text-center"
            >
              <div class="text-2xl font-bold text-primary">
                {{ card.value }}
              </div>
              <div class="text-gray-600 text-sm">{{ card.label }}</div>
            </div>
          </div>

          <!-- 简介 -->
          <div>
            <h2 class="text-xl font-semibold text-gray-800 mb-3">简介</h2>
            <p class="text-gray-700 leading-relaxed">
              {{ offshore.description || "暂无简介信息" }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import type {
  OffshoreCenterDetail,
  OffshoreStats,
  TypeInfo
} from "../types/types";
import { getFullImageUrl } from "@/utils/image";

const STATUS_TEXT: Record<
  number,
  { label: string; type: "success" | "warning" | "danger" | "info" }
> = {
  1: { label: "正常运营", type: "success" },
  2: { label: "已下线", type: "warning" },
  3: { label: "已禁用", type: "danger" }
};

const props = defineProps<{
  offshore: OffshoreCenterDetail;
  stats?: OffshoreStats | null;
}>();

const formatNumber = (value: any) => {
  const numberValue = Number(value ?? 0);
  if (Number.isNaN(numberValue)) return "0";
  return numberValue.toLocaleString();
};

const logoUrl = computed(() => {
  if (!props.offshore.logo) return "";
  return getFullImageUrl(props.offshore.logo);
});

const statusInfo = computed(() => {
  return (
    STATUS_TEXT[props.offshore.status ?? 1] || { label: "未知", type: "info" }
  );
});

const typeInfo = computed<TypeInfo>(() => {
  const centerType = props.offshore.centerType;
  if (!centerType) {
    return {
      label: "未知类型",
      color: "#2563eb",
      bgColor: "#eff6ff"
    };
  }
  return {
    label: centerType.name || centerType.code || "未知类型",
    color: centerType.color || "#2563eb",
    bgColor: centerType.color ? `${centerType.color}20` : "#eff6ff"
  };
});

const statisticCards = computed(() => {
  return [
    {
      key: "views",
      label: "累计浏览量",
      value: formatNumber(
        props.stats?.totalViews ?? props.offshore.viewCount ?? 0
      )
    },
    {
      key: "favorites",
      label: "收藏数量",
      value: formatNumber(props.stats?.favorites ?? 0)
    },
    {
      key: "companies",
      label: "服务企业数",
      value: formatNumber(props.offshore.serviceCount ?? 0)
    },
    {
      key: "cases",
      label: "成功案例数",
      value: formatNumber(props.offshore.successCases ?? 0)
    },
    {
      key: "rating",
      label: "综合评分",
      value: props.offshore.rating?.toFixed(1) ?? "0.0"
    }
  ];
});
</script>

<style scoped lang="scss"></style>
