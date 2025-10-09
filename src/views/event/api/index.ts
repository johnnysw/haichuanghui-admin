// 活动管理相关API（模拟数据）

import type {
  EventItem,
  EventListParams,
  EventCreateForm,
  ApiResponse,
  PaginationResponse
} from "../types/types";

// 模拟活动数据
const mockEventData: EventItem[] = [
  {
    id: 1,
    title: "创业孵化大讲堂 - 如何从0到1打造成功的创业项目",
    description:
      "邀请知名创业导师和成功企业家分享创业经验，为创业者提供实用的创业指导和方法论。本次活动将深入探讨创业项目的商业模式设计、团队建设、融资策略等关键环节。",
    location: "深圳市南山区科技园创业中心",
    startTime: "2024-10-15 14:00:00",
    endTime: "2024-10-15 17:00:00",
    registrationDeadline: "2024-10-13 23:59:59",
    maxParticipants: 200,
    currentParticipants: 156,
    organizer: "深圳创业服务中心",
    contactPhone: "0755-88888888",
    contactEmail: "events@startup.com",
    category: "lecture",
    status: 1,
    isRecommended: true,
    coverImage:
      "https://via.placeholder.com/400x300/4285f4/ffffff?text=创业大讲堂",
    createdTime: "2024-09-15 10:30:00",
    updatedTime: "2024-09-20 15:45:00"
  },
  {
    id: 2,
    title: "2024年度创新创业项目路演大会",
    description:
      "汇聚优秀创业项目和投资机构，为创业者提供展示平台，促进项目与资本的有效对接。活动将邀请多家知名投资机构和创业导师现场点评。",
    location: "广州市天河区珠江新城国际会议中心",
    startTime: "2024-11-08 09:00:00",
    endTime: "2024-11-08 18:00:00",
    registrationDeadline: "2024-11-01 23:59:59",
    maxParticipants: 300,
    currentParticipants: 89,
    organizer: "广州创新创业协会",
    contactPhone: "020-88888888",
    contactEmail: "roadshow@innovation.com",
    category: "roadshow",
    status: 1,
    isRecommended: true,
    coverImage:
      "https://via.placeholder.com/400x300/34a853/ffffff?text=路演大会",
    createdTime: "2024-09-10 14:20:00",
    updatedTime: "2024-09-25 11:30:00"
  },
  {
    id: 3,
    title: "数字化转型创业训练营",
    description:
      "针对传统行业数字化转型需求，提供系统性的创业培训课程。课程涵盖数字化商业模式、技术应用、运营管理等多个维度。",
    location: "上海市浦东新区张江高科技园区",
    startTime: "2024-10-20 09:00:00",
    endTime: "2024-10-22 17:00:00",
    registrationDeadline: "2024-10-18 23:59:59",
    maxParticipants: 50,
    currentParticipants: 43,
    organizer: "上海数字创新中心",
    contactPhone: "021-88888888",
    contactEmail: "training@digital.com",
    category: "training",
    status: 1,
    isRecommended: false,
    coverImage: "https://via.placeholder.com/400x300/fbbc04/ffffff?text=训练营",
    createdTime: "2024-09-05 16:10:00",
    updatedTime: "2024-09-18 09:15:00"
  },
  {
    id: 4,
    title: "最新创业扶持政策解读会",
    description:
      "邀请政府相关部门负责人详细解读最新的创业扶持政策，包括税收优惠、资金补贴、场地支持等具体政策内容和申请流程。",
    location: "北京市海淀区中关村创业大街",
    startTime: "2024-11-15 14:30:00",
    endTime: "2024-11-15 16:30:00",
    registrationDeadline: "2024-11-13 23:59:59",
    maxParticipants: 150,
    currentParticipants: 67,
    organizer: "北京市创业服务中心",
    contactPhone: "010-88888888",
    contactEmail: "policy@beijing.gov.cn",
    category: "policy",
    status: 1,
    isRecommended: false,
    coverImage:
      "https://via.placeholder.com/400x300/ea4335/ffffff?text=政策解读",
    createdTime: "2024-09-12 11:40:00",
    updatedTime: "2024-09-22 14:25:00"
  },
  {
    id: 5,
    title: "投融资对接交流会",
    description:
      "搭建创业项目与投资机构的交流平台，促进优质项目与资本的精准对接。活动将采用一对一洽谈的形式，提高对接效率。",
    location: "杭州市滨江区阿里巴巴西溪园区",
    startTime: "2024-12-05 13:00:00",
    endTime: "2024-12-05 17:30:00",
    registrationDeadline: "2024-12-01 23:59:59",
    maxParticipants: 100,
    currentParticipants: 25,
    organizer: "杭州投资促进会",
    contactPhone: "0571-88888888",
    contactEmail: "investment@hangzhou.com",
    category: "investment",
    status: 2,
    isRecommended: false,
    coverImage:
      "https://via.placeholder.com/400x300/9c27b0/ffffff?text=投融资对接",
    createdTime: "2024-09-08 13:25:00",
    updatedTime: "2024-09-20 10:50:00"
  }
];

// 获取活动列表
export const getEventList = (
  params: EventListParams
): Promise<ApiResponse<PaginationResponse<EventItem>>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      let filteredData = [...mockEventData];

      // 应用过滤条件
      if (params.title) {
        filteredData = filteredData.filter(item =>
          item.title.toLowerCase().includes(params.title!.toLowerCase())
        );
      }

      if (params.location) {
        filteredData = filteredData.filter(item =>
          item.location.toLowerCase().includes(params.location!.toLowerCase())
        );
      }

      if (params.category) {
        filteredData = filteredData.filter(
          item => item.category === params.category
        );
      }

      if (params.status) {
        filteredData = filteredData.filter(
          item => item.status.toString() === params.status
        );
      }

      if (params.isRecommended) {
        const isRec = params.isRecommended === "1";
        filteredData = filteredData.filter(
          item => item.isRecommended === isRec
        );
      }

      if (params.organizer) {
        filteredData = filteredData.filter(item =>
          item.organizer.toLowerCase().includes(params.organizer!.toLowerCase())
        );
      }

      // 分页
      const total = filteredData.length;
      const start = (params.page - 1) * params.pageSize;
      const end = start + params.pageSize;
      const list = filteredData.slice(start, end);

      resolve({
        code: 200,
        message: "获取成功",
        data: {
          list,
          total,
          page: params.page,
          pageSize: params.pageSize
        }
      });
    }, 300);
  });
};

// 获取活动详情
export const getEventDetail = (id: number): Promise<ApiResponse<EventItem>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const event = mockEventData.find(item => item.id === id);
      if (event) {
        resolve({
          code: 200,
          message: "获取成功",
          data: event
        });
      } else {
        reject({
          code: 404,
          message: "活动不存在"
        });
      }
    }, 200);
  });
};

// 创建活动
export const createEvent = (
  data: EventCreateForm
): Promise<ApiResponse<EventItem>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newEvent: EventItem = {
        id: mockEventData.length + 1,
        ...data,
        currentParticipants: 0,
        createdTime: new Date().toLocaleString(),
        updatedTime: new Date().toLocaleString()
      };

      mockEventData.unshift(newEvent);

      resolve({
        code: 200,
        message: "创建成功",
        data: newEvent
      });
    }, 500);
  });
};

// 更新活动
export const updateEvent = (
  id: number,
  data: Partial<EventCreateForm>
): Promise<ApiResponse<EventItem>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockEventData.findIndex(item => item.id === id);
      if (index !== -1) {
        mockEventData[index] = {
          ...mockEventData[index],
          ...data,
          updatedTime: new Date().toLocaleString()
        };

        resolve({
          code: 200,
          message: "更新成功",
          data: mockEventData[index]
        });
      } else {
        reject({
          code: 404,
          message: "活动不存在"
        });
      }
    }, 500);
  });
};

// 删除活动
export const deleteEvent = (id: number): Promise<ApiResponse<null>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockEventData.findIndex(item => item.id === id);
      if (index !== -1) {
        mockEventData.splice(index, 1);
        resolve({
          code: 200,
          message: "删除成功",
          data: null
        });
      } else {
        reject({
          code: 404,
          message: "活动不存在"
        });
      }
    }, 300);
  });
};
