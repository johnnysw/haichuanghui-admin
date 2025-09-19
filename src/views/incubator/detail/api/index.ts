import type { ApiResponse } from "../../list/types/types";
import type { IncubatorDetail, IncubatorStats, PolicyFile, ImageFile } from "../types/types";

// 模拟详情数据
const mockDetailData: Record<number, IncubatorDetail> = {
  1: {
    id: 1,
    name: "深圳创新孵化器",
    location: "深圳",
    type: "科技园",
    status: 1,
    isRecommended: true,
    viewCount: 1200,
    createdTime: "2024-01-01 10:00:00",
    description: "深圳创新孵化器是一家专注于科技创新的综合性孵化平台，致力于为初创企业提供全方位的孵化服务。",
    website: "https://www.szincubator.com",
    contactPhone: "0755-12345678",
    contactEmail: "contact@szincubator.com",
    address: "广东省深圳市南山区科技园南区",
    services: ["办公场地", "资金对接", "导师辅导", "技术支持", "市场推广"],
    advantages: ["地理位置优越", "资源丰富", "专业团队", "成功案例多"],
    policies: [
      { name: "税收优惠政策文件.pdf", url: "/files/tax-policy.pdf", size: 1024000, type: "application/pdf" },
      { name: "租金减免实施细则.docx", url: "/files/rent-policy.docx", size: 2048000, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
      { name: "创业补贴申请指南.pdf", url: "/files/subsidy-guide.pdf", size: 1536000, type: "application/pdf" },
      { name: "人才引进优惠政策.pdf", url: "/files/talent-policy.pdf", size: 1800000, type: "application/pdf" }
    ] as PolicyFile[],
    images: [
      { name: "孵化器外观.jpg", url: "https://via.placeholder.com/400x300/4285f4/ffffff?text=孵化器外观", size: 245760, type: "image/jpeg" },
      { name: "办公环境.jpg", url: "https://via.placeholder.com/400x300/34a853/ffffff?text=办公环境", size: 312400, type: "image/jpeg" },
      { name: "会议室.jpg", url: "https://via.placeholder.com/400x300/fbbc04/ffffff?text=会议室", size: 198500, type: "image/jpeg" }
    ] as ImageFile[],
    establishedDate: "2020-01-01",
    areaSize: 5000,
    companyCount: 85,
    graduatedCount: 23,
    successStoryCount: 15
  },
  2: {
    id: 2,
    name: "杭州未来科技城",
    location: "杭州",
    type: "science-park",
    status: 1,
    isRecommended: false,
    viewCount: 2250,
    createdTime: "2024-01-03 09:30:00",
    description: "杭州未来科技城是集研发、孵化、产业化于一体的高新技术产业园区。",
    website: "https://www.hzfuture.com",
    contactPhone: "0571-87654321",
    contactEmail: "info@hzfuture.com",
    address: "浙江省杭州市余杭区未来科技城",
    services: ["产业孵化", "技术研发", "人才培养", "投融资服务"],
    advantages: ["政策支持", "产业集群", "人才聚集", "交通便利"],
    policies: [
      { name: "产业扶持政策.pdf", url: "/files/industry-support.pdf", size: 2200000, type: "application/pdf" },
      { name: "研发补贴实施办法.docx", url: "/files/rd-subsidy.docx", size: 1800000, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
      { name: "人才奖励政策.pdf", url: "/files/talent-reward.pdf", size: 1500000, type: "application/pdf" }
    ] as PolicyFile[],
    images: [
      { name: "园区景观.jpg", url: "https://via.placeholder.com/400x300/ff6d01/ffffff?text=园区景观", size: 428900, type: "image/jpeg" },
      { name: "研发中心.jpg", url: "https://via.placeholder.com/400x300/9c27b0/ffffff?text=研发中心", size: 356800, type: "image/jpeg" }
    ] as ImageFile[],
    establishedDate: "2019-06-15",
    areaSize: 12000,
    companyCount: 156,
    graduatedCount: 45,
    successStoryCount: 28
  },
  3: {
    id: 3,
    name: "北京创客空间",
    location: "北京",
    type: "创业园",
    status: 2,
    isRecommended: false,
    viewCount: 560,
    createdTime: "2024-01-05 08:20:00",
    description: "北京创客空间专注于早期创业项目的孵化和加速。",
    website: "https://www.bjmaker.com",
    contactPhone: "010-12345678",
    contactEmail: "hello@bjmaker.com",
    address: "北京市海淀区中关村",
    services: ["项目孵化", "创业辅导", "投资对接"],
    advantages: ["创业氛围浓厚", "投资机构多", "导师资源丰富"],
    policies: [
      { name: "创业扶持政策.pdf", url: "/files/startup-support.pdf", size: 1200000, type: "application/pdf" },
      { name: "场地优惠申请表.docx", url: "/files/venue-discount.docx", size: 800000, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
      { name: "融资支持指导手册.pdf", url: "/files/funding-guide.pdf", size: 1600000, type: "application/pdf" }
    ] as PolicyFile[],
    images: [
      { name: "创客空间.jpg", url: "https://via.placeholder.com/400x300/795548/ffffff?text=创客空间", size: 289600, type: "image/jpeg" }
    ] as ImageFile[],
    establishedDate: "2021-03-20",
    areaSize: 3000,
    companyCount: 42,
    graduatedCount: 8,
    successStoryCount: 5
  }
};

export const getIncubatorDetail = (id: number): Promise<ApiResponse<IncubatorDetail>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const detail = mockDetailData[id];
      if (detail) {
        resolve({
          code: 200,
          success: true,
          data: detail,
          message: "获取详情成功"
        });
      } else {
        reject({
          code: 404,
          success: false,
          message: "载体不存在"
        });
      }
    }, 200);
  });
};

export const getIncubatorStats = (id: number): Promise<ApiResponse<IncubatorStats>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const stats: IncubatorStats = {
        todayViews: Math.floor(Math.random() * 100) + 10,
        totalViews: mockDetailData[id]?.viewCount || 0,
        monthlyViews: Math.floor(Math.random() * 500) + 100,
        applications: Math.floor(Math.random() * 50) + 5,
        favorites: Math.floor(Math.random() * 200) + 20
      };
      resolve({
        code: 200,
        success: true,
        data: stats,
        message: "获取统计信息成功"
      });
    }, 150);
  });
};

// 更新载体状态（审核通过/拒绝等）
export const updateIncubatorStatus = (id: number, status: number, reason?: string): Promise<ApiResponse<null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const detail = mockDetailData[id];
      if (detail) {
        detail.status = status;
        detail.updatedTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      }
      resolve({
        code: 200,
        success: true,
        data: null,
        message: status === 1 ? "审核通过" : status === 3 ? "审核拒绝" : "状态更新成功"
      });
    }, 300);
  });
};