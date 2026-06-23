import { Meta, StoryObj } from "@storybook/react-vite"
import Typography from "../../Basic/Typography"
import ListItemLarge from "../../UI/ListItemLarge"
import ListItemContainer from "./ListItemContainer"

const SIZES = ["sm", "md"] as const

export default {
  title: "Collections/ListItemContainer",
  component: ListItemContainer,
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-4">
        <Story />
      </div>
    ),
  ],
  args: {
    children: (
      <>
        <ListItemLarge title="List Item 1" />
        <ListItemLarge title="List Item 2" />
        <ListItemLarge title="List Item 3" />
      </>
    ),
  },
} as Meta<typeof ListItemContainer>

type Story = StoryObj<typeof ListItemContainer>

export const Sandbox: Story = {}

export const Sizes: Story = {
  render: (args) => (
    <>
      {SIZES.map((size) => (
        <>
          <Typography>{size}</Typography>
          <ListItemContainer size={size} {...args} />
        </>
      ))}
    </>
  ),
}
