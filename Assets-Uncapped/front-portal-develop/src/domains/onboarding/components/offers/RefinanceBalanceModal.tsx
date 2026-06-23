import { useMemo } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarAward02SolidSharp } from "@hugeicons-pro/core-solid-sharp"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import Button from "../../../../components/Basic/Button"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import Card from "../../../../components/UI/Card"
import Modal from "../../../../components/UI/Modal"
import Widget from "../../../../components/UI/Widget"
import useAgreements from "../../../../hooks/useAgreements"
import useDevice from "../../../../hooks/useDevice"
import useLineOfCreditAgreements from "../../../../hooks/useLineOfCreditAgreements"
import {
  DetailedAgreementDTODetailedProductTypeEnum,
  AggregatedBalanceDTO,
} from "../../../../services/api/agreements"
import { ReactComponent as CloseIcon } from "../../../../svgs/close.svg"
import { formatDate, DateFormat } from "../../../../utils/date"
import { format } from "../../../../utils/money"
import { getLoanProductTypeName } from "../../../transactions/utils/transacations"
import { RefinanceAgreementFee } from "../../hooks/useRefinanceAgreementsFees"

const RefinanceBalanceModal = ({
  isOpen,
  onClose,
  refinancedAgreementIds,
  balancesData,
  feesData,
  balanceToPayOffNet,
}: {
  isOpen: boolean
  onClose: () => void
  refinancedAgreementIds: string[]
  balancesData?: AggregatedBalanceDTO
  feesData: {
    feesMap: Record<string, number>
    totalFeesWaived: number
    agreements: RefinanceAgreementFee[]
  }
  balanceToPayOffNet: number
}) => {
  const { isMobile } = useDevice()
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers.RefinanceBalanceModal",
  })
  useTranslation("transactions")
  const { data: agreementsData } = useAgreements()
  const { locAgreements } = useLineOfCreditAgreements()

  const currency = balancesData?.aggregatedBalance?.currency

  const agreementDetails = useMemo(() => {
    if (!balancesData || !agreementsData) return []

    return refinancedAgreementIds
      .map((agreementId) => {
        const agreementBalance = balancesData.balances?.find(
          (balance) => balance.agreementId === agreementId
        )
        const agreement = agreementsData.find((a) => a.id === agreementId)
        const balance =
          (agreementBalance?.values?.CURRENT_TO_REPAY || 0) -
          (agreementBalance?.values?.COLLECTION_PENDING || 0)

        return agreement
          ? {
              id: agreementId,
              agreement,
              balance,
            }
          : null
      })
      .filter((item) => item !== null)
  }, [balancesData, agreementsData, refinancedAgreementIds])

  // Check if any refinanced agreements are LOC-type
  const hasLocAgreements = useMemo(() => {
    if (!agreementsData) return false
    return refinancedAgreementIds.some((agreementId) => {
      const agreement = agreementsData.find((a) => a.id === agreementId)
      return (
        agreement?.detailedProductType ===
        DetailedAgreementDTODetailedProductTypeEnum.LineOfCreditInterestRate
      )
    })
  }, [agreementsData, refinancedAgreementIds])

  // If we have LOC agreements and LOC data is still loading, don't show the modal
  if (hasLocAgreements && locAgreements.isLoading) {
    return null
  }

  if (!balancesData || !currency) {
    return null
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      className="!p-0 md:!w-[554px]"
    >
      <div className="p-4 sm:p-0">
        {isMobile && (
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            className="mb-2 ml-auto"
          >
            <CloseIcon />
          </Button>
        )}
        <Widget
          title={t("title")}
          icon={
            <BoxIcon
              severity="accent-9"
              icon={<HugeiconsIcon icon={StarAward02SolidSharp} />}
            />
          }
        >
          <SanitizedHtml
            as="p"
            content={t("description", {
              date: formatDate(new Date(), { format: DateFormat.MID }),
            })}
            className="mb-4"
          />
          <Card spacing="small">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2 px-1.5 py-1">
                <Typography type="bodyTitle">{t("existingBalance")}</Typography>
                <Typography type="bodyTitle">
                  {format(balanceToPayOffNet, currency, {
                    minimumFractionDigits: 0,
                  })}
                </Typography>
              </div>

              {agreementDetails.map(({ id, agreement, balance }) => (
                <div key={id} className="pl-6">
                  <div className="flex justify-between gap-2 py-1 pr-1.5">
                    <div>
                      <Typography type="body">
                        {getLoanProductTypeName(agreement, true)}
                      </Typography>
                      <Typography type="smallCopy">
                        {t("loanDetails", {
                          amount: format(
                            agreement.detailedProductType ===
                              DetailedAgreementDTODetailedProductTypeEnum.LineOfCreditInterestRate
                              ? (locAgreements.data?.content?.find(
                                  (loc) => loc.agreementId?.id === agreement.id
                                )?.maxCreditLimit ?? agreement.advanceAmount!)
                              : agreement.advanceAmount!,
                            agreement.currency!,
                            {
                              minimumFractionDigits: 0,
                            }
                          ),
                          date: formatDate(
                            new Date(agreement.activationDate!),
                            {
                              customFormat: "MMM yyyy",
                            }
                          ),
                        })}
                      </Typography>
                    </div>
                    <Typography type="body">
                      {format(balance, currency, {
                        minimumFractionDigits: 0,
                      })}
                    </Typography>
                  </div>
                </div>
              ))}

              {feesData.totalFeesWaived > 0 && (
                <div className="pl-6">
                  <div className="flex items-center justify-between gap-2 py-1 pr-1.5">
                    <Typography type="body">{t("feesWaived")}</Typography>
                    <Typography type="body">
                      -{" "}
                      {format(feesData.totalFeesWaived, currency, {
                        minimumFractionDigits: 0,
                      })}
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Widget>
      </div>
    </Modal>
  )
}

export default RefinanceBalanceModal
