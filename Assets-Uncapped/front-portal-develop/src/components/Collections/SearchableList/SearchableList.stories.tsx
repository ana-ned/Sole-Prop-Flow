import { Meta, StoryObj } from "@storybook/react-vite"
import { fn } from "storybook/test"
import countries from "../../../models/countries"
import { PREFERRED_COUNTRY_ORDER } from "../../../services/country"
import SearchableList from "./SearchableList"

export default {
  title: "Collections/SearchableList",
  component: SearchableList,
  args: {
    onClick: fn(),
    items: countries.map((item) => ({
      id: item["alpha-3"],
      label: item.name,
      icon: item.flag,
    })),
  },
} as Meta<typeof SearchableList>

type Story = StoryObj<typeof SearchableList>

export const Sandbox: Story = {}

export const Ungrouped: Story = {
  args: {
    grouped: false,
  },
}

export const FrequentlySelected: Story = {
  args: {
    frequentlySelectedIds: PREFERRED_COUNTRY_ORDER,
  },
}
