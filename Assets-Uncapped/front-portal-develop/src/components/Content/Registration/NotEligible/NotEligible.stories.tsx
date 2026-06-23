import { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import { RegisterOrganisationResponseNotEligibleReasonEnum } from "../../../../services/api/organisation-users"
import NotEligible from "./NotEligible"

export default {
  title: "Content/Registration/NotEligible",
  component: NotEligible,
  args: {
    onReapply: fn(),
    requiredRevenue: 10000,
    requiredCurrency: "USD",
  },
} satisfies Meta<typeof NotEligible>

type Story = StoryObj<typeof NotEligible>

export const LowRevenue: Story = {
  render: (args) => (
    <NotEligible
      {...args}
      reason={RegisterOrganisationResponseNotEligibleReasonEnum.LowRevenue}
    />
  ),
}

export const SoleTrader: Story = {
  render: (args) => (
    <NotEligible
      {...args}
      reason={RegisterOrganisationResponseNotEligibleReasonEnum.SoleTrader}
    />
  ),
}

export const UnsupportedBusinessType: Story = {
  render: (args) => (
    <NotEligible
      {...args}
      reason={
        RegisterOrganisationResponseNotEligibleReasonEnum.UnsupportedBusinessType
      }
    />
  ),
}

export const UnsupportedCanadaProvince: Story = {
  render: (args) => (
    <NotEligible
      {...args}
      reason={
        RegisterOrganisationResponseNotEligibleReasonEnum.UnsupportedCanadaProvince
      }
    />
  ),
}

export const UnsupportedUsState: Story = {
  render: (args) => (
    <NotEligible
      {...args}
      reason={
        RegisterOrganisationResponseNotEligibleReasonEnum.UnsupportedUsState
      }
    />
  ),
}

export const UnsupportedCountry: Story = {
  render: (args) => (
    <NotEligible
      {...args}
      reason={
        RegisterOrganisationResponseNotEligibleReasonEnum.UnsupportedCountry
      }
    />
  ),
}
