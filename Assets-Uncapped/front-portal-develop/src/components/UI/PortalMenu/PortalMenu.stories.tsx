import { StoryFn, Meta } from "@storybook/react-vite"
import PortalMenu from "./PortalMenu"

export default {
  title: "UI/PortalMenu",
  component: PortalMenu,
} as Meta<typeof PortalMenu>

const Template: StoryFn<typeof PortalMenu> = () => {
  return <PortalMenu />
}

export const Desktop = {
  render: Template,
  args: {},
}
