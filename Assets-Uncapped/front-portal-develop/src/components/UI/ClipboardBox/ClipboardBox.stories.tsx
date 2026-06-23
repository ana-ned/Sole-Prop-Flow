import { StoryFn, Meta } from "@storybook/react-vite"
import ClipboardBox from "./ClipboardBox"

export default {
  title: "UI/ClipboardBox",
  component: ClipboardBox,
} as Meta<typeof ClipboardBox>

const Template: StoryFn<typeof ClipboardBox> = (args) => {
  return <ClipboardBox {...args} />
}

export const Default = {
  render: Template,

  args: {
    title: "Some Title",
    value: "Some Value to copy",
  },
}
