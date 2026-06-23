import { Meta } from "@storybook/react-vite"
import Separator from "./Separator"

export default {
  title: "Basic/Separator",
  component: Separator,
} as Meta<typeof Separator>

export const Default = {
  args: {},
}

export const WithText = {
  args: {
    text: "OR",
  },
}
