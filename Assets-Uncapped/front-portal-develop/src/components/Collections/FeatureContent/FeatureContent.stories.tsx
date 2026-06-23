import { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import CheckedImg from "../../../svgs/illustrations/confirmed.svg"
import Button from "../../Basic/Button"
import FeatureContent from "./FeatureContent"

const SIZES = ["small", "large"] as const

export default {
  title: "Collections/FeatureContent",
  component: FeatureContent,
  args: {
    img: CheckedImg,
    title: "Title",
    content: <p>Some copy text</p>,
    footerContent: (
      <Button type="button" variant="secondary" onClick={fn()}>
        Click Me
      </Button>
    ),
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-4">
        <Story />
      </div>
    ),
  ],
} as Meta<typeof FeatureContent>

type Story = StoryObj<typeof FeatureContent>

export const Sandbox: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <>
      {SIZES.map((size) => (
        <FeatureContent
          key={size}
          {...args}
          size={size}
          title={`${args.title} (${size})`}
        />
      ))}
    </>
  ),
}
