import type { Meta, StoryObj } from "@storybook/react-vite"
import Typography from "../../../components/Basic/Typography"
import MainBanner from "./MainBanner"

const meta: Meta<typeof MainBanner> = {
  title: "UI/MainBanner",
  component: MainBanner,
  decorators: [
    (Story) => (
      <div className="mx-auto my-2 w-full max-w-200">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    theme: {
      control: { type: "select" },
      options: ["default", "dark"],
    },
  },
}

export default meta
type Story = StoryObj<typeof MainBanner>

export const Default: Story = {
  render: () => (
    <MainBanner
      title={
        <div>
          <Typography type="h4" color="white" className="mb-2">
            Application Status
          </Typography>
          <Typography color="white">
            Your application is currently being reviewed.
          </Typography>
        </div>
      }
    >
      <Typography type="body">
        We&apos;ll notify you once the review is complete. This usually takes
        2-3 business days.
      </Typography>
    </MainBanner>
  ),
}

export const Dark: Story = {
  render: () => (
    <MainBanner
      title={
        <div>
          <Typography type="h4" color="white" className="mb-2">
            Welcome to your dashboard
          </Typography>
          <Typography color="white">
            Start your journey with our financial solutions designed for your
            business growth.
          </Typography>
        </div>
      }
      theme="dark"
    >
      <div className="bg-surface-elevated-1 shadow-light-sm border-card rounded-card-md p-2">
        <div className="rounded-card-md flex flex-col gap-2 bg-white p-2">
          <Typography type="body">
            We&apos;ll notify you once the review is complete. This usually
            takes 2-3 business days.
          </Typography>
          <Typography type="body">
            We&apos;ll notify you once the review is complete. This usually
            takes 2-3 business days.
          </Typography>
          <Typography type="body">
            We&apos;ll notify you once the review is complete. This usually
            takes 2-3 business days.
          </Typography>
        </div>
      </div>
    </MainBanner>
  ),
}
