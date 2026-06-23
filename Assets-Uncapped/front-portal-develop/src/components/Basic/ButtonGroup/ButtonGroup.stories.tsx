import { Meta, StoryObj } from "@storybook/react-vite"
import Button from "../Button"
import ButtonGroup from "./ButtonGroup"

export default {
  title: "Basic/ButtonGroup",
  component: ButtonGroup,
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl border border-dashed border-neutral-300 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ButtonGroup>

type Story = StoryObj<typeof ButtonGroup>

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button type="submit">Continue</Button>
    </ButtonGroup>
  ),
}

export const WithBackUrl: Story = {
  name: "With Back URL",
  render: () => (
    <ButtonGroup backUrl="/previous-step">
      <Button type="submit">Continue</Button>
    </ButtonGroup>
  ),
}

export const WithMargin: Story = {
  name: "With Margin (mt-8)",
  render: () => (
    <div>
      <div className="bg-neutral-100 p-4">Content above</div>
      <ButtonGroup withMargin>
        <Button type="submit">Continue</Button>
      </ButtonGroup>
    </div>
  ),
}

export const WithBackUrlAndMargin: Story = {
  name: "With Back URL and Margin",
  render: () => (
    <div>
      <div className="bg-neutral-100 p-4">Content above</div>
      <ButtonGroup backUrl="/previous-step" withMargin>
        <Button type="submit">Continue</Button>
      </ButtonGroup>
    </div>
  ),
}

export const MultipleButtons: Story = {
  name: "Multiple Buttons",
  render: () => (
    <ButtonGroup>
      <Button variant="secondary" type="button">
        Save Draft
      </Button>
      <Button type="submit">Submit</Button>
    </ButtonGroup>
  ),
}

export const MultipleButtonsWithBackUrl: Story = {
  name: "Multiple Buttons with Back URL",
  render: () => (
    <ButtonGroup backUrl="/previous-step">
      <Button variant="secondary" type="button">
        Save Draft
      </Button>
      <Button type="submit">Submit</Button>
    </ButtonGroup>
  ),
}

export const LoadingState: Story = {
  name: "Loading State",
  render: () => (
    <ButtonGroup backUrl="/previous-step">
      <Button type="submit" loading>
        Submit
      </Button>
    </ButtonGroup>
  ),
}

export const DisabledState: Story = {
  name: "Disabled State",
  render: () => (
    <ButtonGroup backUrl="/previous-step">
      <Button type="submit" disabled>
        Continue
      </Button>
    </ButtonGroup>
  ),
}
