import { HugeiconsIcon } from "@hugeicons/react"
import { StarsSolidRounded } from "@hugeicons-pro/core-solid-rounded"
import { Meta, StoryObj } from "@storybook/react-vite"
import Notice from "./Notice"

export default {
  title: "UI/Notice",
  component: Notice,
  decorators: [
    (Story) => (
      <div className="flex max-w-2xl flex-col gap-4">
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Missing bank detection",
    children:
      "Speed up your application by connecting all your business banks now. We automatically detect banks that haven't been connected during underwriting.",
    variant: "warning",
    icon: <HugeiconsIcon icon={StarsSolidRounded} />,
  },
} as Meta<typeof Notice>

type Story = StoryObj<typeof Notice>

export const Sandbox: Story = {
  args: {
    title: "Missing bank detection",
    children:
      "Speed up your application by connecting all your business banks now. We automatically detect banks that haven't been connected during underwriting.",
  },
}

export const AllVariants: Story = {
  render: () => (
    <>
      <Notice
        variant="warning"
        title="Missing bank detection"
        icon={<HugeiconsIcon icon={StarsSolidRounded} />}
      >
        Speed up your application by connecting all your business banks now. We
        automatically detect banks that haven&apos;t been connected during
        underwriting.
      </Notice>
      <Notice
        variant="danger"
        title="Connection Error"
        icon={<HugeiconsIcon icon={StarsSolidRounded} />}
      >
        Unable to connect to your bank account. Please check your credentials
        and try again.
      </Notice>
    </>
  ),
}

export const LongContent: Story = {
  args: {
    title: "Important Update Required",
    children:
      "We've detected that your account needs additional verification. This is a routine security measure to protect your account and ensure compliance with financial regulations. Please complete the verification process within the next 7 days to avoid any interruption to your service. If you have any questions or concerns, please contact our support team who will be happy to assist you.",
  },
}

export const ShortContent: Story = {
  args: {
    title: "Action Required",
    children: "Please review and confirm.",
  },
}

export const WithoutTitle: Story = {
  args: {
    title: undefined,
    children:
      "This is a notice without a title. It only displays the message content.",
  },
}

export const WithAction: Story = {
  args: {
    variant: "info",
    title: undefined,
    icon: undefined,
    children: "$23,909.06 transferred from Goldman Sachs Bank USA",
    action: <button className="btn-secondary">View</button>,
  },
}

export const WithIconAndAction: Story = {
  args: {
    variant: "warning",
    title: "Missing bank detection",
    icon: <HugeiconsIcon icon={StarsSolidRounded} />,
    children:
      "Speed up your application by connecting all your business banks now.",
    action: <button className="btn-secondary">Connect</button>,
  },
}

export const WithoutIcon: Story = {
  args: {
    variant: "info",
    title: "Information",
    icon: undefined,
    children: "This notice has no icon, only text content.",
  },
}
