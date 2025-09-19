import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/incubator",
  name: "Incubator",
  component: Layout,
  redirect: "/incubator/list",
  meta: {
    icon: "ep:office-building",
    title: "双创载体管理",
    rank: 3
  },
  children: [
    {
      path: "/incubator/list",
      name: "IncubatorList",
      component: () => import("@/views/incubator/list/index.vue"),
      meta: {
        title: "载体列表"
      }
    },
    {
      path: "/incubator/add",
      name: "IncubatorAdd",
      component: () => import("@/views/incubator/add/index.vue"),
      meta: {
        title: "添加载体",
        showLink: false
      }
    },
    {
      path: "/incubator/detail/:id",
      name: "IncubatorDetail",
      component: () => import("@/views/incubator/detail/index.vue"),
      meta: {
        title: "载体详情",
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;