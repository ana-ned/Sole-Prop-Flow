import { Meta } from "@storybook/react-vite"
import PlainLayout from "./PlainLayout"

export default {
  title: "UI/PlainLayout",
  component: PlainLayout,
} as Meta<typeof PlainLayout>

export const Default = () => {
  return (
    <PlainLayout>
      <div>Main container column</div>
    </PlainLayout>
  )
}
