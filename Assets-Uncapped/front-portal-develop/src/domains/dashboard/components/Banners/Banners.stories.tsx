import { UserListSolidRounded } from "@hugeicons-pro/core-solid-rounded"
import { CreditCardSolidStandard } from "@hugeicons-pro/core-solid-standard"
import { Meta, StoryObj } from "@storybook/react-vite"
import { addDays } from "date-fns"
import { fn } from "storybook/test"
import { OfferResponseOfferTypeEnum } from "../../../../services/api/agreements"
import { CustomerFacingDealDetailsResponseTierEnum } from "../../../../services/api/hubspot"
import {
  MissingDocumentResponseConnectionTypeEnum,
  MissingDocumentResponseRequestTypeEnum,
} from "../../../../services/api/organisation-users"
import FixedOffer from "../../../onboarding/components/offers/mocks/FixedOffer.mock"
import SelectedOffer from "../../../onboarding/components/offers/mocks/SelectedOffer.mock"
import AmazonConsentBanner from "./AmazonConsentBanner"
import ApplyFromPartnershipBanner from "./ApplyFromPartnershipBanner"
import AwaitingActivationBanner from "./AwaitingActivationBanner"
import ContinueOnboardingBanner from "./ContinueOnboardingBanner"
import EligibleMissingDataBanner from "./EligibleMissingDataBanner"
import MissingDataBanner from "./MissingDataBanner"
import MissingMonthlyFinancialDataBanner from "./MissingMonthlyFinancialDataBanner"
import OfferAvailableBanner from "./OfferAvailableBanner"
import RejectedBanner from "./RejectedBanner"
import TopUpBanner from "./TopUpBanner"
import WelcomeBanner from "./WelcomeBanner"

// Mock data for MissingDocumentResponse[]
const mockMissingDocuments = [
  {
    documentType: "BANK_STATEMENT",
    title: "Bank Statement",
    subtitle: "Latest 3 months",
    description:
      "Please upload your latest 3 months bank statements to verify your banking activity.",
    allowedFileFormats: ["PDF", "JPG", "PNG"],
    instructions: [
      "Download statements from your online banking",
      "Ensure all pages are included",
      "File must be clear and readable",
    ],
    exampleDocumentUrl: "https://example.com/bank-statement-example.pdf",
    connectionType: MissingDocumentResponseConnectionTypeEnum.Banking,
    requestType: MissingDocumentResponseRequestTypeEnum.LineOfCredit,
    externalId: "doc-bank-001",
    isOptional: false,
    lastModificationDate: new Date("2024-01-20T09:00:00Z"),
    documentRequestId: "req-001",
  },
]

// Mock data for MissingDataCheck[]
const mockMissingDataChecks = [
  {
    type: "soft_credit" as const,
    url: "#",
    icon: UserListSolidRounded,
  },
  {
    type: "bank_missing" as const,
    url: "#",
    icon: CreditCardSolidStandard,
  },
  {
    type: "bank_error" as const,
    url: "#",
    icon: CreditCardSolidStandard,
  },
  {
    type: "amazon_missing" as const,
    url: "#",
    icon: CreditCardSolidStandard,
  },
  {
    type: "amazon_error" as const,
    url: "#",
    icon: CreditCardSolidStandard,
  },
  {
    type: "sales_missing" as const,
    url: "#",
    icon: CreditCardSolidStandard,
  },
  {
    type: "sales_error" as const,
    url: "#",
    icon: CreditCardSolidStandard,
  },
]

// Mock mutation object for banners that require it
const mockMutation: any = {
  mutate: fn(),
  isPending: false,
  // Add other fields if needed
}

const meta: Meta = {
  title: "Domains/Dashboard/Banners",
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

export const MissingData: Story = {
  render: () => <MissingDataBanner checks={mockMissingDataChecks} />,
}

export const EligibleMissingData: Story = {
  render: () => (
    <EligibleMissingDataBanner
      amount={100000}
      currency="GBP"
      checks={mockMissingDataChecks}
    />
  ),
}

export const MissingMonthlyFinancialData: Story = {
  render: () => (
    <MissingMonthlyFinancialDataBanner documents={mockMissingDocuments} />
  ),
}

export const ContinueOnboardingPreOffer: Story = {
  render: () => (
    <ContinueOnboardingBanner
      variant="pre-offer"
      amount={50000}
      currency="GBP"
    />
  ),
}

export const ContinueOnboardingPostOffer: Story = {
  render: () => (
    <ContinueOnboardingBanner
      variant="post-offer"
      amount={75000}
      currency="GBP"
    />
  ),
}

export const AwaitingActivation: Story = {
  render: () => <AwaitingActivationBanner />,
}

export const AmazonConsent: Story = {
  render: () => <AmazonConsentBanner offer={FixedOffer} />,
}

export const ApplyFromPartnership: Story = {
  render: () => (
    <ApplyFromPartnershipBanner
      amount={100000}
      currency="GBP"
      mutation={mockMutation}
    />
  ),
}

export const RejectedNoReapply: Story = {
  render: () => (
    <RejectedBanner reason="Your application was rejected due to missing documents." />
  ),
}

export const RejectedWithReapply: Story = {
  render: () => (
    <RejectedBanner
      reason="Your application was rejected due to missing documents."
      reapplyDate={addDays(new Date(), 7)}
    />
  ),
}

export const OfferAvailable: Story = {
  render: () => <OfferAvailableBanner offers={[SelectedOffer, FixedOffer]} />,
}

export const DailyPayoutOffer: Story = {
  render: () => (
    <OfferAvailableBanner
      offers={[
        {
          ...FixedOffer,
          offerType: OfferResponseOfferTypeEnum.DailyPayout,
        },
      ]}
    />
  ),
}

export const TopUpSmallTier: Story = {
  render: () => (
    <TopUpBanner
      amount={20000}
      currency="GBP"
      tier={CustomerFacingDealDetailsResponseTierEnum.Small}
      onSubmit={fn}
      isPending={false}
    />
  ),
}

export const TopUpBigTier: Story = {
  render: () => (
    <TopUpBanner
      amount={50000}
      currency="GBP"
      tier={CustomerFacingDealDetailsResponseTierEnum.Big}
      onSubmit={fn}
      isPending={false}
    />
  ),
}

export const Welcome: Story = {
  render: () => <WelcomeBanner />,
}
