import { useEffect } from "react"
import { Meta, StoryObj } from "@storybook/react-vite"
import { toast } from "react-toastify"
import ToastConfiguredProvider from "./Toast"

const meta: Meta = {
  title: "UI/Toast",
  component: ToastConfiguredProvider,
  parameters: {
    layout: "centered",
    docs: {
      disable: true,
    },
  },
  decorators: [
    (Story) => {
      toast.clearWaitingQueue()
      toast.dismiss()

      return (
        <div>
          <ToastConfiguredProvider />
          <Story />
        </div>
      )
    },
  ],
}

export default meta

type Story = StoryObj<typeof ToastConfiguredProvider>

const ToastDisplay = ({ showToast }: { showToast: () => void }) => {
  useEffect(() => {
    showToast()
  }, [showToast])

  return null
}

export const SuccessNotification: Story = {
  render: () => (
    <ToastDisplay
      showToast={() =>
        toast.success("Success toast message", { autoClose: false })
      }
    />
  ),
}

export const ErrorNotification: Story = {
  render: () => (
    <ToastDisplay
      showToast={() => toast.error("Error toast message", { autoClose: false })}
    />
  ),
}
