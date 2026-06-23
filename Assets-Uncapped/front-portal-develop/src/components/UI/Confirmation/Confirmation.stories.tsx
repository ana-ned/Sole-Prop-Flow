import { StoryFn, Meta } from "@storybook/react-vite"
import Button from "../../Basic/Button"
import Confirmation from "./Confirmation"

export default {
  title: "UI/Confirmation",
  component: Confirmation,
} as Meta<typeof Confirmation>

const Template: StoryFn<typeof Confirmation> = (args) => {
  return <Confirmation {...args} />
}

export const Success = {
  render: Template,

  args: {
    title: "Payment confirmed",
    subtitle: "This will be sent on Monday 1st June 2021",
    type: "success",
    children: <Button href="/">Continue</Button>,
  },
}

export const Danger = {
  render: Template,

  args: {
    title: "Bill deleted",
    type: "danger",
    children: <Button href="/">Continue</Button>,
  },
}

export const Warning = {
  render: Template,

  args: {
    title: "Are you sure you want to delete bill?",
    type: "warning",
    children: (
      <>
        <Button
          type="button"
          onClick={() => {
            alert("Confirmed")
          }}
        >
          Yes, delete invoice
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            alert("Cancelled")
          }}
        >
          No, take me back
        </Button>
      </>
    ),
  },
}
