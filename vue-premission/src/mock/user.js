import Mock from "mockjs";
import { successCode } from "./status";
import { admin_login, vip_login,admin_premission,vip_premission } from "./db";
// 定义模拟接口
export default [
  // 示例2：登录接口（POST 请求）
  {
    url: "/api/login",
    method: "get",
    response: ({ query }) => {
        // 获取请求体参数
      const { username, password } = query;
      // 模拟登录校验
      if (username === "admin" && password === "123456") {
        return {
          code: 200,
          msg: "登录成功",
          data: admin_login,
        };
      } else if (username === "vip" && password === "123456") {
        return {
          code: 200,
          msg: "登录成功",
          data: vip_login,
        };
      } else {
        return {
          code: 400,
          msg: "用户名或密码错误",
          data: null,
        };
      }
    },
  },
  {
    url: "/api/userInfo",
    method: "post",
    response: ({ body }) => {
      // 获取请求体参数
      const { username } = body;
      if (username === "vip") {
        return {
          code: successCode,
            msg: "登录成功",
          data: vip_premission,
        }
      } else if (username === "admin") {
        return {
          code: successCode,
            msg: "登录成功",
          data: admin_premission,
        };
      } else {
        return {
          code: 1,
          msg: "用户不存在",
        };
      }
    },
  },
];
