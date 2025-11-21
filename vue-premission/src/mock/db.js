const admin_login = {
    token: "admin",
    username: "admin"
};
const vip_login = {
    token: "vip",
    username: "vip"
};
const vip_premission = {
  token: "vip",
  username: "vip",
  premission: [
    {
      name: "系统管理",
      children: [
        {
          name: "首页",
        },
      ],
    },
  ],
};

const admin_premission = {
  token: "admin",
  username: "admin",
  premission: [
    {
      name: "系统管理",
      children: [
        {
          name: "首页",
        },
        {
          name: "权限页面",
        },
      ],
    },
  ],
};

export { admin_login, vip_login, admin_premission, vip_premission };