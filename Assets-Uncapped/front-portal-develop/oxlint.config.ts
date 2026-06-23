import { defineConfig } from "oxlint"

export default defineConfig({
  plugins: ["react", "typescript", "unicorn", "jsx-a11y", "import"],
  categories: {
    correctness: "error",
    suspicious: "warn",
    perf: "warn",
    pedantic: "off",
    style: "off",
    restriction: "off",
    nursery: "off",
  },
  rules: {
    "typescript/no-non-null-asserted-optional-chain": "off",
    "unicorn/no-thenable": "off", // yup schema uses .then() in conditional configs
    "react/react-in-jsx-scope": "off",
    "react-hooks/exhaustive-deps": "warn",
    "jsx-a11y/prefer-tag-over-role": "warn",
    "import/no-cycle": "error",
    "import/no-self-import": "error",
    "import/no-duplicates": "error",
    "import/no-named-as-default": "off",
    "import/no-named-as-default-member": "off",
    "import/no-unassigned-import": "off",
  },
  ignorePatterns: ["src/services/api/**"],
  settings: {
    react: {
      version: "19",
    },
    "jsx-a11y": {
      polymorphicPropName: "as",
    },
  },
})
