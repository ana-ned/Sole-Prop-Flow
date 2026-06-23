import { Meta, StoryObj } from "@storybook/react-vite"
import PartnerRegistrationSidebar from "../../../domains/partner-registration/components/PartnerRegistrationSidebar"
import RegistrationLayout from "../../../domains/registration/components/RegistrationLayout"
import { RegistrationInvitationInfoResponseSourceEnum } from "../../../services/api/organisation-users"
import EligibilityOneSidebar from "./variants/EligibilityOneSidebar"
import EligibilityOneVariantSidebar from "./variants/EligibilityOneVariantSidebar"
import EligibilityTwoSidebar from "./variants/EligibilityTwoSidebar"
import EligibilityTwoVariantSidebar from "./variants/EligibilityTwoVariantSidebar"
import GallerySidebar from "./variants/GallerySidebar"
import PartnerInvitationSidebar from "./variants/PartnerInvitationSidebar"
import QuoteSidebar from "./variants/QuoteSidebar"
import ReadyForFundingSidebarExperiment from "./variants/ReadyForFundingSidebarExperiment"

export default {
  title: "Collections/RegistrationSidebars",
  component: RegistrationLayout,
  decorators: [
    (Story) => (
      <div className="flex min-h-screen">
        <Story />
      </div>
    ),
  ],
  args: {
    children: "Page Content",
  },
} satisfies Meta<typeof RegistrationLayout>

type Story = StoryObj<typeof RegistrationLayout>

export const Registration: Story = {
  render: (args) => (
    <RegistrationLayout sidebar={<GallerySidebar />}>
      {args.children}
    </RegistrationLayout>
  ),
}

export const EligibilityOne: Story = {
  render: (args) => (
    <RegistrationLayout sidebar={<EligibilityOneSidebar />}>
      {args.children}
    </RegistrationLayout>
  ),
}

export const EligibilityTwo: Story = {
  render: (args) => (
    <RegistrationLayout sidebar={<EligibilityTwoSidebar smallTier={false} />}>
      {args.children}
    </RegistrationLayout>
  ),
}

export const EligibilityTwoSmallTier: Story = {
  render: (args) => (
    <RegistrationLayout sidebar={<EligibilityTwoSidebar smallTier />}>
      {args.children}
    </RegistrationLayout>
  ),
}

export const Invitation: Story = {
  render: (args) => (
    <RegistrationLayout sidebar={<QuoteSidebar />}>
      {args.children}
    </RegistrationLayout>
  ),
}

export const Partner: Story = {
  render: (args) => (
    <RegistrationLayout sidebar={<PartnerRegistrationSidebar />}>
      {args.children}
    </RegistrationLayout>
  ),
}

export const MarcusInvitation: Story = {
  render: (args) => (
    <RegistrationLayout
      sidebar={
        <PartnerInvitationSidebar
          source={RegistrationInvitationInfoResponseSourceEnum.Marcus}
        />
      }
    >
      {args.children}
    </RegistrationLayout>
  ),
}

export const SellersfiInvitation: Story = {
  render: (args) => (
    <RegistrationLayout
      sidebar={
        <PartnerInvitationSidebar
          source={RegistrationInvitationInfoResponseSourceEnum.Sellersfi}
        />
      }
    >
      {args.children}
    </RegistrationLayout>
  ),
}

export const EligibilityOneVariant: Story = {
  render: (args) => (
    <RegistrationLayout sidebar={<EligibilityOneVariantSidebar />}>
      {args.children}
    </RegistrationLayout>
  ),
}

export const EligibilityTwoVariant: Story = {
  render: (args) => (
    <RegistrationLayout
      sidebar={<EligibilityTwoVariantSidebar amount={50000} currency="GBP" />}
    >
      {args.children}
    </RegistrationLayout>
  ),
}

export const EligibilityTwoVariantBelowExpectations: Story = {
  render: (args) => (
    <RegistrationLayout
      sidebar={
        <EligibilityTwoVariantSidebar
          amount={50000}
          currency="GBP"
          belowExpectations
        />
      }
    >
      {args.children}
    </RegistrationLayout>
  ),
}

export const ReadyForFundingExperiment: Story = {
  render: (args) => (
    <RegistrationLayout
      sidebar={
        <ReadyForFundingSidebarExperiment amount={150000} currency="USD" />
      }
    >
      {args.children}
    </RegistrationLayout>
  ),
}
