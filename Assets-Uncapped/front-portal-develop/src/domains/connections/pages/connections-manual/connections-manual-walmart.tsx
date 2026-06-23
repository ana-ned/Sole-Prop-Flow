import { useTranslation } from "react-i18next"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import ListItemContainer from "../../../../components/Collections/ListItemContainer"
import PageLoader from "../../../../components/Collections/PageLoader/PageLoader"
import Card from "../../../../components/UI/Card"
import Chip from "../../../../components/UI/Chip"
import Layout from "../../../../components/UI/Layout"
import ListItemLarge from "../../../../components/UI/ListItemLarge"
import PageBar from "../../../../components/UI/PageBar"
import { ConnectionResponseStatusEnum } from "../../../../services/api/connections"
import { ReactComponent as AddIcon } from "../../../../svgs/add.svg"
import { ReactComponent as WalmartIcon } from "../../assets/sales-platforms/icons/walmart.svg"
import useConnections from "../../hooks/useConnections"
import platforms from "../../models/platforms"

const RegionCard = ({
  title,
  onClick,
  amountConnected,
}: {
  title: string
  onClick: () => void
  amountConnected?: number
}) => {
  const { t } = useTranslation("connections", { keyPrefix: "manual.walmart" })
  return (
    <ListItemContainer size="sm">
      <ListItemLarge
        title={title}
        icon={<WalmartIcon />}
        more={{
          type: "element",
          element: <AddIcon />,
          onClick,
        }}
        subtitle={
          amountConnected ? (
            <Chip
              label={t("connected", { count: amountConnected })}
              color="success"
            />
          ) : undefined
        }
      />
    </ListItemContainer>
  )
}

type CountryCode = "US" | "CA" | "MX"

const ManualConnectionWallmart = () => {
  const { t } = useTranslation("connections", { keyPrefix: "manual.walmart" })
  const { isLoading } = useConnections()
  const { connections, createAndRedirectToProvider } = useConnections()

  const walmartConnections = connections.filter(
    (el) =>
      (el.status === ConnectionResponseStatusEnum.Connected ||
        el.status === ConnectionResponseStatusEnum.Connecting) &&
      el.systemId === platforms.WalmartV2.systemId
  )

  const getShopsAmountByCountry = (country: CountryCode) => {
    // @ts-expect-error api described as [key: string]: object;
    return walmartConnections.filter((el) => el.data.countryCode == country)
      .length
  }

  const onClick = async (countryCode: CountryCode) => {
    await createAndRedirectToProvider.mutateAsync({
      platform: platforms.WalmartV2,
      countryCode,
    })
  }

  const COUNTRY_CARDS: {
    country: string
    code: CountryCode
  }[] = [
    {
      country: t("countries.US"),
      code: "US",
    },
    {
      country: t("countries.MX"),
      code: "MX",
    },
    {
      country: t("countries.CA"),
      code: "CA",
    },
  ]

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <Layout menu={false}>
      <Layout.Parent>
        <PageBar
          title={t("header")}
          onClickBack={() => {
            globalThis.history.back()
          }}
          withChat
        />
        <Typography type="body" className="mb-4">
          <SanitizedHtml as="span" content={t("description")} />
        </Typography>
        <Card variant="tertiary" className="flex flex-col gap-4">
          {COUNTRY_CARDS.map((card) => (
            <RegionCard
              key={card.country}
              title={card.country}
              onClick={async () => {
                await onClick(card.code)
              }}
              amountConnected={getShopsAmountByCountry(card.code)}
            />
          ))}
        </Card>
      </Layout.Parent>
    </Layout>
  )
}

export default ManualConnectionWallmart
