import { Meta } from "@storybook/react-vite"
import SanitizedHtml from "./SanitizedHtml"

export default {
  title: "Basic/SanitizedHtml",
  component: SanitizedHtml,
} as Meta<typeof SanitizedHtml>

export const Default = {
  args: {
    content: '<a href="#">test html</a>',
  },
}
