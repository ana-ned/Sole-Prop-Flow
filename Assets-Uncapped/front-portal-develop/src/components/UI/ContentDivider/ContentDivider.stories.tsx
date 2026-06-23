import { StoryFn, Meta } from "@storybook/react-vite"
import ContentDivider from "./ContentDivider"

export default {
  title: "UI/ContentDivider",
  component: ContentDivider,
} as Meta<typeof ContentDivider>

const Template: StoryFn<typeof ContentDivider> = () => {
  return (
    <ContentDivider>
      <p>Some Content here</p>
    </ContentDivider>
  )
}

export const Default = {
  render: Template,
}
