import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { CursorMagicSelection04SolidStandard } from "@hugeicons-pro/core-solid-standard"
import SumsubWebSdk from "@sumsub/websdk-react"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import Button from "../../../components/Basic/Button"
import Typography from "../../../components/Basic/Typography"
import PageLoader from "../../../components/Collections/PageLoader"
import Card from "../../../components/UI/Card"
import PlainLayout from "../../../components/UI/PlainLayout"
import { useTracking } from "../../../hooks/useTracking"
import ErrorIndex from "../../../pages/error/_error"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { ApplicantDataControllerApi } from "../../../services/api/kyc"
import {
  ONBOARDING_BASE_PATH,
  OnboardingPaths,
} from "../../onboarding/constants"
import StatusModalsDenied from "../components/StatusModals/StatusModalsDenied"
import useKyc from "../hooks/useKyc"

const Kyc = () => {
  const { userData } = useKyc()
  const { t } = useTranslation("kyc")
  const [isVerified, setIsVerified] = useState(false)
  const { trackEvent } = useTracking()
  const fetchToken = useQuery({
    queryKey: ["KYC_EMBEDD_TOKEN", userData.data?.externalUserId],
    queryFn: () => {
      return new ApplicantDataControllerApi(
        apiConfig({
          service: ApiServicesEnum.Kyc,
        })
      ).createApplicantAndAccessToken({
        xXORGID: "",
        externalId: userData.data?.externalUserId!,
      })
    },
    enabled: !!userData.data?.externalUserId,
    staleTime: Number.POSITIVE_INFINITY,
  })

  if (userData.error) {
    return <ErrorIndex type="500" />
  }

  if (userData.isLoading || fetchToken.isLoading) return <PageLoader />

  if (userData.data?.status === "denied_no_retry") return <StatusModalsDenied />

  if (isVerified) {
    return (
      <PlainLayout>
        <Typography type="h4" className="mb-5">
          {t("setupAccountsHeader")}
        </Typography>
        <Typography className="mb-8">{t("setupAccountsBody")}</Typography>
        <Card variant="tertiary" className="mt-8 flex gap-4">
          <div>
            <div className="bg-brand-200 rounded-lg p-1">
              <HugeiconsIcon
                icon={CursorMagicSelection04SolidStandard}
                className="text-accent-contrast size-6"
              />
            </div>
          </div>
          <Typography type="smallCopy" color="neutral-700">
            {t("mainUserReminder")}
          </Typography>
        </Card>

        <Button
          variant="primary"
          className="mt-8"
          href={`${ONBOARDING_BASE_PATH}${OnboardingPaths.DirectDebit}`}
          onClick={() => {
            trackEvent({
              category: "kyc",
              name: "setup-accounts-button",
              action: "click",
            })
          }}
        >
          {t("setupButton")}
        </Button>
      </PlainLayout>
    )
  }

  return (
    <PlainLayout>
      <Typography type="h4" className="mb-5">
        {t("header")}
      </Typography>
      <Typography className="mb-8">{t("instruction")}</Typography>
      <div className="shadow-light-sm border-card rounded-card-lg overflow-hidden">
        <SumsubWebSdk
          accessToken={fetchToken.data?.token || ""}
          expirationHandler={async () => {
            const result = await fetchToken.refetch()
            return result.data?.token || ""
          }}
          onMessage={(message: string, payload: any) => {
            if (
              message === "idCheck.onApplicantStatusChanged" &&
              payload?.reviewResult?.reviewAnswer === "GREEN"
            ) {
              setIsVerified(true)
            }
          }}
        />
      </div>
    </PlainLayout>
  )
}

export default Kyc
