import { Meta, StoryObj } from "@storybook/react-vite"
import Accordion from "./Accordion"

export default {
  title: "UI/Accordion",
  component: Accordion,
} satisfies Meta<typeof Accordion>

type Story = StoryObj<typeof Accordion>

export const Primary: Story = {
  args: {
    title: "some header text",
    items: [
      {
        label: "some label 1",
        value: 1,
        content: "some content 1",
      },
      {
        label: "some label 2",
        value: 2,
        content: "some content 2",
      },
    ],
  },
}

export const AlwaysOpenItem: Story = {
  args: {
    title: "some header text",
    items: [
      {
        label: "some label 1",
        value: 1,
        content: "some content 1",
        alwaysOpen: true,
      },
      {
        label: "some label 2",
        value: 2,
        content: "some content 2",
      },
    ],
  },
}

export const WithoutTitle: Story = {
  args: {
    items: [
      {
        label: "some label 1",
        value: 1,
        content: "some content 1",
      },
      {
        label: "some label 2",
        value: 2,
        content: "some content 2",
      },
    ],
  },
}

export const WithoutContent: Story = {
  args: {
    title: "No expandable items",
    items: [
      {
        label: "Label only",
        value: 42,
      },
      {
        label: "Another label",
        value: 100,
      },
    ],
  },
}

export const WithChip: Story = {
  args: {
    title: "Items with chips",
    items: [
      {
        label: "With chip",
        value: 1,
        content: "some content",
        chip: (
          <span className="bg-brand-100 text-brand-600 rounded-full px-2 py-0.5 text-xs">
            New
          </span>
        ),
      },
      {
        label: "Without chip",
        value: 2,
        content: "some content",
      },
    ],
  },
}

export const WithCustomValueType: Story = {
  args: {
    title: "Custom value typography",
    items: [
      {
        label: "Body copy value",
        value: "£1,234.56",
        content: "some content",
        valueType: "bodyMedium",
      },
      {
        label: "Small copy value",
        value: "£789.00",
        content: "some content",
        valueType: "smallCopy",
      },
    ],
  },
}

export const WithContentLinks: Story = {
  args: {
    title: "Items with links in content",
    items: [
      {
        label: "Expandable item",
        value: 1,
        content: (
          <p>
            Some text with a <a href="https://example.com">link</a> inside
          </p>
        ),
      },
    ],
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Accordion
        title="V1 - Icon on the left (default)"
        variant="v1"
        items={[
          { label: "some label 1", value: 1, content: "some content 1" },
          { label: "some label 2", value: 2, content: "some content 2" },
        ]}
      />
      <Accordion
        title="V2 - Icon on the right"
        variant="v2"
        items={[
          { label: "some label 1", value: 1, content: "some content 1" },
          { label: "some label 2", value: 2, content: "some content 2" },
        ]}
      />
    </div>
  ),
}

export const WithCustomClassName: Story = {
  args: {
    title: "Custom class on items",
    className: "max-w-md",
    items: [
      {
        label: "Custom item",
        value: 1,
        content: "some content",
        className: "bg-gray-50",
        labelClassName: "text-sm",
      },
    ],
  },
}
