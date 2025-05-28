import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true, // Enable JSX parsing
        },
      },
    },
    extends: [js.configs.recommended], // Use correct path for recommended config
  },
  {
    files: ["**/*.jsx"],
    plugins: {
      react: pluginReact,
    },
    extends: [
      pluginReact.configs.flat.recommended,
      pluginReact.configs.flat["jsx-runtime"], // Support new JSX Transform
    ],
    settings: {
      react: {
        version: "detect", // Auto-detect React version
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off", // Disable the react-in-jsx-scope rule
    },
  },
]);