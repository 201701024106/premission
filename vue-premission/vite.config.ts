import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteMockServe } from "vite-plugin-mock";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), "");
  const enableMock: boolean = env.VITE_ENABLE_MOCK == "true";
  let proxy;
  if (!enableMock) {
    proxy = {
      "/api": {
        target: env.VITE_API_URL || "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path: string) => path.replace(/^\/api/, ""),
      },
    };
  }
  return {
    // 重要：设置正确的 base 路径，必须与你的仓库名称匹配
    base: env.PAGE_BASE_URL,
    plugins: [
      vue(),
      viteMockServe({
        // mock 文件根目录（默认在 src/mock 下）
        mockPath: "src/mock",
        // 开发环境启用 mock
        enable: enableMock,
        // 忽略文件（可选）
        ignore: /^\_/,
        // 支持在浏览器中查看 mock
        logger: true,
      }),
    ],
    resolve: {
      extensions: [".js", ".ts", ".json", ".tsx"],
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 8080,
      proxy: proxy,
    },
  };
});
