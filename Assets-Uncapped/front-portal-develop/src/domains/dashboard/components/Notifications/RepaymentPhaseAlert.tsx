import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router"
import Typography from "../../../../components/Basic/Typography"
import Alert from "../../../../components/UI/Alert"
import { RepaymentPhaseAlertData } from "../../../../hooks/useRepaymentPhaseAlert"
import { DateFormat, formatDate, intToMonth } from "../../../../utils/date"
import { titleCase } from "../../../../utils/string"

const RepaymentPhaseAlert = ({
  data,
}: {
  data: Pick<
    RepaymentPhaseAlertData,
    | "activeAgreement"
    | "firstRepaymentPhase"
    | "futureRepayment"
    | "difference"
    | "partnershipName"
    | "faqUrl"
  >
}) => {
  const {
    activeAgreement,
    firstRepaymentPhase,
    futureRepayment,
    difference,
    partnershipName,
    faqUrl,
  } = data
  const { t } = useTranslation("dashboard", {
    keyPrefix: "notifications.repaymentPhase",
  })

  if (difference >= 0 && difference < 90) {
    return (
      <Alert type="info" showIcon={false} title={t("future.title")}>
        <div className="flex flex-col gap-y-4">
          <Typography>
            <Trans
              ns="dashboard"
              i18nKey="notifications.repaymentPhase.future.increasing"
              values={{
                date: formatDate(firstRepaymentPhase!.scheduledDate!, {
                  format: DateFormat.SPLIT,
                }),
                source: partnershipName,
              }}
              components={{
                href: (
                  <Link
                    to="/profile/documents"
                    state={{ initialTab: "LoanDocuments" }}
                  />
                ),
              }}
            />
          </Typography>
          <Typography>
            {futureRepayment
              ? t("future.frequency", {
                  date: formatDate(futureRepayment.scheduledDate!, {
                    format: DateFormat.SPLIT,
                  }),
                  period: titleCase(activeAgreement!.repayments!.frequency),
                })
              : t("future.frequencyNoUpcoming", {
                  period: titleCase(activeAgreement!.repayments!.frequency),
                })}
          </Typography>
          <Typography>
            <Trans
              ns="dashboard"
              i18nKey="notifications.repaymentPhase.future.faq"
              components={{
                href: (
                  // eslint-disable-next-line jsx-a11y/anchor-has-content
                  <a href={faqUrl!} target="_blank" rel="noreferrer" />
                ),
              }}
            />
          </Typography>
        </div>
      </Alert>
    )
  }

  if (difference < 0 && difference >= -90) {
    return (
      <Alert
        type="normal"
        showIcon={false}
        title={t("past.title", {
          date: intToMonth(firstRepaymentPhase!.scheduledDate!.getMonth()),
        })}
      >
        <div className="flex flex-col gap-y-4">
          <Typography>
            <Trans
              ns="dashboard"
              i18nKey="notifications.repaymentPhase.past.increasing"
              values={{
                month: intToMonth(
                  firstRepaymentPhase!.scheduledDate!.getMonth()
                ),
                source: partnershipName,
              }}
              components={{
                href: (
                  <Link
                    to="/profile/documents"
                    state={{ initialTab: "LoanDocuments" }}
                  />
                ),
              }}
            />
          </Typography>
          <Typography>
            {t("past.frequency", {
              period: titleCase(activeAgreement!.repayments!.frequency),
            })}
          </Typography>
          <Typography>
            <Trans
              ns="dashboard"
              i18nKey="notifications.repaymentPhase.past.faq"
              components={{
                href: (
                  // eslint-disable-next-line jsx-a11y/anchor-has-content
                  <a href={faqUrl!} target="_blank" rel="noreferrer" />
                ),
              }}
            />
          </Typography>
        </div>
      </Alert>
    )
  }

  return null
}

export default RepaymentPhaseAlert
