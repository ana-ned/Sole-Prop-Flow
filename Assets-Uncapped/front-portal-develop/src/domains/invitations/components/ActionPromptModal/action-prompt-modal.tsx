import { useState } from "react"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import FeatureContent from "../../../../components/Collections/FeatureContent"
import Modal from "../../../../components/UI/Modal"
import ExclamationImg from "../../../../svgs/illustrations/exclamation.svg"
import useInvitations, { CommonInvitationDTO } from "../../hooks/useInvitations"
import InviteDeletedModal from "./invite-deleted-modal"
import InviteResentModal from "./invite-resent-modal"

const ActionPromptModal = ({
  invitation,
  onClose,
}: {
  invitation: CommonInvitationDTO
  onClose: () => void
}) => {
  const { t } = useTranslation("invitations", {
    keyPrefix: "invitations-list",
  })
  const [resent, setResent] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const { invitationDeleteMutation, invitationResendMutation } =
    useInvitations()

  if (resent) {
    return <InviteResentModal onClose={onClose} email={invitation.email} />
  }

  if (deleted) {
    return <InviteDeletedModal onClose={onClose} />
  }

  const isLoading =
    invitationDeleteMutation.isPending || invitationResendMutation.isPending

  return (
    <Modal isOpen onClose={onClose} shouldCloseOnOverlayClick={!isLoading}>
      <FeatureContent
        img={ExclamationImg}
        title={t("modals.prompt.title")}
        content={t("modals.prompt.copy", {
          email: invitation.email,
        })}
        footerContent={
          <>
            <Button
              type="button"
              disabled={isLoading}
              loading={invitationResendMutation.isPending}
              variant="secondary"
              onClick={() => {
                invitationResendMutation.mutate({
                  id: invitation.id,
                  setResent,
                })
              }}
            >
              {t("modals.prompt.resend")}
            </Button>
            <Button
              type="button"
              disabled={isLoading}
              loading={invitationDeleteMutation.isPending}
              onClick={() => {
                invitationDeleteMutation.mutate({
                  id: invitation.id,
                  setDeleted,
                })
              }}
            >
              {t("modals.prompt.delete")}
            </Button>
          </>
        }
      />
    </Modal>
  )
}

export default ActionPromptModal
