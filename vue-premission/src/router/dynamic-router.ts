import Layout from "@/pages/Layout.vue";
export const dynamicRoutes = [
  {
    path: "/",
    name: "Layout",
    component: Layout,
    meta: {
      requireAuth: true,
      name: "首页",
    },
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/pages/Home.vue"),
        meta: {
          requireAuth: true,
          name: "首页",
        },
      },
      {
        path: "/premission",
        name: "Premission",
        component: () => import("@/pages/Presmission.vue"),
        meta: {
          requireAuth: true,
          name: "权限页面",
        },
      },
    ],
  },
];
