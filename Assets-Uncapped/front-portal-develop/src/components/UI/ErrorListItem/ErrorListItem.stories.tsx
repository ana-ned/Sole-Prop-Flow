import { HugeiconsIcon } from "@hugeicons/react"
import {
  CreditCardSolidStandard,
  AlertCircleSolidStandard,
  InformationCircleSolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import Button from "../../Basic/Button"
import { ErrorListItem } from "./ErrorListItem"

export default {
  title: "UI/ErrorListItem",
  component: ErrorListItem,
  decorators: [
    (Story) => (
      <div className="flex max-w-2xl flex-col gap-4">
        <Story />
      </div>
    ),
  ],
  args: {
    icon: <HugeiconsIcon icon={AlertCircleSolidStandard} />,
    title: "Error Title",
  },
} satisfies Meta<typeof ErrorListItem>

type Story = StoryObj<typeof ErrorListItem>

export const Sandbox: Story = {}

export const Default: Story = {
  args: {
    icon: <HugeiconsIcon icon={AlertCircleSolidStandard} />,
    title: "Something went wrong",
  },
}

export const WithSubtitle: Story = {
  args: {
    icon: <HugeiconsIcon icon={AlertCircleSolidStandard} />,
    title: "Missing bank accounts",
    subtitle: "**** 1234, **** 5678",
  },
}

export const WithButton: Story = {
  args: {
    icon: <HugeiconsIcon icon={CreditCardSolidStandard} />,
    title: "Missing bank accounts",
    subtitle: "**** 1234, **** 5678",
    button: (
      <Button type="button" onClick={fn()}>
        Connect Account
      </Button>
    ),
  },
}

export const WithoutIconWrapper: Story = {
  args: {
    icon: <HugeiconsIcon icon={AlertCircleSolidStandard} className="size-10" />,
    iconWrapped: false,
    title: "Custom icon without wrapper",
    subtitle: "The icon is displayed without the background wrapper",
    button: (
      <Button type="button" onClick={fn()}>
        Resolve
      </Button>
    ),
  },
}

export const LongContent: Story = {
  args: {
    icon: <HugeiconsIcon icon={InformationCircleSolidStandard} />,
    title:
      "This is a very long error title that might wrap to multiple lines on smaller screens",
    subtitle:
      "This is a detailed subtitle with additional information about the error that occurred. It can contain multiple lines of text to help the user understand what went wrong.",
    button: (
      <Button type="button" onClick={fn()}>
        Fix Issue
      </Button>
    ),
  },
}

export const MultipleErrors: Story = {
  render: () => (
    <>
      <ErrorListItem
        icon={<HugeiconsIcon icon={CreditCardSolidStandard} />}
        title="Missing bank accounts"
        subtitle="**** 1234, **** 5678"
        button={
          <Button type="button" onClick={fn()}>
            Connect Account
          </Button>
        }
      />
      <ErrorListItem
        icon={<HugeiconsIcon icon={AlertCircleSolidStandard} />}
        title="Verification failed"
        subtitle="Please review your information and try again"
        button={
          <Button type="button" onClick={fn()}>
            Retry
          </Button>
        }
      />
      <ErrorListItem
        icon={<HugeiconsIcon icon={InformationCircleSolidStandard} />}
        title="Additional information required"
        button={
          <Button type="button" onClick={fn()}>
            Provide Info
          </Button>
        }
      />
    </>
  ),
}
