import Button from "../../../components/Basic/Button"
import Modal from "../../../components/UI/Modal/Modal"
import { ReactComponent as CloseIcon } from "../../../svgs/close.svg"
import TransactionDetails from "./TransactionDetails"

const LegacyDetailsModal = ({
  accountId,
  transactionId,
  onClose,
}: {
  accountId: string
  transactionId: string
  onClose: () => void
}) => {
  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      className="bg-surface-elevated-2"
      size="sm"
    >
      <Button
        type="button"
        onClick={onClose}
        variant="secondary"
        className="ml-auto"
      >
        <CloseIcon onClick={onClose} />
      </Button>
      <TransactionDetails ids={{ accountId, transactionId }} />
    </Modal>
  )
}

export default LegacyDetailsModal
