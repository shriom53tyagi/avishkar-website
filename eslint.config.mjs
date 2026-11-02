import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

// eslint-config-next 15.0.x ships a legacy (eslintrc) config, so it is loaded
// through FlatCompat. Once the project is on a Next version that ships a native
// flat config, this wrapper can be dropped.
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "coverage/**",
      "public/**",
      "reference/**",
      "next-env.d.ts",
    ],
  },

  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Rules carried over from the old .eslintrc.json (see 1.4). Review them: each one
  // is a rule the project had switched off or changed.
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
    },
  },

  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Start as a warning: the site still has raw <img> tags. Promote to "error"
      // once they are converted to next/image.
      "@next/next/no-img-element": "warn",

      // Accessibility rules beyond what eslint-config-next enables.
      // The jsx-a11y plugin is already registered by eslint-config-next.
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/heading-has-content": "error",
      "jsx-a11y/html-has-lang": "error",
      "jsx-a11y/iframe-has-title": "error",
      "jsx-a11y/no-static-element-interactions": "error",
      "jsx-a11y/media-has-caption": "warn",
    },
  },
];

export default config;
