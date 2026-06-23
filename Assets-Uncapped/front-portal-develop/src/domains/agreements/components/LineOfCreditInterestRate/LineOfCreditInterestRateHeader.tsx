import { useState } from "react"
import { Close } from "@material-ui/icons"
import { differenceInDays, isPast } from "date-fns"
import { Trans, useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import Button from "../../../../components/Basic/Button"
import Typography from "../../../../components/Basic/Typography"
import MissingLocDocumentsModal from "../../../../components/Shared/MissingLocDocumentsModal"
import AmountBar from "../../../../components/UI/AmountBar"
import Chip from "../../../../components/UI/Chip"
import MainBanner from "../../../../components/UI/MainBanner"
import Modal from "../../../../components/UI/Modal"
import useDevice from "../../../../hooks/useDevice"
import useRevenueRecalculation from "../../../../hooks/useRevenueRecalculation"
import { useTracking } from "../../../../hooks/useTracking"
import {
  BalanceWithAgreementStatusDTO,
  DetailedAgreementDTO,
  DetailedAgreementDTOStatusEnum,
  LineOfCreditResponseStatusEnum,
} from "../../../../services/api/agreements"
import { DEFAULT_CURRENCY } from "../../../../utils/currency"
import { format, separate } from "../../../../utils/money"
import { upperCaseFirstLetter } from "../../../../utils/string"
import useMissingDocuments from "../../../dashboard/hooks/useMissingDocuments"
import CreditLimitCalculationWidgetContainer from "../../../line-of-credit/components/draw/CreditLimitCalculationWidgetContainer"
import { canRequestDraw } from "../../../line-of-credit/utils"
import useAgreementBalance from "../../hooks/useAgreementBalance"
import useLedgerBalance from "../../hooks/useLedgerBalance"
import useLocAgreement from "../../hooks/useLocAgreement"

const LineOfCreditInterestRateHeader = ({
  agreement,
  balance,
}: {
  agreement: DetailedAgreementDTO
  balance: BalanceWithAgreementStatusDTO
}) => {
  const { t } = useTranslation("agreements", {
    keyPrefix: "common",
  })
  const { t: tDashboard } = useTranslation("dashboard", {
    keyPrefix: "widgets.lineOfCredit",
  })
  const { isMobile } = useDevice()
  const { trackEvent } = useTracking()
  const navigate = useNavigate()
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false)
  const [isCreditLimitModalOpen, setIsCreditLimitModalOpen] = useState(false)

  const currency = balance.currency ?? agreement.currency ?? DEFAULT_CURRENCY
  const ledgerBalance = useLedgerBalance({ agreementId: agreement.id! })
  const agreementBalance = useAgreementBalance(agreement, balance)

  const outstandingAmount =
    (ledgerBalance.data?.currentFees || 0) +
    (ledgerBalance.data?.currentInterest || 0) +
    (ledgerBalance.data?.currentPrincipal || 0)

  const isClosed = agreement.status === DetailedAgreementDTOStatusEnum.Closed

  const outstanding = separate(outstandingAmount, currency)
  const repaid = separate(agreementBalance.repaid, currency)

  const status = agreement.status
    ? upperCaseFirstLetter(agreement.status.toLowerCase())
    : ""

  const locData = useLocAgreement(agreement.id)
  const documents = useMissingDocuments()

  const { data: recalculationData } = useRevenueRecalculation({
    agreementId: locData?.agreementId?.id,
    enabled: !!locData?.agreementId?.id,
  })

  const showAvailableCredit =
    locData &&
    !(locData.drawDownPeriodEndDate && isPast(locData.drawDownPeriodEndDate))

  const locCurrency = locData?.limit?.currency ?? currency
  const drawnAmount = ledgerBalance.data?.currentPrincipal || 0
  const requestedAmount = locData?.balance?.pending?.amount || 0
  const maxDrawAmount = locData?.balance?.available?.amount || 0
  const growToUnlock =
    (locData?.maxCreditLimit || 0) - (locData?.currentAvailableCreditLimit || 0)
  const maxCreditLimit = locData?.maxCreditLimit || 0

  const daysUntilRecalculation = recalculationData?.nextRecalculationDate
    ? differenceInDays(
        new Date(recalculationData.nextRecalculationDate),
        new Date()
      )
    : null

  return (
    <>
      <div className="relative">
        <MainBanner
          title={
            <>
              <Typography type="h2" color="white" className="text-center">
                {isClosed ? repaid.whole : outstanding.whole}
                <Typography type="h5" tag="span" color="white">
                  {isClosed ? repaid.fraction : outstanding.fraction}
                </Typography>
              </Typography>
              <Typography
                type="bodyMedium"
                className="text-center"
                color="white"
              >
                {isClosed ? t("totalRepaid") : t("totalOutstanding")}
              </Typography>
            </>
          }
        >
          {(isClosed || !showAvailableCredit) && (
            <AmountBar
              currency={currency}
              segments={
                isClosed
                  ? [
                      {
                        amount: agreementBalance.repaid,
                        label: t("paid"),
                        color: "brand-600",
                        emphasis: true,
                      },
                    ]
                  : [
                      {
                        amount: agreementBalance.repaid,
                        label: t("paid"),
                        color: "brand-600",
                        emphasis: true,
                      },
                      {
                        amount: agreementBalance.leftToRepay,
                        label: t("leftToPay"),
                        color: "brand-200",
                        stripeColor: "brand-600",
                      },
                    ]
              }
            />
          )}
          {!isClosed && showAvailableCredit && (
            <div className="flex flex-col gap-4">
              <div className="rounded-card-md flex flex-col gap-5 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-end gap-2">
                    <Typography type="h5" color="neutral-900">
                      {format(maxDrawAmount, locCurrency, {
                        minimumFractionDigits: 0,
                      })}{" "}
                      <Typography
                        type="tableHeader"
                        tag="span"
                        color="neutral-600"
                      >
                        /{" "}
                        {format(maxCreditLimit, locCurrency, {
                          minimumFractionDigits: 0,
                        })}
                      </Typography>
                    </Typography>
                    <Typography type="smallCopy" color="neutral-900">
                      {tDashboard("availableToDraw")}
                    </Typography>
                  </div>
                  <Button
                    type="button"
                    disabled={!canRequestDraw(locData)}
                    onClick={async () => {
                      if (
                        locData.status ===
                        LineOfCreditResponseStatusEnum.WaitingForDocuments
                      ) {
                        setDocumentsModalOpen(true)
                      } else {
                        trackEvent({
                          category: "dashboard",
                          name: "widget-line-of-credit-new-draw",
                          action: "click",
                        })
                        await navigate(`/line-of-credit/${locData.id}/draw`)
                      }
                    }}
                  >
                    {tDashboard("newDraw")}
                  </Button>
                </div>

                <AmountBar
                  currency={locCurrency}
                  segments={[
                    {
                      amount: drawnAmount,
                      label: tDashboard("drawn"),
                      color: "neutral-800",
                    },
                    {
                      amount: requestedAmount,
                      label: tDashboard("requested"),
                      color: "neutral-300",
                    },
                    {
                      amount: maxDrawAmount,
                      label: tDashboard("availableToDraw"),
                      color: "brand-600",
                      emphasis: true,
                    },
                    {
                      amount: growToUnlock,
                      label: tDashboard("growToUnlock"),
                      color: "brand-200",
                      stripeColor: "brand-600",
                    },
                  ]}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Typography type="smallTitle" color="neutral-900">
                  {tDashboard("recalculationNoticeTitle", {
                    count:
                      daysUntilRecalculation == null
                        ? 0
                        : daysUntilRecalculation + 1,
                  })}
                </Typography>
                <Typography type="smallCopy" color="neutral-700">
                  <Trans
                    i18nKey="widgets.lineOfCredit.recalculationNoticeContent"
                    ns="dashboard"
                    values={{
                      maxCreditLimit: format(maxCreditLimit, locCurrency, {
                        minimumFractionDigits: 0,
                      }),
                    }}
                    components={{
                      cta: (
                        // @ts-expect-error Property 'children' is missing in type
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => {
                            setIsCreditLimitModalOpen(true)
                          }}
                        />
                      ),
                    }}
                  />
                </Typography>
              </div>
            </div>
          )}
        </MainBanner>
        {status && (
          <div className="absolute top-4 left-4 z-30">
            <Chip
              label={status}
              color={
                agreement.status === DetailedAgreementDTOStatusEnum.Closed
                  ? "disabled"
                  : "success"
              }
            />
          </div>
        )}
      </div>

      {locData && (
        <MissingLocDocumentsModal
          isOpen={documentsModalOpen}
          onClose={() => {
            setDocumentsModalOpen(false)
          }}
          lineOfCredit={locData}
          daysLeft={documents.data?.daysLeft ?? 0}
        />
      )}
      <Modal
        isOpen={isCreditLimitModalOpen}
        onClose={() => {
          setIsCreditLimitModalOpen(false)
        }}
        className="!p-6 sm:!p-0 md:!w-xl"
      >
        {isMobile && (
          <Button
            type="button"
            onClick={() => {
              setIsCreditLimitModalOpen(false)
            }}
            variant="secondary"
            className="mb-4 ml-auto"
          >
            <Close />
          </Button>
        )}
        {locData && (
          <CreditLimitCalculationWidgetContainer
            agreementId={locData.agreementId!.id!}
            currency={locCurrency}
            multiplier={locData.availableCreditLimitMultiplier}
            maximumCreditLimit={locData.maxCreditLimit || 0}
            creditLimit={locData.currentAvailableCreditLimit || 0}
          />
        )}
      </Modal>
    </>
  )
}

export default LineOfCreditInterestRateHeader
