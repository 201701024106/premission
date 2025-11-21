// 引入路由器
import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type RouteLocationNormalizedLoaded,
} from "vue-router";
import useUser from "@/store/user";
import Login from "@/pages/Login.vue";
import { dynamicRoutes } from "./dynamic-router";
import { parseRouter } from "@/util/router";
import usePremissionStore from "@/store/premission";
import { getDisc } from "../hooks/useOwnLocalStorage";
import { deepClone } from "@/util/index.ts";

const routers = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/403",
    name: "NoPremission",
    component: () => import("@/pages/errors/403.vue"),
  },
];

const NotFound = {
  path: "/:catchAll(.*)*", // 捕获所有路径
  name: "NotFound",
  component: () => import("@/pages/errors/404.vue"),
};

// 创建路由器
const router = createRouter({
  history: createWebHistory(),
  routes: routers,
});

router.beforeEach(
  async (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalizedLoaded,
    next: any,
  ) => {
    const useUserFn = useUser();
    const isLogin = useUserFn.token;
    const isNeedLogin = to.matched.some((item) => item.meta.requireAuth);

    // 处理从 localStorage 同步 token
    if (getDisc("token") && !isLogin) {
      useUserFn.setUserInfo({ token: getDisc("token") });
    }

    // 如果目标是登录页面
    if (to.path === "/login") {
      // 如果未登录，允许访问登录页
      if (!useUserFn.token) {
        next();
        return;
      }
      // 如果已登录，重定向到首页
      next("/");
      return;
    }

    // 处理未登录情况
    if (!useUserFn.token) {
      if (to.matched.length > 0 && !isNeedLogin) {
        next();
      } else {
        next("/login");
      }
      return;
    }

    // 已登录用户访问需要权限的页面
    const premissionStore = usePremissionStore();

    // 如果已经添加过动态路由，直接放行（但排除去往登录页的情况）
    if (premissionStore.hasAddDynamicRoute) {
      next();
      return;
    }

    try {
      const res = await premissionStore.fetchUserPression({
        username: useUserFn.token,
      });
      const { premission } = res;

      if (premission && Array.isArray(premission)) {
        resetRouter();
          // 解析路由
        const routesCopy = deepClone(dynamicRoutes);
        const filteredRoutes = parseRouter(premission, routesCopy);
        // 添加路由并验证
        filteredRoutes.forEach((route: any) => {
          router.addRoute(route);
        });
        router.addRoute(NotFound);
        premissionStore.SET_MENU_LIST(filteredRoutes);
        // 标记已添加动态路由
        premissionStore.SET_HAS_ADD_DYNAMIC_ROUTE(true);
        // 设置权限
        premissionStore.SET_premissionS(premission);

        // 使用 replace 避免浏览器历史记录问题
        next({ ...to, replace: true });
      } else {
        next();
      }
    } catch (error) {
      console.error("获取权限失败:", error);
      // 获取权限失败时跳转到登录页
      next("/login");
    }
  },
);

// 添加重置路由的函数
function resetRouter() {
  // 移除所有动态添加的路由
  const routes = router.getRoutes();
  routes.forEach((route) => {
    // 保留基础路由，移除动态添加的路由
    if (
      route.name &&
      !["Login", "NoPremission", "NotFound"].includes(route.name as string)
    ) {
      router.removeRoute(route.name);
    }
  });
}

export default router;
