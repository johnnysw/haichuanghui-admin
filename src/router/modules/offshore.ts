import { $t } from "@/plugins/i18n";
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/offshore",
  name: "Offshore",
  component: Layout,
  redirect: "/offshore/list",
  meta: {
    icon: "ep:compass",
    title: "离岸中心管理",
    rank: 11
  },
  children: [
    {
      path: "/offshore/list",
      name: "OffshoreList",
      component: () => import("@/views/offshore/list/index.vue"),
      meta: {
        title: "离岸中心列表"
      }
    },
    {
      path: "/offshore/detail/:id",
      name: "OffshoreDetail",
      component: () => import("@/views/offshore/detail/index.vue"),
      meta: {
        title: "离岸中心详情",
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;