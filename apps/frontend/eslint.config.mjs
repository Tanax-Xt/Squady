import nextPlugin from "@next/eslint-plugin-next";
import parserTypescript from "@typescript-eslint/parser";
import pluginImport from "eslint-plugin-import-x";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import pluginTypescript from "typescript-eslint";

export default pluginTypescript.config([
  {
    ignores: [".next", "dist", "node_modules", "public"],
  },
  {
    plugins: {
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs["jsx-runtime"].rules,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    plugins: {
      "react-hooks": reactHooksPlugin,
    },
    rules: reactHooksPlugin.configs.recommended.rules,
  },
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  pluginImport.flatConfigs.recommended,
  pluginImport.flatConfigs.typescript,
  pluginTypescript.configs.recommendedTypeChecked,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: parserTypescript,
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "no-console": "off",

      "import-x/no-named-as-default": "off",
      "import-x/no-named-as-default-member": "off",
      "import-x/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
            orderImportKind: "asc",
            caseInsensitive: false,
          },
          "newlines-between": "always",
          warnOnUnassignedImports: false,
          pathGroups: [
            {
              pattern: "**/*.css",
              group: "type",
              position: "before",
            },
          ],
          groups: [
            "type",
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
          ],
        },
      ],

      "@typescript-eslint/explicit-member-accessibility": "error",
      "@typescript-eslint/method-signature-style": "error",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-wrapper-object-types": "error",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/triple-slash-reference": "off",
      "@typescript-eslint/unbound-method": "off",

      "react-hooks/exhaustive-deps": "off",
    },
  },
]);
