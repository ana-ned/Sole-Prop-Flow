import { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  stories: ["../src/**/*.@(mdx|stories.@(js|jsx|mjs|ts|tsx))"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-themes",
  ],
  framework: "@storybook/react-vite",
  staticDirs: ["../public"],

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
}

export default config
