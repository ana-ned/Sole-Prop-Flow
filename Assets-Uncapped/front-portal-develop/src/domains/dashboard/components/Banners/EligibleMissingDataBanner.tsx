import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import ListItem from "../../../../components/UI/ListItem"
import MainBanner from "../../../../components/UI/MainBanner"
import { format } from "../../../../utils/money"
import { MissingDataCheck } from "../../hooks/useMissingDataChecks"

const EligibleMisingDataBanner = ({
  amount,
  currency,
  checks,
  title,
  content,
}: {
  amount: number
  currency: string
  checks: MissingDataCheck[]
  title?: string
  content?: string
}) => {
  const { t } = useTranslation("dashboard", {
    keyPrefix: "banners",
  })

  return (
    <MainBanner
      theme="dark"
      title={
        <>
          <Typography color="white" type="smallCopy">
            {title || t("eligibleMissingData.title")}
          </Typography>
          <p className="font-heading my-1 text-5xl font-bold text-white">
            {format(amount, currency, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
          <Typography color="white" type="body" className="mt-4">
            <SanitizedHtml
              as="span"
              content={content || t("eligibleMissingData.content")}
            />
          </Typography>
        </>
      }
    >
      <div className="bg-surface-elevated-1 shadow-light-sm border-card rounded-card-md p-2">
        <div className="flex flex-col gap-2">
          {checks.map((item) => (
            <ListItem
              shadow
              to={item.url}
              key={item.type}
              icon={
                <BoxIcon
                  severity="accent-5"
                  icon={
                    typeof item.icon === "function" ? (
                      <item.icon />
                    ) : (
                      <HugeiconsIcon icon={item.icon} />
                    )
                  }
                />
              }
            >
              {t(`missingData.checks.${item.type}`)}
            </ListItem>
          ))}
        </div>
      </div>
    </MainBanner>
  )
}

export default EligibleMisingDataBanner
