import { Meta, StoryObj } from "@storybook/react-vite"
import { RepaymentsFrequencyEnum } from "../../../../services/api/agreements/models/Repayments"
import LateFeesAlert from "./LateFeesAlert"
import LocMissingDocuments from "./LocMissingDocuments"
import RepaymentPhaseAlert from "./RepaymentPhaseAlert"
import SellersfiNotice from "./SellersfiNotice"

const meta: Meta = {
  title: "Domains/Dashboard/Notifications",
  decorators: [
    (Story) => (
      <div className="mx-auto my-2 w-full max-w-200">
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<any>

export const NotificationLateFeesAlert: Story = {
  render: () => <LateFeesAlert />,
}

export const NotificationRepaymentPhaseAlert: Story = {
  render: () => (
    <RepaymentPhaseAlert
      data={{
        activeAgreement: {
          repayments: { frequency: RepaymentsFrequencyEnum.Monthly },
        },
        firstRepaymentPhase: {
          scheduledDate: new Date("2025-08-15"),
        },
        futureRepayment: {
          scheduledDate: new Date("2025-09-15"),
        },
        difference: 30,
        partnershipName: "Example Partnership",
        faqUrl: "https://example.com/faq",
      }}
    />
  ),
}

export const NotificationSellersFiNotice: Story = {
  render: () => <SellersfiNotice />,
}

export const NotificationLocMissingDocuments: Story = {
  render: () => <LocMissingDocuments />,
}
