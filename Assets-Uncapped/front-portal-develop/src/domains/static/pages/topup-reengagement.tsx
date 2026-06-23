import { useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Navigate } from "react-router"
import SanitizedHtml from "../../../components/Basic/SanitizedHtml"
import Typography from "../../../components/Basic/Typography"
import PageLoader from "../../../components/Collections/PageLoader"
import Card from "../../../components/UI/Card"
import CheckList from "../../../components/UI/CheckList"
import Layout from "../../../components/UI/Layout"
import LogoOnlyMenu from "../../../components/UI/LogoOnlyMenu"
import PageBar from "../../../components/UI/PageBar"
import useAuth from "../../../hooks/useAuth"
import useDeal from "../../../hooks/useDeal"
import useTrackedQueryParams from "../../../hooks/useTrackedQueryParams"
import { useTracking } from "../../../hooks/useTracking"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import {
  CustomerFacingDealDetailsResponseStageEnum,
  DealControllerApi,
} from "../../../services/api/hubspot"
import { OrganisationOverviewOrganisationSourceEnum } from "../../../services/api/organisation-users"
import {
  OnboardingPaths,
  ONBOARDING_BASE_PATH,
} from "../../onboarding/constants"
import useOffers from "../../onboarding/hooks/useOffers"

const TopupReengagement = () => {
  const auth = useAuth()
  const { t } = useTranslation("static", {
    keyPrefix: "topupReengagement",
  })
  const offers = useOffers()
  const deal = useDeal()
  const { trackEvent } = useTracking()
  const { trackedUTMs } = useTrackedQueryParams()

  const createDeal = useCallback(async () => {
    if (
      [
        CustomerFacingDealDetailsResponseStageEnum.DataCompleteness,
        CustomerFacingDealDetailsResponseStageEnum.DataValidation,
        CustomerFacingDealDetailsResponseStageEnum.Underwriting,
        CustomerFacingDealDetailsResponseStageEnum.Offering,
      ].includes(deal.data?.stage as any)
    ) {
      return null
    }

    if (
      [
        OrganisationOverviewOrganisationSourceEnum.Marcus,
        OrganisationOverviewOrganisationSourceEnum.Sellersfi,
      ].includes(auth.organisationData?.organisationSource as any) &&
      !deal.data
    ) {
      await new DealControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.HubSpot,
        })
      ).createOnDemandDeal({
        xXORGID: auth.organisation?.organisationId!,
        ...(trackedUTMs && {
          dealCreationRequest: { utmTags: trackedUTMs },
        }),
      })

      trackEvent({
        category: "static",
        name: "topup_reengagement",
        action: "requested",
      })

      return
    }

    await new DealControllerApi(
      apiConfig({
        token: await auth.getToken(),
        service: ApiServicesEnum.HubSpot,
      })
    ).topUpInterested({
      xXORGID: auth.organisation?.organisationId!,
      ...(trackedUTMs && {
        dealCreationRequest: { utmTags: trackedUTMs },
      }),
    })

    trackEvent({
      category: "static",
      name: "topup_reengagement",
      action: "requested",
    })
  }, [])

  useEffect(() => {
    if (!offers.isLoading && offers.signeableOffers.length === 0) {
      void createDeal()
    }
  }, [createDeal, offers.isLoading, offers.signeableOffers.length])

  useEffect(() => {
    trackEvent({
      category: "static",
      name: "topup_reengagement",
      action: "view",
    })
  }, [])

  if (offers.signeableOffers.length > 0) {
    return (
      <Navigate
        to={`${ONBOARDING_BASE_PATH}${OnboardingPaths.Offers}`}
        replace
      />
    )
  }

  if (offers.isLoading || deal.isLoading) {
    return <PageLoader />
  }

  return (
    <Layout menu={<LogoOnlyMenu />}>
      <Layout.Parent>
        <PageBar
          title={t("title")}
          withChat
          desktopHeaderType="h4"
          backUrl="/"
        />
        <div className="flex flex-col gap-y-8">
          <Card variant="background" className="text-center">
            <Typography type="bodyTitle" color="white">
              {t("box.title")}
            </Typography>
            <Typography type="h4" color="white" className="mt-2">
              {t("box.subtitle")}
            </Typography>
          </Card>

          <div>
            <Typography type="h5" className="mb-6">
              <SanitizedHtml as="span" content={t("nextTitle")} />
            </Typography>
            <ol className="ol-primary">
              {t("nextList", {
                returnObjects: true,
              }).map((item) => (
                <li key={item}>
                  <Typography>{item}</Typography>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <Typography type="h5" className="mb-6">
              <SanitizedHtml as="span" content={t("expectTitle")} />
            </Typography>
            <CheckList
              items={t("expectList", {
                returnObjects: true,
              })}
            />
          </div>
        </div>
      </Layout.Parent>
    </Layout>
  )
}

export default TopupReengagement
