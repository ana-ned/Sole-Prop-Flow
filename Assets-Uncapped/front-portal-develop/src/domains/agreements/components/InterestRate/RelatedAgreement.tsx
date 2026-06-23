import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import Notice from "../../../../components/UI/Notice"
import {
  BalanceWithAgreementStatusDTO,
  DetailedAgreementDTO,
  DetailedAgreementDTODebtProviderEnum,
  DetailedAgreementDTOReasonForClosingEnum,
} from "../../../../services/api/agreements"
import { format } from "../../../../utils/money"

const getTranslationKey = (
  agreement: DetailedAgreementDTO,
  isRefinanced: boolean
):
  | "transferredToLoan"
  | "transferredFromGoldman"
  | "transferredFromLoan"
  | "transferredFromSellersfi" => {
  if (isRefinanced) {
    return "transferredToLoan"
  }

  if (agreement.debtProvider === DetailedAgreementDTODebtProviderEnum.Marcus) {
    return "transferredFromGoldman"
  }

  if (
    agreement.debtProvider === DetailedAgreementDTODebtProviderEnum.Fasanara
  ) {
    return "transferredFromSellersfi"
  }

  return "transferredFromLoan"
}

const RelatedAgreement = ({
  agreement,
  balance,
}: {
  agreement: DetailedAgreementDTO
  balance: BalanceWithAgreementStatusDTO
}) => {
  const { t } = useTranslation("agreements", {
    keyPrefix: "AgreementLeftToRepayChart",
  })

  if (
    !agreement.agreementChildId &&
    agreement.agreementParentIds?.length === 0
  ) {
    return null
  }

  const isRefinanced =
    agreement.reasonForClosing ===
    DetailedAgreementDTOReasonForClosingEnum.Refinanced
  const isRestructured = [
    DetailedAgreementDTOReasonForClosingEnum.Restructured,
    DetailedAgreementDTOReasonForClosingEnum.MarcusImportedAgreement,
    DetailedAgreementDTOReasonForClosingEnum.SellersfiImportedAgreement,
  ].includes(agreement.reasonForClosing as any)

  const linkedAgreementId =
    isRefinanced || isRestructured
      ? agreement.agreementChildId
      : agreement.agreementParentIds?.[0]

  if (!linkedAgreementId) {
    return null
  }

  return (
    <Notice
      variant="info"
      action={
        <Button
          variant="secondary"
          size="sm"
          href={`/loans/${linkedAgreementId}`}
          className="-my-1 -mr-1"
        >
          {t("viewLoan")}
        </Button>
      }
    >
      {isRestructured
        ? t("restructuredToLoan")
        : t(getTranslationKey(agreement, isRefinanced), {
            value: format(
              balance.values?.REPAYABLE_PREV || 0,
              balance.currency!
            ),
          })}
    </Notice>
  )
}

export default RelatedAgreement
