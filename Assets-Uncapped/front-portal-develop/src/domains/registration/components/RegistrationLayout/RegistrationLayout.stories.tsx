import { Meta } from "@storybook/react-vite"
import RegistrationLayout from "./RegistrationLayout"

export default {
  title: "Domains/Registration/RegistrationLayout",
  component: RegistrationLayout,
} as Meta<typeof RegistrationLayout>

export const Default = {
  args: {
    children: <span>Onboarding Content Goes Here</span>,
  },
}
