import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import * as dotenv from "dotenv";

export default defineConfig(async ({ mode }) => {
  const envFile = path.resolve(".env." + mode);
  if (!fs.existsSync(envFile)) {
    throw new Error("Env file is missing");
  }

  dotenv.config({ path: ".env." + mode, override: true });
  const APP_SETTINGS = await import("./app_settings");

  return {
    base: process.env.DIR_BASE,
    publicDir: process.env.DIR_PUBLIC,
    server: {
      host: false,
    },
    build: {
      outDir: process.env.DIR_BUILD,
      emptyOutDir: true,
      minify: "terser",
    },
    resolve: {
      alias: {
        "~/boxes_package": path.resolve(
          __dirname,
          process.env.DIR_BOXES_PACKAGES + process.env.BOXES_PACKAGE_NAME + ".css"
        ),
      },
    },
    plugins: [ViteMinifyPlugin()],
    define: {
      APP_SETTINGS,
    },
  };
});
