import { Meta, StoryFn } from "@storybook/react-vite"
import GraphWidget from "./GraphWidget"

const MOCK_DATA = [
  {
    value: 400000,
    name: "Jul",
  },
  {
    value: 350000,
    name: "Aug",
  },
  {
    value: 300000,
    name: "Sep",
  },
  {
    value: 200000,
    name: "Oct",
  },
  {
    value: 50000,
    name: "Nov",
  },
  {
    value: 0,
    name: "Dec",
  },
]

export default {
  title: "UI/GraphWidget",
  component: GraphWidget,
} as Meta<typeof GraphWidget>

const Template: StoryFn<typeof GraphWidget> = (args) => {
  return <GraphWidget {...args} />
}

export const Default = {
  render: Template,

  args: {
    data: MOCK_DATA,
    height: 300,
    title: "Est. repayment schedule",
    description: "If all payments are using cash (6%)",
  },
}
