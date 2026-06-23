import { Meta, StoryObj } from "@storybook/react-vite"
import { Link } from "react-router"
import { fn } from "storybook/test"
import Button from "../../Basic/Button"
import Alert from "./Alert"

export default {
  title: "Basic/Alert",
  component: Alert,
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-4">
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Alert Title",
    children: (
      <div>
        Funding account transactions are in the
        <Link to="/funding"> funding dashboard</Link>. <br />
        We&apos;ll move them here soon.
      </div>
    ),
    button: (
      <Button type="button" onClick={fn()}>
        View
      </Button>
    ),
  },
} as Meta<typeof Alert>

type Story = StoryObj<typeof Alert>

const ALERT_VARIANTS = [
  "normal",
  "danger",
  "info",
  "warning",
  "success",
  "waiting",
] as const

const ALERT_LAYOUTS = ["vertical", "horizontal"] as const

export const Sandbox: Story = {
  args: {
    title: "Alert Title",
    children: (
      <div>
        Funding account transactions are in the
        <Link to="/funding"> funding dashboard</Link>. <br />
        We&apos;ll move them here soon.
      </div>
    ),
    button: (
      <Button type="button" onClick={fn()}>
        View
      </Button>
    ),
  },
}

export const Variants: Story = {
  render: (args) => (
    <>
      {ALERT_VARIANTS.map((variant) => (
        <Alert
          key={variant}
          {...args}
          title={`Alert ${variant}`}
          type={variant}
        />
      ))}
    </>
  ),
}

export const Layouts: Story = {
  render: (args) => (
    <>
      {ALERT_LAYOUTS.map((layout) => (
        <Alert
          key={layout}
          {...args}
          title={`Alert ${layout}`}
          layout={layout}
        />
      ))}
    </>
  ),
}

export const Icon: Story = {
  render: (args) => (
    <>
      {ALERT_LAYOUTS.map((layout) => (
        <>
          <Alert
            {...args}
            title={`Alert ${layout} with icon`}
            layout={layout}
          />
          <Alert
            {...args}
            title={`Alert ${layout} without icon`}
            layout={layout}
            showIcon={false}
          />
          <Alert {...args} title={undefined} layout={layout} />
        </>
      ))}
    </>
  ),
}

export const Title: Story = {
  render: (args) => (
    <>
      {ALERT_LAYOUTS.map((layout) => (
        <>
          <Alert {...args} title="Alert with title and icon" layout={layout} />
          <Alert
            {...args}
            title="Alert with title without icon"
            layout={layout}
            showIcon={false}
          />
          <Alert {...args} title={undefined} layout={layout} />
          <Alert {...args} title={undefined} layout={layout} showIcon={false} />
        </>
      ))}
    </>
  ),
}
