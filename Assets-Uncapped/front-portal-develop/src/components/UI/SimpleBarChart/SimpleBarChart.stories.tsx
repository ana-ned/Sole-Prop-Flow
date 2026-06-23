import { Meta, StoryObj } from "@storybook/react-vite"
import SimpleBarChart, {
  BASE_SEGMENT_CLASS,
  PRIMARY_SEGMENT_CLASS,
} from "./SimpleBarChart"

const SEGMENT_CONFIGS = [
  { className: PRIMARY_SEGMENT_CLASS, withOverlay: true },
  { className: BASE_SEGMENT_CLASS },
]

export default {
  title: "UI/SimpleBarChart",
  component: SimpleBarChart,
  decorators: [
    (Story) => (
      <div style={{ margin: "0 auto", maxWidth: "500px" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    segmentConfigs: SEGMENT_CONFIGS,
    emptyLabel: "No repayment",
    ariaLabel: "Bar chart",
    columns: [
      {
        key: "1",
        segments: [
          { amount: 1500, configIndex: 0 },
          { amount: 8500, configIndex: 1 },
        ],
        topLabel: "£1,500",
        bottomLabel: "Month 1\n£10,000",
      },
      {
        key: "2",
        segments: [
          { amount: 1800, configIndex: 0 },
          { amount: 10200, configIndex: 1 },
        ],
        topLabel: "£1,800",
        bottomLabel: "Month 2\n£12,000",
      },
      {
        key: "3",
        segments: [
          { amount: 1200, configIndex: 0 },
          { amount: 6800, configIndex: 1 },
        ],
        topLabel: "£1,200",
        bottomLabel: "Month 3\n£8,000",
      },
      {
        key: "4",
        segments: [
          { amount: 1425, configIndex: 0 },
          { amount: 8075, configIndex: 1 },
        ],
        topLabel: "£1,425",
        bottomLabel: "Month 4\n£9,500",
      },
    ],
    legend: [{ segmentIndex: 0, label: "Repayments: 15% of monthly revenue" }],
  },
} satisfies Meta<typeof SimpleBarChart>

type Story = StoryObj<typeof SimpleBarChart>

export const Sandbox: Story = {}

export const WithEmptyColumn: Story = {
  args: {
    columns: [
      {
        key: "1",
        segments: [
          { amount: 2000, configIndex: 0 },
          { amount: 8000, configIndex: 1 },
        ],
        topLabel: "£2,000",
        bottomLabel: "Month 1\n£10,000",
      },
      {
        key: "2",
        segments: [
          { amount: 3000, configIndex: 0 },
          { amount: 12000, configIndex: 1 },
        ],
        topLabel: "£3,000",
        bottomLabel: "Month 2\n£15,000",
      },
      {
        key: "3",
        segments: [],
        bottomLabel: "Month 3\n£6,000",
      },
      {
        key: "4",
        segments: [
          { amount: 2200, configIndex: 0 },
          { amount: 8800, configIndex: 1 },
        ],
        topLabel: "£2,200",
        bottomLabel: "Month 4\n£11,000",
      },
    ],
  },
}

export const NoLegend: Story = {
  args: {
    legend: undefined,
  },
}
