import { useTranslation } from "react-i18next"
import { useParams, useSearchParams } from "react-router"
import Button from "../../../components/Basic/Button"
import ButtonGroup from "../../../components/Basic/ButtonGroup"
import Typography from "../../../components/Basic/Typography"
import Layout from "../../../components/UI/Layout"
import LogoOnlyMenu from "../../../components/UI/LogoOnlyMenu"
import PageBar from "../../../components/UI/PageBar"
import { useTracking } from "../../../hooks/useTracking"
import ErrorIndex from "../../../pages/error/_error"
import { ConnectionResponseStatusEnum } from "../../../services/api/connections"
import useBanksList from "../hooks/useBanksList"
import useConnections from "../hooks/useConnections"
import platformConsents from "../models/platform-consents"
import platforms from "../models/platforms"

const ConnectionConsentView = ({
  onBack,
  afterSubmit,
}: {
  onBack: () => void
  afterSubmit: () => void
}) => {
  const { t } = useTranslation("connections")
  const { systemId } = useParams<{
    systemId: string
  }>()
  const [searchParams] = useSearchParams()
  const { createAndRedirectToProvider } = useConnections()
  const platformConsent = Object.values(platformConsents).find(
    (item) => item.systemId.toLowerCase() === systemId?.toLowerCase()
  )
  const { connections } = useConnections()
  const { trackEvent } = useTracking()
  const banks = useBanksList({
    country: searchParams.get("country") || undefined,
    id: searchParams.get("institutionId")
      ? [searchParams.get("institutionId") as string]
      : undefined,
  })
  const bank = banks.data?.content?.find(
    // eslint-disable-next-line sonarjs/different-types-comparison
    (item) => item.id === searchParams.get("institutionId")
  )

  const platform = Object.values(platforms).find(
    (item) => item.systemId === platformConsent?.systemId
  )

  if (!platformConsent || !platform) {
    return <ErrorIndex type="404" />
  }

  if (
    !platform.reuse &&
    connections.some(
      (item) =>
        item.connectionTemplateId === platform.connectionTemplateId &&
        [
          ConnectionResponseStatusEnum.Connecting,
          ConnectionResponseStatusEnum.Connected,
        ].includes(item.status!)
    )
  ) {
    onBack()
  }

  return (
    <Layout menu={<LogoOnlyMenu />}>
      <Layout.Parent>
        <PageBar
          title={t(platformConsent.headerTranslationKey)}
          desktopHeaderType="h4"
          onClickBack={onBack}
          withChat
        />
        <Typography className="mb-5 space-y-4">
          {platformConsent.getContent(t, { bank: bank?.name })}
        </Typography>

        <ButtonGroup withMargin>
          <Button
            type="submit"
            loading={createAndRedirectToProvider.isPending}
            onClick={async () => {
              await createAndRedirectToProvider.mutateAsync({
                platform,
                institutionId: searchParams.get("institutionId") || undefined,
                countryCode:
                  searchParams.get("country")?.toUpperCase() || undefined,
              })
              trackEvent({
                category: "connections",
                name: "consent",
                action: "clicked",
                customFields: {
                  name: platform.name,
                  category: platform.category,
                },
              })
              afterSubmit()
            }}
          >
            {t("consents.confirm")}
          </Button>
        </ButtonGroup>
      </Layout.Parent>
    </Layout>
  )
}

export default ConnectionConsentView
