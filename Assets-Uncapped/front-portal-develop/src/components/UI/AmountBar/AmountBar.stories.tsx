import { ComponentProps } from "react"
import { Meta, StoryObj } from "@storybook/react-vite"
import AmountBar from "./AmountBar"

type AmountBarProps = ComponentProps<typeof AmountBar>

const DEFAULT_SEGMENTS: AmountBarProps["segments"] = [
  {
    amount: 4000,
    label: "Drawn amount",
    color: "neutral-800",
  },
  {
    amount: 2000,
    label: "Requested amount",
    color: "neutral-300",
  },
  {
    amount: 3500,
    label: "Available to draw",
    color: "brand-600",
    emphasis: true,
  },
  {
    amount: 5000,
    label: "Grow to unlock",
    color: "accent-11-light",
    stripeColor: "accent-11",
  },
]

export default {
  title: "UI/AmountBar",
  component: AmountBar,
  args: {
    segments: DEFAULT_SEGMENTS,
    currency: "USD",
  },
} as Meta<typeof AmountBar>

type Story = StoryObj<typeof AmountBar>

export const Sandbox: Story = {}

export const WithZeroValues: Story = {
  args: {
    segments: [
      ...DEFAULT_SEGMENTS,
      {
        amount: 0,
        label: "No allocation",
        color: "neutral-100",
      },
    ],
  },
}

export const DifferentCurrency: Story = {
  args: {
    currency: "EUR",
  },
}

export const WithoutLegend: Story = {
  args: {
    showLegend: false,
  },
}

export const RepaymentBreakdownExample: Story = {
  args: {
    showLegend: false,
    segments: [
      {
        amount: 70000,
        label: "Repaid",
        color: "brand-600",
      },
      {
        amount: 5000,
        label: "Pending",
        color: "surface-canvas",
        stripeColor: "error-700",
      },
      {
        amount: 35000,
        label: "Left to repay",
        color: "brand-200",
        stripeColor: "brand-400",
      },
    ],
  },
}
