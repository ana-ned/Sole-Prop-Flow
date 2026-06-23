import { StoryFn, Meta } from "@storybook/react-vite"
import Tabs from "./Tabs"

export default {
  title: "UI/Tabs",
  component: Tabs,
} as Meta<typeof Tabs>

const Template: StoryFn<typeof Tabs> = (args) => {
  return <Tabs {...args} />
}

export const TwoRows = {
  render: Template,

  args: {
    titles: ["Company", "Individual"],
    children: [
      <h1 key="company">Company</h1>,
      <h1 key="individual">Individual</h1>,
    ],
  },
}

export const ThreeRows = {
  render: Template,

  args: {
    titles: ["Company", "Team", "Individual"],
    children: [
      <h1 key="company">Company</h1>,
      <h1 key="team">Team</h1>,
      <h1 key="individual">Individual</h1>,
    ],
  },
}
