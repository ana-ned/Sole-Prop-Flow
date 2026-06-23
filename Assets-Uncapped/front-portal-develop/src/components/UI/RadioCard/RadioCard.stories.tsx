import { useState } from "react"
import { Meta, StoryObj } from "@storybook/react-vite"
import RadioCard from "./RadioCard"
import RadioCardGroup from "./RadioCardGroup"

export default {
  title: "UI/RadioCard",
  component: RadioCard,
  decorators: [
    (Story) => (
      <div style={{ margin: "0 auto", maxWidth: "600px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RadioCard>

type Story = StoryObj<typeof RadioCard>

export const Sandbox: Story = {
  args: {
    name: "option",
    value: "a",
    label: "Option A",
    checked: true,
    children: (
      <span className="text-sm text-neutral-500">Additional details here</span>
    ),
  },
}

export const Selected: Story = {
  args: {
    name: "option",
    value: "a",
    label: "Selected card",
    checked: true,
  },
}

export const Unselected: Story = {
  args: {
    name: "option",
    value: "b",
    label: "Unselected card",
    checked: false,
  },
}

export const Disabled: Story = {
  args: {
    name: "option",
    value: "a",
    label: "Disabled card",
    checked: true,
    disabled: true,
  },
}

const InteractiveGroupExample = ({
  gap,
  direction,
}: {
  gap?: "sm" | "md" | "lg"
  direction?: "row" | "column"
}) => {
  const [selected, setSelected] = useState("low")
  const options = [
    { value: "low", label: "10,000", detail: "Fee: 500" },
    { value: "medium", label: "20,000", detail: "Fee: 1,000" },
    { value: "high", label: "30,000", detail: "Fee: 1,500" },
  ]

  return (
    <RadioCardGroup gap={gap} direction={direction} label="Select amount">
      {options.map((option) => (
        <RadioCard
          key={option.value}
          name="amount"
          value={option.value}
          label={option.label}
          checked={selected === option.value}
          onChange={setSelected}
        >
          <span className="bg-brand-200 text-brand-700 inline-flex rounded-sm px-2 py-0.5 text-xs">
            {option.detail}
          </span>
        </RadioCard>
      ))}
    </RadioCardGroup>
  )
}

export const GroupRow: Story = {
  render: () => <InteractiveGroupExample />,
}

export const GroupColumn: Story = {
  render: () => <InteractiveGroupExample direction="column" />,
}

export const GroupGapSmall: Story = {
  render: () => <InteractiveGroupExample gap="sm" />,
}

export const GroupGapLarge: Story = {
  render: () => <InteractiveGroupExample gap="lg" />,
}
