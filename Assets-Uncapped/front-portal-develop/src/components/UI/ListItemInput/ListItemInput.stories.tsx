import { StoryFn, Meta } from "@storybook/react-vite"
import { ReactComponent as SettingsIcon } from "../../../svgs/settings.svg"
import ListItemInput from "./ListItemInput"

export default {
  title: "UI/ListItemInput",
  component: ListItemInput,
} as Meta<typeof ListItemInput>

const Template: StoryFn<typeof ListItemInput> = (args) => {
  return <ListItemInput {...args} />
}

export const Radio = {
  render: Template,

  args: {
    type: "radio",
    title: "Title",
    subtitle: "sub-title",
    icon: <SettingsIcon />,
  },
}

export const Checkbox = {
  render: Template,

  args: {
    type: "normal",
    title: "Title",
    subtitle: "sub-title",
    icon: <SettingsIcon />,
  },
}

export const Switch = {
  render: Template,

  args: {
    type: "switch",
    title: "Title",
    subtitle: "sub-title",
    icon: <SettingsIcon />,
  },
}

export const WithoutSubtitle = {
  render: Template,

  args: {
    type: "switch",
    title: "Title",
    icon: <SettingsIcon />,
  },
}

export const WithoutIcon = {
  render: Template,

  args: {
    type: "switch",
    title: "Title",
  },
}

export const WithCustomColor = {
  render: Template,

  args: {
    type: "switch",
    title: "Title",
    icon: <SettingsIcon />,
    backgroundColor: "#C9BBE0",
    color: "#063844",
  },
}

export const Selected = {
  render: Template,

  args: {
    type: "switch",
    title: "Title",
    icon: <SettingsIcon />,
    checked: true,
  },
}
