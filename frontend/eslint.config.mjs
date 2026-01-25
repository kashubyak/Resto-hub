import { FlatCompat } from "@eslint/eslintrc";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "react-hooks/exhaustive-deps": "error",
      "react/no-unescaped-entities": "error",
      "react/jsx-key": "error",
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          trailingComma: "all",
          tabWidth: 2,
          useTabs: true,
          semi: false,
          bracketSpacing: true,
        },
      ],
      "object-curly-spacing": "off",
      "@typescript-eslint/object-curly-spacing": "off",
      "@stylistic/object-curly-spacing": "off",
      "bracket-spacing": "off",
      "@typescript-eslint/bracket-spacing": "off",
    },
    plugins: {
      prettier: prettierPlugin,
    },
  },
  prettierConfig,
];

export default eslintConfig;
