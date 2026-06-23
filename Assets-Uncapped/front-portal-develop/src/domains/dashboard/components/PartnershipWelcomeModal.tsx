import { useTranslation } from "react-i18next"
import Button from "../../../components/Basic/Button"
import FeatureContent from "../../../components/Collections/FeatureContent"
import Modal from "../../../components/UI/Modal"
import useAuth from "../../../hooks/useAuth"
import useCreateDealOnDemand from "../../../hooks/useCreateDealOnDemand"
import { useTracking } from "../../../hooks/useTracking"
import useOrganisationPreferences from "../../../hooks/useUpdateOrganisationPreferences"
import { ONBOARDING_BASE_PATH } from "../../onboarding/constants"
import MarcusModalImg from "../assets/marcus-modal.svg"

const PartnershipWelcomeModal = ({
  isOpen,
  sourceType,
}: {
  isOpen: boolean
  sourceType: "MARCUS" | "SELLERSFI"
}) => {
  const { organisationData } = useAuth()
  const { t } = useTranslation("onboarding", {
    keyPrefix: "PartnershipWelcomeModal",
  })
  const organisationPreferencesMutation = useOrganisationPreferences()
  const { trackEvent } = useTracking()
  const createDealOnDemandMutation = useCreateDealOnDemand()

  return (
    <Modal
      isOpen={!organisationData?.preferences?.seenMarcusWelcomeModal && isOpen}
    >
      <FeatureContent
        img={MarcusModalImg}
        fluidIcon
        title={t("title")}
        content={t("copy", {
          sourceType:
            sourceType === "MARCUS" ? t("goldmanSachs") : t("sellersfi"),
        })}
        footerContent={
          <>
            <Button
              fullWidth
              type="button"
              variant="secondary"
              onClick={async () => {
                await organisationPreferencesMutation.mutateAsync({
                  seenMarcusWelcomeModal: true,
                })
                trackEvent({
                  category: "dashboard",
                  name: `marcus-welcome-modal`,
                  action: "click",
                  customFields: {
                    cta: "close",
                    sourceType,
                  },
                })
                // Updating organisation preferences doesn't refetch the query - hard reload required.
                globalThis.location.href = "/"
              }}
            >
              {t("viewLoan", {
                sourceType:
                  sourceType === "MARCUS" ? t("goldmanSachs") : t("sellersfi"),
              })}
            </Button>
            {organisationData?.preliminaryOffer?.amount &&
              organisationData.preliminaryOffer.amount > 1000 && (
                <Button
                  type="button"
                  fullWidth
                  onClick={async () => {
                    await organisationPreferencesMutation.mutateAsync({
                      seenMarcusWelcomeModal: true,
                    })
                    await createDealOnDemandMutation.mutateAsync()
                    trackEvent({
                      category: "dashboard",
                      name: `marcus-welcome-modal`,
                      action: "click",
                      customFields: {
                        cta: "apply",
                        sourceType,
                      },
                    })
                    // Updating organisation preferences doesn't refetch the query - hard reload required.
                    globalThis.location.href = ONBOARDING_BASE_PATH
                  }}
                  loading={createDealOnDemandMutation.isPending}
                >
                  {t("apply")}
                </Button>
              )}
          </>
        }
      />
    </Modal>
  )
}

export default PartnershipWelcomeModal
