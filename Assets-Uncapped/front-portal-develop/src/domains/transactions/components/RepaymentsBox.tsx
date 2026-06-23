import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar01SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../components/Basic/BoxIcon"
import SanitizedHtml from "../../../components/Basic/SanitizedHtml"
import Typography from "../../../components/Basic/Typography"
import Alert from "../../../components/UI/Alert"
import Loader from "../../../components/UI/Loader"
import Widget from "../../../components/UI/Widget"
import useAgreements from "../../../hooks/useAgreements"
import {
  DetailedAgreementDTO,
  DetailedAgreementDTOProductTypeEnum,
  RepaymentsFrequencyEnum,
  Transaction,
  TransactionStatusEnum,
} from "../../../services/api/agreements"
import { ReactComponent as EventIcon } from "../../../svgs/event.svg"
import { DateFormat, formatDate } from "../../../utils/date"
import { format, formatAsPercentage } from "../../../utils/money"
import { titleCase } from "../../../utils/string"
import { useTransactionDetails } from "../hooks/useTransactionDetails"
import useUpcomingRepayments from "../hooks/useUpcomingRepayments"
import { formatLoanInfo } from "../utils/transacations"

const RepaymentItem = ({
  repayment,
  agreements,
}: {
  repayment: Transaction
  agreements?: DetailedAgreementDTO[]
}) => {
  const { t } = useTranslation("transactions", {
    keyPrefix: "transactionsV2.RepaymentsBox",
  })

  const { data } = useTransactionDetails({
    transactionId: repayment.id,
    agreementId: repayment.account.id,
  })

  const agreement = agreements?.find((a) => a.id === repayment.account.id)

  return (
    <div className="space-y-1">
      {agreement?.productType === DetailedAgreementDTOProductTypeEnum.Rbf ? (
        <>
          <div className="col-span-2 flex justify-between">
            <Typography type="bodyMedium">
              {formatDate(new Date(repayment.operationScheduledDate!), {
                format: DateFormat.SHORT,
              })}
            </Typography>
            <Typography type="bodyMedium">
              {t("rbf.sales", {
                percentage: formatAsPercentage(
                  (agreement.repayments?.revenueShare || 0) * 100,
                  0
                ),
                frequency: titleCase(
                  agreement.repayments?.frequency ===
                    RepaymentsFrequencyEnum.Every14Days
                    ? "biweekly"
                    : agreement.repayments?.frequency
                ).toLocaleLowerCase(),
              })}
            </Typography>
          </div>
          <div className="col-span-2">
            <Typography type="smallCopy" color="neutral-800">
              {formatLoanInfo(agreement, true)}
            </Typography>
          </div>
        </>
      ) : (
        <>
          <div className="col-span-2 flex justify-between">
            <Typography type="bodyMedium">
              {formatDate(new Date(repayment.operationScheduledDate!), {
                format: DateFormat.SHORT,
              })}
            </Typography>
            <Typography type="bodyMedium">
              {format(
                repayment.transactionAmount.amount ?? 0,
                repayment.transactionAmount.currency!
              )}
            </Typography>
          </div>
          <div className="col-span-2">
            <Typography type="smallCopy" color="neutral-800">
              {!!agreement && formatLoanInfo(agreement, true)}
            </Typography>
          </div>
        </>
      )}
      {data?.status === TransactionStatusEnum.Pending &&
        data.repaymentDetails?.leftToRepay !== undefined &&
        data.repaymentDetails.leftToRepay > 0 &&
        data.repaymentDetails.repaid !== undefined &&
        data.repaymentDetails.repaid > 0 && (
          <div className="col-span-2">
            <Alert className="!p-2">
              <Typography type="smallCopy" color="neutral-700">
                <SanitizedHtml
                  as="span"
                  content={t("earlyRepaymentProcessing", {
                    repaidAmount: format(
                      data.repaymentDetails.repaid,
                      repayment.transactionAmount.currency!
                    ),
                    leftToRepay: format(
                      data.repaymentDetails.leftToRepay,
                      repayment.transactionAmount.currency!
                    ),
                  })}
                />
              </Typography>
            </Alert>
          </div>
        )}
      {data?.status === TransactionStatusEnum.Pending &&
        data.repaymentDetails?.leftToRepay !== undefined &&
        data.repaymentDetails.leftToRepay === 0 &&
        data.repaymentDetails.repaid !== undefined &&
        data.repaymentDetails.repaid > 0 && (
          <div className="col-span-2">
            <Alert className="!p-2">
              <Typography type="smallCopy" color="neutral-700">
                <SanitizedHtml
                  as="span"
                  content={t("earlyRepaymentProcessingFull", {
                    repaidAmount: format(
                      data.repaymentDetails.repaid,
                      repayment.transactionAmount.currency!
                    ),
                  })}
                />
              </Typography>
            </Alert>
          </div>
        )}
      {data?.status === TransactionStatusEnum.PartiallyPaid &&
        data.repaymentDetails?.leftToRepay !== undefined &&
        data.repaymentDetails.leftToRepay > 0 &&
        data.repaymentDetails.repaid !== undefined &&
        data.repaymentDetails.repaid > 0 && (
          <div className="col-span-2">
            <Alert type="success" className="!p-2">
              <Typography type="smallCopy" color="neutral-700">
                <SanitizedHtml
                  as="span"
                  content={t("earlyRepaymentSuccess", {
                    repaidAmount: format(
                      data.repaymentDetails.repaid,
                      repayment.transactionAmount.currency!
                    ),
                    leftToRepay: format(
                      data.repaymentDetails.leftToRepay,
                      repayment.transactionAmount.currency!
                    ),
                  })}
                />
              </Typography>
            </Alert>
          </div>
        )}
      {data?.status === TransactionStatusEnum.Failed &&
        data.repaymentDetails?.leftToRepay !== undefined &&
        data.repaymentDetails.leftToRepay > 0 && (
          <div className="col-span-2">
            <Alert type="warning" className="!p-2">
              <Typography type="smallCopy" color="neutral-700">
                <SanitizedHtml as="span" content={t("earlyRepaymentFailed")} />
              </Typography>
            </Alert>
          </div>
        )}
    </div>
  )
}

const RepaymentsBox = ({ agreementId }: { agreementId?: string }) => {
  const { t } = useTranslation("transactions", {
    keyPrefix: "transactionsV2.RepaymentsBox",
  })
  const agreements = useAgreements()
  const { upcomingRepayments, isLoading } = useUpcomingRepayments({
    agreementId,
  })
  const nextRepayment = upcomingRepayments?.[0]

  if (isLoading || agreements.isLoading) {
    return (
      <div className="shadow-light-sm border-card flex items-center justify-center rounded-xl bg-white p-4">
        <Loader size="xs" />
      </div>
    )
  }

  return (
    <Widget
      title={t("nextUpcoming", { count: nextRepayment ? 1 : 0 })}
      icon={
        <BoxIcon
          severity="accent-2"
          icon={<HugeiconsIcon icon={Calendar01SolidStandard} />}
        />
      }
    >
      <div>
        {nextRepayment ? (
          <div className="flex flex-col gap-4">
            <RepaymentItem
              repayment={nextRepayment}
              agreements={agreements.data}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 p-4 text-neutral-700">
            <EventIcon />
            <Typography type="body" color="neutral-700">
              {t("noUpcomingRepayments")}
            </Typography>
          </div>
        )}
      </div>
    </Widget>
  )
}

export default RepaymentsBox
