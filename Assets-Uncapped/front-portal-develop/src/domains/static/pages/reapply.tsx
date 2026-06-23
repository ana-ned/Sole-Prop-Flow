import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Navigate } from "react-router"
import Button from "../../../components/Basic/Button"
import SanitizedHtml from "../../../components/Basic/SanitizedHtml"
import Typography from "../../../components/Basic/Typography"
import PageLoader from "../../../components/Collections/PageLoader"
import Layout from "../../../components/UI/Layout"
import LogoOnlyMenu from "../../../components/UI/LogoOnlyMenu"
import PageBar from "../../../components/UI/PageBar"
import useAuth from "../../../hooks/useAuth"
import useDeal from "../../../hooks/useDeal"
import { useTracking } from "../../../hooks/useTracking"
import { CustomerFacingDealDetailsResponseStageEnum } from "../../../services/api/hubspot"
import useAttributionReapply from "../../onboarding/hooks/useAttributionReapply"
import useCreateReengagementDeal from "../../onboarding/hooks/useCreateReengagementDeal"
import reapplyImage from "../assets/reapply.svg"

const TopupReengagement = () => {
  const { t } = useTranslation("static", {
    keyPrefix: "reapply",
  })
  const auth = useAuth()
  const deal = useDeal()
  const { trackEvent } = useTracking()
  const attributionReapply = useAttributionReapply()
  const createReengagementDeal = useCreateReengagementDeal()

  useEffect(() => {
    trackEvent({
      category: "static",
      name: "reapply",
      action: "view",
    })
  }, [])

  if (auth.organisation?.activated) {
    return <Navigate to="/s/topup-reengagement" />
  }

  if (
    [
      CustomerFacingDealDetailsResponseStageEnum.DataCompleteness,
      CustomerFacingDealDetailsResponseStageEnum.DataValidation,
      CustomerFacingDealDetailsResponseStageEnum.Underwriting,
      CustomerFacingDealDetailsResponseStageEnum.Offering,
    ].includes(deal.data?.stage as any)
  ) {
    return <Navigate to="/onboarding" />
  }

  if (deal.isLoading) {
    return <PageLoader />
  }

  return (
    <Layout menu={<LogoOnlyMenu />}>
      <Layout.Parent>
        <PageBar title={t("title")} withChat desktopHeaderType="h4" />

        <img src={reapplyImage} alt="" className="my-4" />

        <div className="flex flex-col gap-4">
          {t("content", {
            returnObjects: true,
          }).map((item) => (
            <Typography type="body" key={item}>
              <SanitizedHtml as="span" content={item} />
            </Typography>
          ))}
        </div>

        <Button
          className="mt-10 md:mt-16"
          type="button"
          loading={
            createReengagementDeal.isPending || attributionReapply.isPending
          }
          onClick={async () => {
            trackEvent({
              category: "static",
              name: "reapply",
              action: "clicked",
            })

            try {
              await attributionReapply.mutateAsync()
              await createReengagementDeal.mutateAsync(undefined)

              trackEvent({
                category: "static",
                name: "reapply",
                action: "success",
              })
            } catch {
              trackEvent({
                category: "static",
                name: "reapply",
                action: "error",
              })
            }
          }}
        >
          {t("button")}
        </Button>
      </Layout.Parent>
    </Layout>
  )
}

export default TopupReengagement
