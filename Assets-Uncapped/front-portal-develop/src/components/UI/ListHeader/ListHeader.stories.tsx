import { StoryFn, Meta } from "@storybook/react-vite"
import ListHeader from "./ListHeader"

export default {
  title: "UI/ListHeader",
  component: ListHeader,
} as Meta<typeof ListHeader>

const Template: StoryFn<typeof ListHeader> = (args) => {
  return <ListHeader {...args} />
}

export const Default = {
  render: Template,

  args: {
    title: "List Title",
    more: {
      to: "/",
    },
  },
}

export const CustomLinkLabel = {
  render: Template,

  args: {
    title: "List Title",
    more: {
      to: "/",
      label: "See all",
    },
  },
}

export const NoLink = {
  render: Template,

  args: {
    title: "List Title",
  },
}
