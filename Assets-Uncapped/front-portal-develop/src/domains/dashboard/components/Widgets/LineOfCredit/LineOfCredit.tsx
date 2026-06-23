import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  RefreshSolidRounded,
  MoneySecuritySolidRounded,
} from "@hugeicons-pro/core-solid-rounded"
import { Close } from "@material-ui/icons"
import { differenceInDays, isPast } from "date-fns"
import { Trans, useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import BoxIcon from "../../../../../components/Basic/BoxIcon"
import Button from "../../../../../components/Basic/Button"
import Typography from "../../../../../components/Basic/Typography"
import PageLoader from "../../../../../components/Collections/PageLoader"
import MissingLocDocumentsModal from "../../../../../components/Shared/MissingLocDocumentsModal"
import Alert from "../../../../../components/UI/Alert"
import AmountBar from "../../../../../components/UI/AmountBar"
import Chip from "../../../../../components/UI/Chip"
import Modal from "../../../../../components/UI/Modal"
import Nudge from "../../../../../components/UI/Nudge/Nudge"
import Widget from "../../../../../components/UI/Widget"
import useBankAccounts from "../../../../../hooks/useBankAccounts"
import useDevice from "../../../../../hooks/useDevice"
import useLineOfCreditAgreements from "../../../../../hooks/useLineOfCreditAgreements"
import useRevenueRecalculation from "../../../../../hooks/useRevenueRecalculation"
import { useTracking } from "../../../../../hooks/useTracking"
import {
  DrawResponseStatusEnum,
  LineOfCreditResponseStatusEnum,
  LineOfCreditResponseTypeEnum,
} from "../../../../../services/api/agreements"
import { DateFormat, formatDate } from "../../../../../utils/date"
import { format } from "../../../../../utils/money"
import useLedgerBalance from "../../../../agreements/hooks/useLedgerBalance"
import CreditLimitCalculationWidgetContainer from "../../../../line-of-credit/components/draw/CreditLimitCalculationWidgetContainer"
import { canRequestDraw } from "../../../../line-of-credit/utils"
import useMissingDocuments from "../../../hooks/useMissingDocuments"

const LineOfCredit = ({ isDetailView }: { isDetailView?: boolean }) => {
  const { isDesktop, isMobile } = useDevice()
  const { t } = useTranslation("dashboard", { keyPrefix: "widgets" })
  const { trackEvent } = useTracking()
  const navigate = useNavigate()
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false)
  const [isCreditLimitModalOpen, setIsCreditLimitModalOpen] = useState(false)
  const { currentLocAgreement } = useLineOfCreditAgreements()
  const documents = useMissingDocuments()
  const { data, isLoading } = currentLocAgreement

  const bankAccountsQuery = useBankAccounts()
  const verifiedBankAccount = bankAccountsQuery.data?.find(
    (account) => account.verifiedForPayments
  )

  const agreementId = data?.agreementId?.id
  const isInterestRateLoc =
    data?.type === LineOfCreditResponseTypeEnum.InterestRate

  const ledgerBalanceQuery = useLedgerBalance({
    agreementId: agreementId!,
    enabled: isInterestRateLoc && !!agreementId,
  })

  const { data: recalculationData } = useRevenueRecalculation({
    agreementId,
    enabled: isInterestRateLoc,
  })

  if (isLoading || documents.isLoading || ledgerBalanceQuery.isLoading) {
    return <PageLoader />
  }

  if (
    !data ||
    (isInterestRateLoc &&
      !!data.drawDownPeriodEndDate &&
      isPast(data.drawDownPeriodEndDate))
  ) {
    return null
  }

  if (isInterestRateLoc && !isDetailView) {
    const currency = data.limit?.currency!
    const drawnAmount = ledgerBalanceQuery.data?.currentPrincipal || 0
    const requestedAmount = data.balance?.pending?.amount || 0
    const maxDrawAmount = data.balance?.available?.amount || 0
    const growToUnlock =
      (data.maxCreditLimit || 0) - (data.currentAvailableCreditLimit || 0)
    const maxCreditLimit = data.maxCreditLimit || 0

    const daysUntilRecalculation = recalculationData?.nextRecalculationDate
      ? differenceInDays(
          new Date(recalculationData.nextRecalculationDate),
          new Date()
        )
      : null

    return (
      <>
        <Widget
          icon={
            <BoxIcon
              severity="accent-11"
              icon={<HugeiconsIcon icon={MoneySecuritySolidRounded} />}
            />
          }
          title={t("lineOfCredit.title")}
        >
          <div className="shadow-light-sm border-card rounded-card-md bg-white p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-end gap-2">
                  <Typography type="h5" color="neutral-900">
                    {format(maxDrawAmount, currency, {
                      minimumFractionDigits: 0,
                    })}{" "}
                    <Typography
                      type="tableHeader"
                      tag="span"
                      color="neutral-600"
                    >
                      /{" "}
                      {format(maxCreditLimit, currency, {
                        minimumFractionDigits: 0,
                      })}
                    </Typography>
                  </Typography>
                  <Typography type="smallCopy" color="neutral-900">
                    {t("lineOfCredit.availableToDraw")}
                  </Typography>
                </div>
                <Button
                  type="button"
                  disabled={!canRequestDraw(data) || !verifiedBankAccount}
                  onClick={async () => {
                    if (
                      data.status ===
                      LineOfCreditResponseStatusEnum.WaitingForDocuments
                    ) {
                      setDocumentsModalOpen(true)
                    } else {
                      trackEvent({
                        category: "dashboard",
                        name: "widget-line-of-credit-new-draw",
                        action: "click",
                      })
                      await navigate(`/line-of-credit/${data.id}/draw`)
                    }
                  }}
                >
                  {t("lineOfCredit.newDraw")}
                </Button>
              </div>

              <AmountBar
                currency={currency}
                segments={[
                  {
                    amount: drawnAmount,
                    label: t("lineOfCredit.drawn"),
                    color: "neutral-800",
                  },
                  {
                    amount: requestedAmount,
                    label: t("lineOfCredit.requested"),
                    color: "neutral-300",
                  },
                  {
                    amount: maxDrawAmount,
                    label: t("lineOfCredit.availableToDraw"),
                    color: "brand-600",
                    emphasis: true,
                  },
                  {
                    amount: growToUnlock,
                    label: t("lineOfCredit.growToUnlock"),
                    color: "brand-200",
                    stripeColor: "brand-600",
                  },
                ]}
              />

              <Nudge
                icon={RefreshSolidRounded}
                layout="horizontal"
                accent={6}
                className="!bg-surface-elevated-2"
                title={t("lineOfCredit.recalculationNoticeTitle", {
                  count:
                    daysUntilRecalculation == null
                      ? 0
                      : daysUntilRecalculation + 1,
                })}
                content={
                  <Trans
                    i18nKey="widgets.lineOfCredit.recalculationNoticeContent"
                    ns="dashboard"
                    values={{
                      maxCreditLimit: format(maxCreditLimit, currency, {
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
                }
              />
            </div>
          </div>
        </Widget>
        <MissingLocDocumentsModal
          isOpen={documentsModalOpen}
          onClose={() => {
            setDocumentsModalOpen(false)
          }}
          lineOfCredit={data}
          daysLeft={documents.data!.daysLeft}
        />
        <Modal
          isOpen={isCreditLimitModalOpen}
          onClose={() => {
            setIsCreditLimitModalOpen(false)
          }}
          className="p-6! sm:p-0! md:w-xl!"
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
          <CreditLimitCalculationWidgetContainer
            agreementId={data.agreementId!.id!}
            currency={currency}
            multiplier={data.availableCreditLimitMultiplier}
            maximumCreditLimit={data.maxCreditLimit || 0}
            creditLimit={data.currentAvailableCreditLimit || 0}
          />
        </Modal>
      </>
    )
  }

  const availableToDrawPercentage =
    (data.balance!.available!.amount! * 100) / data.limit!.amount!

  return (
    <>
      <Widget
        icon={
          <BoxIcon
            severity="accent-11"
            icon={<HugeiconsIcon icon={MoneySecuritySolidRounded} />}
          />
        }
        title={
          isDetailView
            ? t("lineOfCredit.availableCredit")
            : t("lineOfCredit.title")
        }
        action={
          isInterestRateLoc
            ? undefined
            : {
                text: t("lineOfCredit.action"),
                url: `/line-of-credit/${data.id}`,
                event: {
                  category: "dashboard",
                  name: "widget-line-of-credit",
                  action: "click",
                },
              }
        }
      >
        <div className="shadow-light-sm border-card rounded-card-md bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isDesktop && (
                <div
                  className="mr-4 inline-block size-10 rounded-full"
                  style={{
                    background: `radial-gradient(white 50%, transparent 50%), conic-gradient(var(--color-brand-600) 0% ${availableToDrawPercentage}%, ${availableToDrawPercentage}%, var(--color-neutral-300) 100% 100%)`,
                  }}
                />
              )}
              <div className="flex flex-col">
                <Typography type="h5">
                  <>
                    {format(
                      data.balance?.available?.amount!,
                      data.balance?.available?.currency!,
                      {
                        minimumFractionDigits: 0,
                      }
                    )}
                    {isDesktop && (
                      <Typography
                        type="bodyTitle"
                        tag="span"
                        color="neutral-600"
                      >
                        {" "}
                        /{" "}
                        {format(data.limit?.amount!, data.limit?.currency!, {
                          minimumFractionDigits: 0,
                        })}
                      </Typography>
                    )}
                  </>
                </Typography>
                <Typography type="smallCopy">
                  {t("lineOfCredit.copy")}
                </Typography>
              </div>
            </div>
            <Button
              type="button"
              disabled={!canRequestDraw(data)}
              onClick={async () => {
                if (
                  data.status ===
                  LineOfCreditResponseStatusEnum.WaitingForDocuments
                ) {
                  setDocumentsModalOpen(true)
                } else {
                  trackEvent({
                    category: "dashboard",
                    name: "widget-line-of-credit-new-draw",
                    action: "click",
                  })
                  await navigate(`/line-of-credit/${data.id}/draw`)
                }
              }}
            >
              {t("lineOfCredit.cta")}
            </Button>
          </div>
          {currentLocAgreement.data.draws?.some(
            (el) => el.status === DrawResponseStatusEnum.WaitingForSignature
          ) && (
            <Alert
              title={t("lineOfCredit.pending")}
              type="warning"
              className="mt-4"
            >
              <Trans
                i18nKey="widgets.lineOfCredit.pendingCopy"
                ns="dashboard"
                components={{
                  cta: (
                    // @ts-expect-error Property 'children' is missing in type
                    <Button
                      type="button"
                      variant="link"
                      onClick={async () => {
                        await navigate(`/line-of-credit/${data.id}`)
                      }}
                    />
                  ),
                }}
              />
            </Alert>
          )}
          {currentLocAgreement.data.draws?.some(
            (el) => el.status === DrawResponseStatusEnum.Pending
          ) && (
            <div className="mt-4 flex flex-col gap-3">
              <div className="mb-1 border-1 border-solid border-neutral-300"></div>
              <Typography type="bodyTitle">
                {t("lineOfCredit.drawRequestsInReview")}
              </Typography>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>
                    {currentLocAgreement.data.draws
                      .filter(
                        (el) => el.status === DrawResponseStatusEnum.Pending
                      )
                      .map((el) => (
                        <tr key={el.id}>
                          <td className="py-3 pr-6">
                            <Typography
                              type="tableValue"
                              className="min-w-30 text-neutral-600"
                            >
                              {formatDate(new Date(), {
                                format: DateFormat.SHORT,
                              })}
                            </Typography>
                          </td>
                          <td className="py-3 pr-6">
                            <Typography
                              type="tableValue"
                              className="text-neutral-600"
                            >
                              Draw
                            </Typography>
                          </td>
                          <td className="py-3 pr-6">
                            <Chip label="In review" color="default" />
                          </td>
                          <td className="py-3 text-right">
                            <Typography type="tableHeader" className="min-w-24">
                              {format(el.size?.amount!, el.size?.currency!, {
                                minimumFractionDigits: 0,
                              })}
                            </Typography>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Widget>
      <MissingLocDocumentsModal
        isOpen={documentsModalOpen}
        onClose={() => {
          setDocumentsModalOpen(false)
        }}
        lineOfCredit={data}
        daysLeft={documents.data!.daysLeft}
      />
    </>
  )
}

export default LineOfCredit
