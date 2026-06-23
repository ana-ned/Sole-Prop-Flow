import { Meta } from "@storybook/react-vite"
import Button from "../../Basic/Button"
import Confirmation from "../Confirmation"
import Modal from "./Modal"

export default {
  title: "Basic/Modal",
  component: Modal,
} as Meta<typeof Modal>

export const Default = () => {
  return (
    <Modal isOpen>
      <Confirmation
        subtitle="This will be sent on Monday 1st June 2021"
        title="Payment confirmed"
        type="success"
      >
        <Button
          type="button"
          onClick={() => {
            console.log("Hello")
          }}
        >
          Continue
        </Button>
      </Confirmation>
    </Modal>
  )
}
