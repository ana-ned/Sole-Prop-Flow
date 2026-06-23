import { StoryFn, Meta } from "@storybook/react-vite"
import Button from "../../Basic/Button"
import FormLayout from "./FormLayout"

export default {
  title: "UI/FormLayout",
  component: FormLayout,
} as Meta<typeof FormLayout>

const Template: StoryFn<typeof FormLayout> = (args) => {
  return <FormLayout {...args} />
}

export const Default = {
  render: Template,

  args: {
    children: (
      <FormLayout>
        <FormLayout.Content>
          <h1>Form Content</h1>
        </FormLayout.Content>
        <Button type="button" onClick={() => null}>
          Submit
        </Button>
      </FormLayout>
    ),
  },
}
