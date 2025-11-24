import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteMockServe } from "vite-plugin-mock";
import { resolve } from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const enableMock: boolean = env.VITE_ENABLE_MOCK === "true";
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
    // 部署基础路径：根据实际部署环境调整（根路径用 "/"，子路径用 "/premission/"）
    base: env.VITE_BASE_URL || "/",
    plugins: [
      vue(),
      viteMockServe({
        mockPath: "./src/mock",
        enable: enableMock,
        prodEnabled: true,
        ignore: /^\_/,
        logger: true,
      }),
    ],
    resolve: {
      extensions: [".js", ".ts", ".json", ".tsx", ".vue"], // 补充 vue 扩展名
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 8080,
      proxy: proxy,
    },
    build: {
      rollupOptions: {
        output: {
          // 统一路径规则，避免硬编码
          chunkFileNames: "js/[name]-[hash].js",
          entryFileNames: "js/[name]-[hash].js",
          assetFileNames: (assetInfo) => {
            // 按文件类型分类，不重复加 assets 前缀（assetsDir 已处理）
            if (assetInfo.name?.endsWith(".css")) {
              return "css/[name]-[hash].css";
            }
            if (assetInfo.name?.match(/\.(png|jpe?g|gif|svg)$/)) {
              return "img/[name]-[hash].[ext]";
            }
            return "assets/[name]-[hash].[ext]";
          },
          // 关键修复：publicPath 优先继承 base 配置，避免路径冲突
          publicPath: env.VITE_BASE_URL || "/",
        },
      },
      outDir: "dist",
      assetsDir: "", // 清空 assetsDir，避免重复添加前缀（由 assetFileNames 统一管理）
      // 可选：开启 CSS 代码分割，确保 CSS 单独打包
      cssCodeSplit: true,
    },
    // 可选：确保 CSS 预处理器正常解析（如果用了 less/sass）
    css: {
      preprocessorOptions: {
        css: {
          charset: false, // 避免 charset 警告
        },
      },
    },
  };
});