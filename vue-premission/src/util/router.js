/**
 * 递归过滤权限路由表
 * @param userRouter 用户权限数组
 * @param allRouter 全部权限路由表
 * @return {Array} 过滤后的路由表
 */
const parseRouter = (userRouter, allRouter) => {
    // 提取用户权限名称到扁平数组
    const getUserPermissions = (permissions) => {
        let result = [];
        permissions.forEach(permission => {
            if (permission.name) {
                result.push(permission.name);
            }
            if (permission.children && permission.children.length > 0) {
                result = result.concat(getUserPermissions(permission.children));
            }
        });
        return result;
    };

    const userPermissions = getUserPermissions(userRouter);
    const realRouters = [];

    // 遍历所有路由配置
    allRouter.forEach(route => {
        // 检查该路由是否在用户权限中
        const hasPermission = userPermissions.some(permission =>
            route.meta && route.meta.name === permission
        );

        if (hasPermission) {
            // 如果有子路由，递归处理
            if (route.children && route.children.length > 0) {
                route.children = parseRouter(userRouter, route.children);
            }
            realRouters.push(route);
        }
    });

    return realRouters;
};

export {
    parseRouter,
}