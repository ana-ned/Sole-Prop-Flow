import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import ListItem from "../../../../components/UI/ListItem"
import MainBanner from "../../../../components/UI/MainBanner"
import { MissingDataCheck } from "../../hooks/useMissingDataChecks"

const MissingDataBanner = ({ checks }: { checks: MissingDataCheck[] }) => {
  const { t } = useTranslation("dashboard", {
    keyPrefix: "banners.missingData",
  })

  return (
    <MainBanner
      theme="dark"
      title={
        <div className="text-left">
          <Typography type="h4" color="white" className="mb-4">
            {t("title")}
          </Typography>
          <Typography color="white">
            <SanitizedHtml as="span" content={t("content")} />
          </Typography>
        </div>
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
              {t(`checks.${item.type}`)}
            </ListItem>
          ))}
        </div>
      </div>
    </MainBanner>
  )
}

export default MissingDataBanner
