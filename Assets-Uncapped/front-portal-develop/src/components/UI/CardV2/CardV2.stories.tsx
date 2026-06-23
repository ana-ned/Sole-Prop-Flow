import { HugeiconsIcon } from "@hugeicons/react"
import {
  Activity03SolidRounded,
  BubbleChatSolidRounded,
  SearchCircleSolidRounded,
} from "@hugeicons-pro/core-solid-rounded"
import { CreditCardSolidStandard } from "@hugeicons-pro/core-solid-standard"
import { Meta, StoryObj } from "@storybook/react-vite"
import { BoxIconSeverity } from "../../Basic/BoxIcon/BoxIcon"
import Button from "../../Basic/Button"
import Typography from "../../Basic/Typography"
import CardV2 from "./CardV2"

const availableSeverities = Object.keys(
  BoxIconSeverity
) as (keyof typeof BoxIconSeverity)[]

const meta: Meta<typeof CardV2> = {
  title: "UI/CardV2",
  component: CardV2,
  argTypes: {
    severity: {
      control: { type: "select" },
      options: availableSeverities,
    },
    title: { control: "text" },
    icon: { control: false },
    children: { control: false },
  },
}
export default meta

type Story = StoryObj<typeof CardV2>

export const Default: Story = {
  args: {
    title: "Card Title",
    children: (
      <Typography>
        This is the card content area where you can place any React components.
      </Typography>
    ),
  },
}

export const WithIcon: Story = {
  args: {
    title: "Notification Card",
    icon: <HugeiconsIcon icon={BubbleChatSolidRounded} />,
    severity: "accent-11",
    children: (
      <Typography>
        This card includes an icon with a specific severity color scheme.
      </Typography>
    ),
  },
}

export const ErrorCard: Story = {
  args: {
    title: "Connection Error",
    icon: <HugeiconsIcon icon={Activity03SolidRounded} />,
    severity: "accent-5",
    children: (
      <div className="flex flex-col gap-y-4">
        <Typography>
          There was an issue with your bank connection. Please reconnect to
          continue.
        </Typography>
        <Button type="button" variant="primary">
          Reconnect
        </Button>
      </div>
    ),
  },
}

export const BankVerificationCard: Story = {
  args: {
    title: "Bank Verification Required",
    icon: <HugeiconsIcon icon={CreditCardSolidStandard} />,
    severity: "accent-5",
    children: (
      <div className="flex flex-col gap-y-4">
        <Typography>
          We need to verify your bank account to continue with your application.
        </Typography>
        <div className="bg-error-100 border-error-300 flex items-start gap-3 rounded-md border-1 p-2 text-left">
          <div className="border-error-300 bg-error-200 rounded-lg border-1 p-1">
            <HugeiconsIcon
              icon={CreditCardSolidStandard}
              className="text-error-600 size-8"
            />
          </div>
          <div className="grow">
            <Typography type="smallTitle" color="error-600">
              Missing Bank Connection
            </Typography>
            <Typography type="smallCopy" color="error-600">
              Connect your bank account to proceed
            </Typography>
          </div>
          <Button type="button" variant="primary" className="min-w-[120px]">
            Connect Bank
          </Button>
        </div>
      </div>
    ),
  },
}

export const DataCompletenessCard: Story = {
  args: {
    title: "Data Verification",
    icon: <HugeiconsIcon icon={SearchCircleSolidRounded} />,
    severity: "accent-1",
    children: (
      <div className="flex flex-col gap-y-4">
        <Typography>
          We&apos;re currently reviewing your data to ensure everything is
          complete and accurate.
        </Typography>
        <Typography type="smallCopy">
          This process typically takes 12-24 hours. We&apos;ll notify you once
          it&apos;s complete.
        </Typography>
      </div>
    ),
  },
}

export const SubscriptionCard: Story = {
  args: {
    title: "Stay Updated",
    icon: <HugeiconsIcon icon={BubbleChatSolidRounded} />,
    severity: "accent-11",
    children: (
      <div className="flex flex-col gap-y-4">
        <Typography>
          Subscribe to receive notifications about your application progress.
        </Typography>
        <div className="shadow-light-sm border-card flex items-center gap-3 bg-white p-4">
          <Typography type="smallCopy" className="grow">
            By clicking subscribe, you agree to receive updates via email and
            SMS about your application status.
          </Typography>
          <Button type="button" variant="primary" className="min-w-[150px]">
            Subscribe
          </Button>
        </div>
      </div>
    ),
  },
}

export const AllSeverities = () => {
  return (
    <div className="flex flex-col gap-y-4">
      {availableSeverities.map((severity) => (
        <CardV2
          key={severity}
          title={`${severity} Severity`}
          icon={<HugeiconsIcon icon={BubbleChatSolidRounded} />}
          severity={severity}
        >
          <Typography>
            This card demonstrates the {severity} severity color scheme with an
            icon.
          </Typography>
        </CardV2>
      ))}
    </div>
  )
}

export const WithActions: Story = {
  args: {
    title: "Card with Actions",
    icon: <HugeiconsIcon icon={BubbleChatSolidRounded} />,
    severity: "accent-11",
    actions: (
      <Button type="button" variant="secondary">
        View All
      </Button>
    ),
    children: (
      <Typography>
        This card has an action button in the header area.
      </Typography>
    ),
  },
}

export const WithoutIcon: Story = {
  args: {
    title: "Simple Card",
    children: (
      <div className="flex flex-col gap-y-4">
        <Typography>
          This card doesn&apos;t have an icon, showing the clean layout without
          the BoxIcon component.
        </Typography>
        <Typography type="smallCopy">
          The title area will only show the title text when no icon is provided.
        </Typography>
      </div>
    ),
  },
}

export const ComplexContent: Story = {
  args: {
    title: (
      <span className="flex items-center gap-x-3">
        <div className="flex shrink-0 items-center [&>*+*]:-ml-2">
          <div className="size-6 rounded-full border-1 border-white bg-blue-500" />
          <div className="size-6 rounded-full border-1 border-white bg-green-500" />
          <div className="size-6 rounded-full border-1 border-white bg-red-500" />
        </div>
        Documents Required
      </span>
    ),
    children: (
      <div className="flex flex-col gap-y-4">
        <Typography>
          Please upload the following documents to complete your application:
        </Typography>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <Typography type="smallCopy">
              Business registration certificate
            </Typography>
          </li>
          <li>
            <Typography type="smallCopy">
              Bank statements (last 3 months)
            </Typography>
          </li>
          <li>
            <Typography type="smallCopy">Proof of address</Typography>
          </li>
        </ul>
        <Button type="button" variant="primary">
          Upload Documents
        </Button>
      </div>
    ),
  },
}
