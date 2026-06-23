import React, {
  createContext,
  type JSX,
  type SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import clsx from "clsx"
import Modal from "../components/UI/Modal"
import useDevice from "./useDevice"

interface ModalContextProps {
  setModal: (
    node: SetStateAction<React.ReactNode | null>,
    modalProps?: Record<string, unknown>
  ) => void
  closeModal: () => void
  closeModalAndThen: (fnToExecuteAfterModalClosed: () => void) => void
  openModal: (shouldCloseOnOverlayClick?: boolean) => void
  isModalOpen: boolean
}

interface ModalProviderProps {
  children: React.ReactNode
}

const ModalContext = createContext<Partial<ModalContextProps>>({})

export const useModal = (): ModalContextProps =>
  useContext(ModalContext) as ModalContextProps

export const ModalProvider = (props: ModalProviderProps): JSX.Element => {
  const { children } = props
  const { isMobile } = useDevice()
  const [isOpen, setOpen] = useState(false)
  const [content, setContent] = useState<React.ReactNode>(null)
  const [modalProps, setModalProps] = useState<Record<string, unknown>>()

  const setModal = useCallback(
    (
      node: SetStateAction<React.ReactNode>,
      contentProps?: Record<string, unknown>
    ): void => {
      setContent(node)
      setModalProps(contentProps)
    },
    []
  )

  const openModal = useCallback((): void => {
    setOpen(true)
  }, [])

  const closeModal = useCallback((): void => {
    setOpen(false)
  }, [])

  const closeModalAndThen = useCallback(
    (fnToExecuteAfterModalClosed: () => void): void => {
      closeModal()
      setTimeout(() => {
        fnToExecuteAfterModalClosed()
      }, 100)
    },
    [closeModal]
  )

  const value = useMemo(
    () => ({
      setModal,
      openModal,
      closeModal,
      closeModalAndThen,
      isModalOpen: isOpen,
    }),
    [setModal, openModal, closeModal, closeModalAndThen, isOpen]
  )

  return (
    <ModalContext.Provider value={value}>
      {children}

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setOpen(false)
        }}
        shouldCloseOnOverlayClick
        className={clsx({ "pb-12": isMobile })}
        {...modalProps}
      >
        {content}
      </Modal>
    </ModalContext.Provider>
  )
}
