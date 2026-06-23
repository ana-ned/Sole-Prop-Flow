import { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import Switcher from "./Switcher"

export default {
  title: "Basic/Switcher",
  component: Switcher,
  args: {
    values: [
      { value: "BUSINESS", label: "Company" },
      { value: "INDIVIDUAL", label: "Individual" },
    ],
    onChange: fn(),
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-4">
        <Story />
      </div>
    ),
  ],
} as Meta<typeof Switcher>

type Story = StoryObj<typeof Switcher>

export const Sandbox: Story = {}

export const Examples: Story = {
  render: (args) => (
    <>
      <Switcher
        {...args}
        values={[
          { value: "BUSINESS", label: "Company" },
          { value: "INDIVIDUAL", label: "Individual" },
        ]}
      />
      <Switcher
        {...args}
        values={[
          { value: "BUSINESS", label: "Company" },
          { value: "INDIVIDUAL", label: "Individual" },
          { value: "Other", label: "Other" },
        ]}
      />
    </>
  ),
}
