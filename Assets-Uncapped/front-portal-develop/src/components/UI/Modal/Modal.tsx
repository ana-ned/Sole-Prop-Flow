import { useEffect, PropsWithChildren } from "react"
import { cva, VariantProps } from "class-variance-authority"
import ReactModal from "react-modal"
import { useUnmount } from "react-use"
import { twMerge } from "tailwind-merge"
import useDevice from "../../../hooks/useDevice"
import { isTest } from "../../../utils/env"

if (!isTest() && !import.meta.env.STORYBOOK) {
  ReactModal.setAppElement("#root")
}

const removeBackgroundBlur = () => {
  document.body.classList.remove("ReactModal__Body--open")
}

const modalVariants = cva(
  [
    "w-125 max-h-full px-8 py-8 overflow-y-auto outline-0 bg-surface-canvas rounded-xl [-webkit-overflow-scrolling:touch] shadow-[0_6px_12px_rgb(117_47_1_/_0.08)]",
  ],
  {
    variants: {
      mobile: {
        true: [
          "w-full! h-full py-4 px-(--mobile-padding) overflow-x-hidden rounded-none shadow-none",
        ],
        false: ["absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"],
      },
      size: {
        sm: ["max-w-100"],
        md: [],
        lg: ["w-full max-w-175"],
      },
      fullScreen: {
        true: ["bg-surface-canvas rounded-none shadow-none"],
        false: [],
      },
      slim: {
        true: ["w-133 pt-0 px-4 pb-2"],
        false: [],
      },
    },
    compoundVariants: [
      {
        mobile: true,
        slim: true,
        class: ["w-full"],
      },
    ],
  }
)

const overlayVariants = cva(
  [
    "fixed top-0 bottom-0 left-0 z-(--overlay-z-index) w-[100vw] bg-black/70 backdrop-blur-lg",
  ],
  {
    variants: {
      fullScreen: {
        true: ["bg-surface-canvas"],
        false: [],
      },
      mobile: {
        true: [],
        false: ["w-full h-full overflow-y-auto overflow-x-hidden"],
      },
    },
  }
)

type ModalVariants = Omit<VariantProps<typeof modalVariants>, "mobile">

interface ModalProps extends PropsWithChildren<ModalVariants> {
  isOpen: boolean
  className?: string
  onClose?: () => void
  shouldCloseOnOverlayClick?: boolean
  overlayClassName?: string
}

const Modal = ({
  isOpen,
  children,
  className,
  fullScreen = false,
  onClose,
  shouldCloseOnOverlayClick = true,
  slim = false,
  size = "md",
  overlayClassName,
}: ModalProps) => {
  const { isMobile } = useDevice()
  useUnmount(() => {
    removeBackgroundBlur()
  })

  useEffect(() => {
    if (!isOpen) {
      removeBackgroundBlur()
    }
  }, [isOpen])

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={!isTest()}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      className={twMerge(
        modalVariants({ mobile: isMobile, fullScreen, size, slim }),
        className
      )}
      overlayClassName={twMerge(
        overlayVariants({ fullScreen, mobile: isMobile }),
        overlayClassName
      )}
    >
      {children}
    </ReactModal>
  )
}

export default Modal
