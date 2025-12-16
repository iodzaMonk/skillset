import { FlatCompat } from "@eslint/eslintrc";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: resolve(__dirname, "node_modules"),
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "prisma/migrations/**",
      "**/generated/**",
      "**/*.min.js",
      "next-env.d.ts",
      "Sokrates/**",
      "Sokrates/**/*",
      "coverage/**",
      "dist/**",
      ".gemini/**",
    ],
  },
  ...compat.extends("eslint-config-next/core-web-vitals"),
  ...compat.extends("eslint-config-next/typescript"),
];

export default eslintConfig;
