import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Your custom rules
    rules: {
      "react/no-unescaped-entities": "off", // Disable the unescaped entities rule
      // You can add other custom rules here
    }
  }
];

export default eslintConfig;