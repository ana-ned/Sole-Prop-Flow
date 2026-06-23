import { Meta, StoryObj } from "@storybook/react-vite"
import Loader from "./Loader"

const LOADER_SIZES = ["xxs", "xs", "sm", "md", "lg", "xl"] as const

export default {
  title: "Basic/Loader",
  component: Loader,
  decorators: [
    (Story) => (
      <div className="flex gap-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Loader>

type Story = StoryObj<typeof Loader>

export const Sandbox: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <>
      {LOADER_SIZES.map((size) => (
        <Loader key={size} size={size} {...args} />
      ))}
    </>
  ),
}
