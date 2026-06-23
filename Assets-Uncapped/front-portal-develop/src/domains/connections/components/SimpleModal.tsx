import clsx from "clsx"
import Typography from "../../../components/Basic/Typography"
import Modal from "../../../components/UI/Modal"
import useDevice from "../../../hooks/useDevice"
import { ReactComponent as CloseIcon } from "../../../svgs/close.svg"

const SimpleModal = ({
  title,
  children,
  footer,
  isOpen,
  onClose,
}: {
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  isOpen: boolean
  onClose: () => void
}) => {
  const { isMobile } = useDevice()

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      className={clsx("bg-surface-canvas w-[420px]", {
        "fixed bottom-0 h-auto !rounded-t-xl !pt-[31px]": isMobile,
      })}
    >
      <CloseIcon
        className="absolute top-2 right-2 cursor-pointer"
        onClick={onClose}
      />
      <Typography type="bodyTitle" className="mb-4 text-center">
        {title}
      </Typography>
      <div className="max-h-[40vh] overflow-y-auto">{children}</div>
      {!!footer && <div className="mt-4">{footer}</div>}
    </Modal>
  )
}

export default SimpleModal
