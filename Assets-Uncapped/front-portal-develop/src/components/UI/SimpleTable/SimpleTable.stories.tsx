import { StoryFn, Meta } from "@storybook/react-vite"
import SimpleTable from "./SimpleTable"

export default {
  title: "UI/SimpleTable",
  component: SimpleTable,
} as Meta<typeof SimpleTable>

const Template: StoryFn<typeof SimpleTable> = (args) => {
  return <SimpleTable {...args} />
}

export const Default = {
  render: Template,

  args: {
    data: [
      { th: "All spendings", td: "$100" },
      { th: "All incomes", td: "$200" },
      { th: "Card", td: "$100", child: true },
      { th: "Cash", td: "$100", child: true },
      { th: "Result", td: "$300", fontWeight: "bold" },
    ],
  },
}
