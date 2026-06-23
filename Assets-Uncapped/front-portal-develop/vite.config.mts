import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { UserConfig, defineConfig } from "vite"
import checker from "vite-plugin-checker"
import oxlint from "vite-plugin-oxlint"
import svgr from "vite-plugin-svgr"
import { TestUserConfig } from "vitest/node"
import buildToolsPlugin from "./tools/vite-plugin-build-tools.mjs"

type Config = UserConfig & {
  test: TestUserConfig
}

export default defineConfig(
  ({ mode }): Config => ({
    plugins: [
      react(),
      tailwindcss(),
      svgr({
        svgrOptions: {
          exportType: "named",
        },
        include: "**/*.svg",
      }),
      checker({
        typescript: true,
      }),
      oxlint({
        path: "src",
        quiet: true,
      }),
      buildToolsPlugin(),
    ],
    build: {
      outDir: "build",
      assetsDir: "static",
      rollupOptions: {
        output: {
          assetFileNames: "static/[hash][extname]",
          chunkFileNames: "static/[hash].js",
        },
      },
      sourcemap: mode === "production",
    },
    envPrefix: "REACT_APP_",
    resolve: {
      alias: {
        dompurify: "dompurify/dist/purify.js",
      },
    },
    server: {
      open: true,
      port: 3000,
      strictPort: true,
    },
    preview: {
      port: 3000,
      strictPort: true,
    },
    test: {
      coverage: {
        reporter: ["text-summary", "json-summary", "json", "html"],
        reportOnFailure: true,
        exclude: [
          "src/**/*.stories.*",
          "src/services/api/**",
          "src/mocks/**",
          "src/stubs/**",
        ],
      },
      exclude: [
        "**/node_modules/**",
        "**/cypress/**",
        "**/.claude/worktrees/**",
      ],
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/setupTests.ts"],
    },
  })
)
