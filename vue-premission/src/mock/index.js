import userMock from "./user"; 

// 方式 1：默认导出数组（推荐）
export default [
  ...userMock, // 解构 user 模块的 mock 配置（若 user.js 导出的是数组）
];