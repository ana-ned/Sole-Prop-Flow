import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import Typography from "../../../../components/Basic/Typography"
import Chip from "../../../../components/UI/Chip"
import useAgreementDetails from "../../../../hooks/useAgreementDetails"
import useLateFeesSummary from "../../../../hooks/useLateFeesSummary"
import useLineOfCreditAgreements from "../../../../hooks/useLineOfCreditAgreements"
import {
  DetailedAgreementDTO,
  DetailedAgreementDTODebtProviderEnum,
  DetailedAgreementDTODetailedProductTypeEnum,
  DetailedAgreementDTOProductTypeEnum,
  DetailedAgreementDTOStatusEnum,
} from "../../../../services/api/agreements"
import { DateFormat, formatDate } from "../../../../utils/date"
import { format, separate } from "../../../../utils/money"

const AgreementDetails = ({
  agreement,
}: {
  agreement: DetailedAgreementDTO
}) => {
  const { t } = useTranslation("agreements", { keyPrefix: "AgreementListItem" })
  const { locAgreements } = useLineOfCreditAgreements()
  const locAgreement = locAgreements.data?.content?.find(
    (el) => el.agreementId!.id === agreement.id
  )!

  const getAgreementTitle = (agreement: DetailedAgreementDTO) => {
    if (agreement.productType === DetailedAgreementDTOProductTypeEnum.Fixed) {
      return t("termLoan")
    }

    if (
      agreement.detailedProductType ===
      DetailedAgreementDTODetailedProductTypeEnum.LineOfCreditInterestRate
    ) {
      return t("lineOfCredit")
    }

    if (agreement.productType === DetailedAgreementDTOProductTypeEnum.Rbf) {
      return t("cashAdvance")
    }

    return t("revenueLoan")
  }

  const getAgreementAmount = (agreement: DetailedAgreementDTO) => {
    if (
      agreement.detailedProductType ===
      DetailedAgreementDTODetailedProductTypeEnum.LineOfCreditInterestRate
    ) {
      return `${format(locAgreement.limit?.amount || 0, agreement.currency!, {
        minimumFractionDigits: 0,
      })} ${t("facilityLimit")}`
    }

    return !agreement.advanceAmount || agreement.advanceAmount === 0
      ? t("balanceTransfer")
      : t("advance", {
          value: format(agreement.advanceAmount, agreement.currency!, {
            minimumFractionDigits: 0,
          }),
        })
  }

  const getSellersfiAccountType = (agreement: DetailedAgreementDTO) => {
    if (
      agreement.productType === DetailedAgreementDTOProductTypeEnum.InterestRate
    ) {
      return t("sellersfiAccountType.termLoan")
    }

    if (agreement.productType === DetailedAgreementDTOProductTypeEnum.Rbf) {
      return t("sellersfiAccountType.commercePay")
    }

    return t("sellersfiAccountType.capitalLoan")
  }

  if (agreement.debtProvider === DetailedAgreementDTODebtProviderEnum.Marcus) {
    return (
      <Typography type="smallCopy" color="neutral-800">
        {t("fromGoldman")}
      </Typography>
    )
  }

  if (
    agreement.debtProvider === DetailedAgreementDTODebtProviderEnum.Fasanara
  ) {
    return (
      <Typography type="smallCopy" color="neutral-800">
        {t("transferredFrom", {
          sourceType: getSellersfiAccountType(agreement),
        })}
        - {getAgreementAmount(agreement)}
      </Typography>
    )
  }

  return (
    <Typography type="smallCopy" color="neutral-800">
      {getAgreementTitle(agreement)} - {getAgreementAmount(agreement)}
    </Typography>
  )
}

const AgreementListItem = ({
  agreement,
  context = "default",
  withSeparator,
}: {
  agreement: DetailedAgreementDTO
  context?: "default" | "early-repayment"
  withSeparator?: boolean
}) => {
  const { t } = useTranslation("agreements", { keyPrefix: "AgreementListItem" })
  const agreementDetails = useAgreementDetails(agreement)
  const { lateFeesSummaryQuery, lateFeesApplicable } = useLateFeesSummary({
    agreementId: agreement.id,
  })
  const { locAgreements } = useLineOfCreditAgreements()

  const totalRepaid = agreementDetails.getTotalRepaid()
  const leftToRepay = agreementDetails.getLeftToRepay()

  const { amount, currency } =
    agreement.status === DetailedAgreementDTOStatusEnum.Closed
      ? totalRepaid
      : leftToRepay

  if (Number.isNaN(amount) || !currency || locAgreements.isLoading) {
    return null
  }

  const separatedAmount = separate(amount, currency)

  const lateFeeAmount = lateFeesApplicable
    ? lateFeesSummaryQuery.data?.totalChargedAmount || 0
    : 0

  return (
    <>
      {withSeparator && <div className="h-1 w-full bg-[#f7f4f2]" />}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline">
            <Typography type="h5" color="neutral-800">
              {separatedAmount.whole}
            </Typography>
            <Typography type="smallCopy" color="neutral-800">
              {separatedAmount.fraction}
            </Typography>
          </div>
          <Typography type="smallCopy" color="neutral-800">
            {agreement.status === DetailedAgreementDTOStatusEnum.Closed
              ? t("totalRepaid")
              : t("totalBalance")}{" "}
            {lateFeesSummaryQuery.data &&
              lateFeesApplicable &&
              context === "default" && (
                <Chip
                  color="danger"
                  className="ml-2 !inline-block"
                  label={`inc ${format(lateFeeAmount, agreement.currency!)}`}
                />
              )}
          </Typography>
          <AgreementDetails agreement={agreement} />
          <Typography type="smallCopy" color="neutral-800">
            {t("activated", {
              date: formatDate(agreement.activationDate!, {
                format: DateFormat.SHORT,
              }),
            })}
          </Typography>
        </div>
        <div>
          <Button
            variant="primary"
            href={
              context === "early-repayment"
                ? `/loans/early-repayments/${agreement.id}`
                : `/loans/${agreement.id}`
            }
          >
            {context === "early-repayment" ? t("repayLoan") : t("viewLoan")}
          </Button>
        </div>
      </div>
    </>
  )
}

export default AgreementListItem
