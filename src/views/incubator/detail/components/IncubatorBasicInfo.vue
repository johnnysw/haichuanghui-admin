<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
    <div class="p-8">
      <div class="flex flex-col md:flex-row">
        <!-- 左侧：Logo和联系信息 -->
        <div class="flex flex-col md:w-1/4 mb-6 md:mb-0">
          <img
            v-if="logoUrl"
            :src="logoUrl"
            :alt="incubator.name"
            class="w-full h-64 md:h-48 object-cover rounded-lg mb-4"
          />
          <div
            v-else
            class="w-full h-64 md:h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center"
          >
            <div class="text-center text-gray-400">
              <el-icon :size="48">
                <component :is="useRenderIcon(OfficeBuilding)" />
              </el-icon>
              <p class="mt-2">暂无图片</p>
            </div>
          </div>
          <div class="flex flex-col space-y-2">
            <div v-if="incubator.address" class="flex items-center">
              <el-icon class="text-gray-500 w-6 h-6 mr-2">
                <component :is="useRenderIcon(LocationFilled)" />
              </el-icon>
              <span class="text-gray-700">{{
                incubator.address || "暂无地址信息"
              }}</span>
            </div>
            <div v-if="incubator.contactPhone" class="flex items-center">
              <el-icon class="text-gray-500 w-6 h-6 mr-2">
                <component :is="useRenderIcon(Phone)" />
              </el-icon>
              <span class="text-gray-700">{{ incubator.contactPhone }}</span>
            </div>
            <div v-if="incubator.website" class="flex items-center">
              <el-icon class="text-gray-500 w-6 h-6 mr-2">
                <component :is="useRenderIcon(Link)" />
              </el-icon>
              <a
                :href="incubator.website"
                class="text-primary hover:underline"
                target="_blank"
              >
                官方网站
              </a>
            </div>
            <div v-if="incubator.contactEmail" class="flex items-center">
              <el-icon class="text-gray-500 w-6 h-6 mr-2">
                <component :is="useRenderIcon(Message)" />
              </el-icon>
              <span class="text-gray-700">{{ incubator.contactEmail }}</span>
            </div>
          </div>
        </div>

        <!-- 右侧：详细信息 -->
        <div class="md:w-3/4 md:pl-8">
          <div
            class="flex flex-col md:flex-row md:items-center justify-between mb-4"
          >
            <div>
              <h1 class="text-3xl font-bold text-gray-800 mb-2">
                {{ incubator.name }}
              </h1>
              <div class="flex items-center flex-wrap gap-2">
                <span
                  v-if="centerTypeTag"
                  :class="[
                    'px-3 py-1 rounded-full text-sm',
                    centerTypeTag.className
                  ]"
                  :style="centerTypeTag.style"
                >
                  {{ centerTypeTag.text }}
                </span>
                <span
                  v-if="incubator.location"
                  class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {{ incubator.location }}
                </span>
                <span
                  v-if="incubator.isRecommended"
                  class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm"
                >
                  推荐载体
                </span>
                <span
                  v-for="field in getServiceFields(incubator.services)"
                  :key="field"
                  class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {{ field }}
                </span>
              </div>
            </div>
          </div>

          <!-- 统计数据 -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6"
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
              {{ incubator.description || "暂无简介信息" }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import LocationFilled from "@iconify-icons/ep/location-filled";
import Phone from "@iconify-icons/ep/phone";
import Message from "@iconify-icons/ep/message";
import Link from "@iconify-icons/ep/link";
import OfficeBuilding from "@iconify-icons/ep/office-building";
import type { IncubatorDetail } from "../types/types";
import { computed } from "vue";
import { getFullImageUrl } from "@/utils/image";

// Props
const props = defineProps<{
  incubator: IncubatorDetail;
}>();

// 格式化数字（添加千位分隔符）
const formatNumber = (value: any) => {
  const numberValue = Number(value ?? 0);
  if (Number.isNaN(numberValue)) return "0";
  return numberValue.toLocaleString();
};

// 获取服务领域
const getServiceFields = (services: any) => {
  if (!services) return [];

  if (typeof services === "string") {
    try {
      const parsed = JSON.parse(services);
      if (Array.isArray(parsed)) {
        return parsed.slice(0, 3);
      }
      return services.split(/[,，]/).slice(0, 3);
    } catch (e) {
      return services.split(/[,，]/).slice(0, 3);
    }
  }

  if (Array.isArray(services)) {
    return services.slice(0, 3);
  }

  return [];
};

// 获取成立年份
const getEstablishedYear = () => {
  if (props.incubator.establishedYear) {
    return props.incubator.establishedYear;
  }

  if (props.incubator.establishedDate) {
    const year = new Date(props.incubator.establishedDate).getFullYear();
    if (!Number.isNaN(year)) return year;
  }

  return null;
};

const centerTypeTag = computed(() => {
  const centerType = props.incubator.centerType;
  if (centerType) {
    const text = centerType.name || centerType.code || "双创载体";
    if (centerType.color) {
      return {
        text,
        className: "",
        style: {
          backgroundColor: centerType.color,
          color: "#fff"
        }
      };
    }
    return {
      text,
      className: "bg-primary/10 text-primary",
      style: {}
    };
  }

  return null;
});

const statisticCards = computed(() => {
  const establishedYear = getEstablishedYear();
  const settledCompanies =
    props.incubator.settledCompaniesCount ?? props.incubator.companyCount ?? 0;
  const graduatedCompanies =
    props.incubator.graduatedCount ?? props.incubator.successCases ?? 0;
  const areaValue = props.incubator.area ?? props.incubator.areaSize ?? 0;

  return [
    {
      key: "views",
      label: "浏览量",
      value: formatNumber(
        props.incubator.totalViews ?? props.incubator.viewCount ?? 0
      )
    },
    {
      key: "favorites",
      label: "收藏数量",
      value: formatNumber(props.incubator.favorites ?? 0)
    },
    {
      key: "companies",
      label: "入驻企业",
      value: `${formatNumber(settledCompanies)}+`
    },
    {
      key: "graduates",
      label: "毕业企业",
      value: `${formatNumber(graduatedCompanies)}+`
    },
    {
      key: "established",
      label: "成立时间",
      value: establishedYear ? `${establishedYear}年` : "未知年"
    },
    {
      key: "area",
      label: "场地面积",
      value: `${formatNumber(areaValue)}㎡`
    }
  ];
});

const logoUrl = computed(() => {
  const logo = props.incubator.logo;
  if (!logo) return "";
  return getFullImageUrl(logo);
});
</script>
