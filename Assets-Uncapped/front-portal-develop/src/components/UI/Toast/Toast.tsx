import React from "react"
import { ToastContainer } from "react-toastify"
import { ReactComponent as CloseIcon } from "../../../svgs/close.svg"

const CloseButton = ({
  closeToast,
}: {
  closeToast: (e: React.MouseEvent<HTMLElement>) => void
}) => {
  return (
    <button
      className="Toastify__close-button Toastify__close-button--colored"
      type="button"
      aria-label="close"
      onClick={closeToast}
    >
      <CloseIcon />
    </button>
  )
}

const ToastConfiguredProvider = () => {
  return (
    <ToastContainer
      icon={false}
      position="top-right"
      autoClose={2500}
      hideProgressBar
      newestOnTop
      pauseOnFocusLoss
      pauseOnHover
      theme="colored"
      limit={1}
      closeButton={CloseButton}
    />
  )
}

export default ToastConfiguredProvider
