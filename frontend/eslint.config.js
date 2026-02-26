import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import { configs as tseslint } from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { importX } from "eslint-plugin-import-x";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import { readdirSync, statSync } from "fs";
import { join } from "path";

// features配下のディレクトリ名を取得
const featuresPath = "src/features";
let featureDirectories = [];
try {
    featureDirectories = readdirSync(featuresPath).filter((dir) => statSync(join(featuresPath, dir)).isDirectory());
} catch {
    // src/features が存在しない場合は空配列
}

export default defineConfig(
    // グローバルignore
    {
        ignores: ["dist/", "build/", "public/", "node_modules/", "**/*.min.js", "coverage/", "test-results/"],
    },

    // ベース設定
    js.configs.recommended,
    ...tseslint.recommended,
    importX.flatConfigs.recommended,
    importX.flatConfigs.typescript,

    // React + TypeScript
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            "simple-import-sort": simpleImportSort,
            "jsx-a11y": jsxA11y,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        settings: {
            "import-x/resolver": {
                typescript: {
                    project: "./tsconfig.app.json",
                },
            },
        },
        rules: {
            // React Hooks
            ...reactHooks.configs.recommended.rules,

            // React Refresh
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true, allowExportNames: ["buttonVariants"] },
            ],

            // TypeScript
            "@typescript-eslint/no-unused-vars": ["error"],
            "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
            "@typescript-eslint/no-explicit-any": "off",

            // Import整列（prettier-plugin-organize-importsの代替）
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            "import-x/first": "error",
            "import-x/newline-after-import": "error",
            "import-x/no-duplicates": "error",
            "import-x/no-unresolved": "off",
            "import-x/default": "off",
            "import-x/no-named-as-default-member": "off",
            "import-x/no-named-as-default": "off",

            // アクセシビリティ
            "jsx-a11y/anchor-is-valid": "off",

            // 一般
            "no-console": "warn",
            "no-debugger": "warn",
            "linebreak-style": ["error", "unix"],
        },
    },

    // features/ ディレクトリ間の相互参照禁止
    ...featureDirectories.map((feature) => ({
        files: [`${featuresPath}/${feature}/**/*.{ts,tsx}`],
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: featureDirectories
                        .filter((dir) => dir !== feature)
                        .flatMap((dir) => [
                            {
                                group: [`@/features/${dir}`, `@/features/${dir}/**`],
                                message: "features/から他のfeatures/は参照できません。",
                            },
                        ]),
                },
            ],
        },
    })),

    // features外からfeatures内部モジュールへのアクセス制限
    ...(featureDirectories.length > 0
        ? [
              {
                  files: ["src/**/*.{ts,tsx}"],
                  ignores: [`${featuresPath}/**/*.{ts,tsx}`],
                  rules: {
                      "no-restricted-imports": [
                          "error",
                          {
                              patterns: [
                                  {
                                      group: ["@/features/*/!(index)", "@/features/*/*"],
                                      message: "featuresモジュールはindex.tsからexportされたものだけをimportできます。",
                                  },
                              ],
                          },
                      ],
                  },
              },
          ]
        : []),

    // Prettierとの競合回避
    eslintConfigPrettier,
);
