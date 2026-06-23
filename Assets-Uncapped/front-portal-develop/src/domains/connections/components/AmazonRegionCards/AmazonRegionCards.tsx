import { useTranslation } from "react-i18next"
import Typography from "../../../../components/Basic/Typography"
import ListItemContainer from "../../../../components/Collections/ListItemContainer"
import Card from "../../../../components/UI/Card"
import Chip from "../../../../components/UI/Chip"
import ListItemLarge from "../../../../components/UI/ListItemLarge"
import { ConnectionResponseStatusEnum } from "../../../../services/api/connections"
import CountryService from "../../../../services/country"
import { ReactComponent as AddIcon } from "../../../../svgs/add.svg"
import { ReactComponent as AmazonIcon } from "../../assets/sales-platforms/icons/amazon.svg"
import useConnections from "../../hooks/useConnections"
import platforms from "../../models/platforms"
import { AMAZON_ELIGIBLE_REGIONS, AmazonRegionsEnum } from "../../utils/amazon"

const RegionCard = ({
  title,
  countries,
  onClick,
  amountConnected,
}: {
  title: string
  countries: string[]
  onClick: () => void
  amountConnected?: number
}) => {
  const { t } = useTranslation("connections", {
    keyPrefix: "AmazonRegionCards",
  })
  return (
    <Card className="bg-surface-elevated-2 [&>button]:shadow-light-sm mt-4 [&>button]:border-none">
      <ListItemContainer size="sm">
        <ListItemLarge
          title={title}
          icon={<AmazonIcon />}
          className="[&_div:first-child]:p-1"
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
      <Typography type="smallTitle" className="mt-2">
        {t("choose")}
      </Typography>
      <Typography type="smallCopy" color="neutral-600" className="mt-2">
        {countries
          .map((country) => CountryService.getByAlpha3(country)?.name)
          .join(", ")}
      </Typography>
    </Card>
  )
}

const AmazonRegionCards = () => {
  const { t } = useTranslation("connections", {
    keyPrefix: "AmazonRegionCards",
  })
  const { connections, createAndRedirectToProvider } = useConnections()

  const amazonConnections = connections.filter(
    (el) =>
      (el.status === ConnectionResponseStatusEnum.Connected ||
        el.status === ConnectionResponseStatusEnum.Connecting) &&
      el.systemId === platforms.AmazonV2.systemId
  )

  const getShopsAmountByRegion = (
    region: "Europe" | "North America" | "Far East"
  ) => {
    return amazonConnections.filter((el) => el.displayName?.includes(region))
      .length
  }

  const onClick = async (countryCode: "US" | "UK" | "AU") => {
    await createAndRedirectToProvider.mutateAsync({
      platform: platforms.AmazonV2,
      countryCode,
    })
  }

  const REGION_CARDS: {
    region: string
    countries: string[]
    code: "US" | "UK" | "AU"
  }[] = [
    {
      region: t("northAmerica"),
      countries: AMAZON_ELIGIBLE_REGIONS[AmazonRegionsEnum.NorthAmerica],
      code: "US",
    },
    {
      region: t("europe"),
      countries: AMAZON_ELIGIBLE_REGIONS[AmazonRegionsEnum.Europe],
      code: "UK",
    },
    {
      region: t("farEast"),
      countries: AMAZON_ELIGIBLE_REGIONS[AmazonRegionsEnum.FarEast],
      code: "AU",
    },
  ]

  return (
    <>
      {REGION_CARDS.map((card) => (
        <RegionCard
          key={card.region}
          title={card.region}
          countries={card.countries}
          onClick={async () => {
            await onClick(card.code)
          }}
          amountConnected={getShopsAmountByRegion(
            card.region as "North America" | "Europe" | "Far East"
          )}
        />
      ))}
    </>
  )
}

export default AmazonRegionCards
