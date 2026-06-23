import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import Button from "../../../components/Basic/Button"
import FeatureContent from "../../../components/Collections/FeatureContent"
import ApiErrorAlert from "../../../components/Functional/ApiErrorAlert"
import { StepProps } from "../../../components/Headless/MultistepForm"
import Modal from "../../../components/UI/Modal"
import useAuth from "../../../hooks/useAuth"
import useDevice from "../../../hooks/useDevice"
import { useTracking } from "../../../hooks/useTracking"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import {
  ApplicationControllerApi,
  ApplicationDetailsResponseTypeEnum,
  PartnersEligibilityCheckResponseNotEligibleReasonEnum,
} from "../../../services/api/partners"
import NotEligibleImg from "../../../svgs/illustrations/scalable-funding.svg"
import OfferAmount from "../../../components/UI/OfferAmount/OfferAmount"
import { DashboardStories } from "../../partner-dashboard/constants"
import partnerApplicationQueryKeys from "../partner-application.queries"
import { PartnerApplicationFormSchema } from "../partner-application.types"

const StepBallparkOffer = ({
  data,
}: StepProps<PartnerApplicationFormSchema>) => {
  const auth = useAuth()
  const { t } = useTranslation("partner-application", {
    keyPrefix: "stepBallparkOffer",
  })
  const { trackEvent } = useTracking()
  const { isMobile } = useDevice()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: async () => {
      return new ApplicationControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.Partners,
        })
      ).submitApplication({
        xXPARTNERID: auth.partnerId!,
        applicationId: data?.applicationId!,
      })
    },
    onSuccess: async (resp) => {
      await queryClient.invalidateQueries({
        queryKey: partnerApplicationQueryKeys.all(),
      })
      await queryClient.invalidateQueries({
        queryKey: partnerApplicationQueryKeys.detail(data?.applicationId),
      })
      if (resp.type !== ApplicationDetailsResponseTypeEnum.Direct) {
        await navigate(`/`)
        return
      }
      await navigate(
        `/?story=${DashboardStories.ProvideDetails}&dealId=${resp.id!}`
      )
    },
  })

  if (data?.isEligible) {
    return (
      <Modal isOpen fullScreen>
        <FeatureContent
          size="large"
          className={!isMobile ? "items-center" : undefined}
          title={t("eligible.title")}
          content={
            <>
              <OfferAmount
                amount={data.eligibleAmount || 0}
                currency={data.eligibleCurrency!}
                className="mt-5!"
              />
              <p>{t("eligible.content")}</p>
            </>
          }
          footerContent={
            <>
              {mutation.isError && (
                <ApiErrorAlert error={mutation.error as unknown as Response} />
              )}
              <Button
                variant="secondary"
                href="/"
                onClick={() => {
                  trackEvent({
                    category: "partner-application",
                    name: "eligible",
                    action: "cancel",
                  })
                }}
              >
                {t("eligible.saveAsDraft")}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  mutation.mutate()
                  trackEvent({
                    category: "partner-application",
                    name: "eligible",
                    action: "complete",
                  })
                }}
                loading={mutation.isPending}
              >
                {t("eligible.continue")}
              </Button>
            </>
          }
        />
      </Modal>
    )
  }

  const getReasonTitle = () => {
    if (
      data?.notEligibleReason ===
      PartnersEligibilityCheckResponseNotEligibleReasonEnum.LowRevenue
    ) {
      return t("ineligible.LOW_REVENUE.title")
    }

    if (
      data?.notEligibleReason ===
      PartnersEligibilityCheckResponseNotEligibleReasonEnum.UnsupportedUsState
    ) {
      return t("ineligible.UNSUPPORTED_US_STATE.title")
    }

    if (
      data?.notEligibleReason ===
      PartnersEligibilityCheckResponseNotEligibleReasonEnum.UnsupportedCanadaProvince
    ) {
      return t("ineligible.UNSUPPORTED_PROVINCE.title")
    }

    return t("ineligible.fallback.title")
  }

  const getReasonContent = () => {
    if (
      data?.notEligibleReason ===
      PartnersEligibilityCheckResponseNotEligibleReasonEnum.LowRevenue
    ) {
      return <p>{t("ineligible.LOW_REVENUE.content")}</p>
    }

    if (
      data?.notEligibleReason ===
      PartnersEligibilityCheckResponseNotEligibleReasonEnum.UnsupportedUsState
    ) {
      return <p>{t("ineligible.UNSUPPORTED_US_STATE.content")}</p>
    }

    if (
      data?.notEligibleReason ===
      PartnersEligibilityCheckResponseNotEligibleReasonEnum.UnsupportedCanadaProvince
    ) {
      return <p>{t("ineligible.UNSUPPORTED_PROVINCE.content")}</p>
    }

    return (
      <>
        {t("ineligible.fallback.content", {
          returnObjects: true,
        }).map((text) => (
          <p key={text}>{text}</p>
        ))}
      </>
    )
  }

  return (
    <Modal isOpen fullScreen>
      <FeatureContent
        size="large"
        img={NotEligibleImg}
        title={getReasonTitle()}
        content={getReasonContent()}
        footerContent={
          <Button
            variant="secondary"
            href="/"
            onClick={() => {
              trackEvent({
                category: "partner-application",
                name: "ineligible",
                action: "dismiss",
              })
            }}
          >
            {t("ineligible.submit")}
          </Button>
        }
      />
    </Modal>
  )
}

export default StepBallparkOffer
