import { HugeiconsIcon } from "@hugeicons/react"
import { Alert01SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../components/Basic/BoxIcon"
import Button from "../../../components/Basic/Button"
import SanitizedHtml from "../../../components/Basic/SanitizedHtml"
import Typography from "../../../components/Basic/Typography"
import Alert from "../../../components/UI/Alert"
import Chip from "../../../components/UI/Chip"
import Loader from "../../../components/UI/Loader"
import Widget from "../../../components/UI/Widget"
import useAgreements from "../../../hooks/useAgreements"
import useHubSpotChat from "../../../hooks/useHubSpotChat"
import useLateFeesSummary from "../../../hooks/useLateFeesSummary"
import { RepaymentsTypeEnum } from "../../../services/api/agreements"
import { format, separate } from "../../../utils/money"
import { titleCase } from "../../../utils/string"

const OverdueBox = ({
  agreementId,
  summary,
}: {
  agreementId?: string
  summary?: boolean
}) => {
  const { t } = useTranslation("transactions", { keyPrefix: "OverdueBox" })
  const lateFeesSummary = useLateFeesSummary({
    agreementId,
  })
  const { openChat } = useHubSpotChat()
  const agreements = useAgreements()
  const agreement = agreements.data?.find((a) => a.id === agreementId)

  const overdueAmount =
    lateFeesSummary.lateFeesSummaryQuery.data?.totalOverdueRepayments ?? 0

  const containerClass = summary
    ? "flex flex-col gap-1 items-center"
    : "shadow-light-sm border-card flex flex-col gap-1 rounded-lg bg-white p-4"

  if (lateFeesSummary.lateFeesSummaryQuery.isLoading) {
    return (
      <div className={containerClass}>
        <Loader size="xs" />
      </div>
    )
  }

  const Component = summary ? "div" : Widget

  return (
    <Component
      title={summary ? "" : t("title")}
      icon={
        <BoxIcon
          severity="accent-5"
          icon={<HugeiconsIcon icon={Alert01SolidStandard} />}
        />
      }
      {...(summary
        ? {
            className: containerClass,
          }
        : {})}
    >
      {summary && (
        <Typography type="smallCopy">{titleCase(t("totalOverdue"))}</Typography>
      )}
      <div>
        <div className="flex flex-col gap-2">
          {summary ? (
            <>
              <Typography type="h5" color="neutral-800" className="!font-sans">
                {
                  separate(
                    overdueAmount,
                    lateFeesSummary.lateFeesSummaryQuery.data?.currency!
                  ).whole
                }
                <Typography
                  tag="span"
                  color="neutral-800"
                  className="!font-sans"
                >
                  {
                    separate(
                      overdueAmount,
                      lateFeesSummary.lateFeesSummaryQuery.data?.currency!
                    ).fraction
                  }
                </Typography>
              </Typography>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Typography type="h6" color="error-700">
                {format(
                  overdueAmount,
                  lateFeesSummary.lateFeesSummaryQuery.data?.currency!
                )}
              </Typography>
              <div>
                <Typography type="smallCopy" color="error-700">
                  {t("totalOverdue")}
                </Typography>
              </div>
            </div>
          )}
          {!summary && (
            <>
              <Alert type="danger" className="!p-2">
                <Typography type="smallCopy" color="neutral-700">
                  <SanitizedHtml
                    as="span"
                    content={
                      !!agreement &&
                      agreement.repayments?.type ===
                        RepaymentsTypeEnum.Automatic
                        ? t("automaticSettlement")
                        : t("manualSettlement", {
                            amount: format(
                              overdueAmount,
                              lateFeesSummary.lateFeesSummaryQuery.data
                                ?.currency!
                            ),
                          })
                    }
                  />
                </Typography>
              </Alert>
              {(!agreement ||
                agreement.repayments?.type !==
                  RepaymentsTypeEnum.Automatic) && (
                <Button
                  type="button"
                  variant="link"
                  className="!ml-auto !block !text-sm"
                  onClick={() => {
                    openChat()
                  }}
                >
                  {t("settleOverdueAmount")}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      {summary && <Chip color="danger" label={t("overdue")} />}
    </Component>
  )
}

export default OverdueBox
