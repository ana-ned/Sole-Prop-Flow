import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"
import Button from "../../../components/Basic/Button"
import FeatureContent from "../../../components/Collections/FeatureContent"
import Modal from "../../../components/UI/Modal"
import useAuth from "../../../hooks/useAuth"
import i18n from "../../../inits/i18next"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { ApplicationControllerApi } from "../../../services/api/partners"
import QualifyImg from "../../../svgs/illustrations/qualify-top-up.svg"
import { DashboardStories } from "../../partner-dashboard/constants"
import partnerApplicationQueryKeys from "../partner-application.queries"

const StepIntroduceOrganisationSkipModal = ({
  isOpen,
  onClose,
  applicationId,
}: {
  isOpen: boolean
  onClose: () => void
  applicationId: string
}) => {
  const auth = useAuth()
  const { t } = useTranslation("partner-application", {
    keyPrefix: "stepIntroduceOrganisationSkipModal",
  })
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: async () => {
      return new ApplicationControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Partners,
        })
      ).skipApplication({
        xXPARTNERID: auth.partnerId!,
        applicationId,
      })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: partnerApplicationQueryKeys.all(),
      })
      await navigate(
        `/?story=${DashboardStories.PartialIntroduction}&dealId=${applicationId}`
      )
    },
    onError: () => {
      toast.error(i18n.t("common:defaultErrorMessage"))
    },
  })

  return (
    <Modal isOpen={isOpen} fullScreen>
      <FeatureContent
        size="large"
        img={QualifyImg}
        title={t("title")}
        content={t("content")}
        footerContent={
          <>
            <Button
              fullWidth
              variant="secondary"
              type="button"
              disabled={mutation.isPending}
              onClick={onClose}
            >
              {t("goBack")}
            </Button>
            <Button
              fullWidth
              type="button"
              variant="primary"
              loading={mutation.isPending}
              onClick={async () => {
                await mutation.mutateAsync()
              }}
            >
              {t("send")}
            </Button>
          </>
        }
      />
    </Modal>
  )
}

export default StepIntroduceOrganisationSkipModal
