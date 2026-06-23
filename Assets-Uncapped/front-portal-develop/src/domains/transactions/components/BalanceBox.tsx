import { HugeiconsIcon } from "@hugeicons/react"
import { Chart03SolidStandard } from "@hugeicons-pro/core-solid-standard"
import clsx from "clsx"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../components/Basic/BoxIcon"
import Typography from "../../../components/Basic/Typography"
import Loader from "../../../components/UI/Loader"
import Widget from "../../../components/UI/Widget"
import useAgreements from "../../../hooks/useAgreements"
import useBalances from "../../../hooks/useBalances"
import {
  DetailedAgreementDTODetailedProductTypeEnum,
  DetailedAgreementDTOProductTypeEnum,
  DetailedAgreementDTOStatusEnum,
} from "../../../services/api/agreements"
import { format, separate } from "../../../utils/money"
import useLedgerBalance from "../../agreements/hooks/useLedgerBalance"

const BalanceBox = ({
  agreementId,
  summary = false,
}: {
  agreementId?: string
  summary?: boolean
}) => {
  const { t } = useTranslation("transactions", {
    keyPrefix: "transactionsV2.BalanceBox",
  })
  const balances = useBalances()
  const agreements = useAgreements()

  const activeAgreements = agreements.data?.filter(
    (agreement) => agreement.status === DetailedAgreementDTOStatusEnum.Active
  )

  const hasLocV2 = activeAgreements?.some(
    (agreement) =>
      agreement.detailedProductType ===
      DetailedAgreementDTODetailedProductTypeEnum.LineOfCreditInterestRate
  )

  const hasInterestRateProduct = activeAgreements?.some(
    (agreement) =>
      agreement.productType === DetailedAgreementDTOProductTypeEnum.InterestRate
  )

  const hasOnlyRbf = activeAgreements?.every(
    (agreement) =>
      agreement.detailedProductType ===
      DetailedAgreementDTODetailedProductTypeEnum.Rbf
  )

  const visibleAgreementId =
    agreementId || (hasInterestRateProduct && activeAgreements?.length === 1)
      ? agreementId || activeAgreements![0].id
      : undefined

  const agreement = agreements.data?.find(
    (agreement) => agreement.id === visibleAgreementId
  )

  const balance = balances.data?.balances?.find(
    (balance) => balance.agreementId === visibleAgreementId
  )

  const hasOnlyOneInterestRateProductInDefaultView =
    !!visibleAgreementId &&
    activeAgreements?.length === 1 &&
    hasInterestRateProduct

  const ledgerBalanceQuery = useLedgerBalance({
    agreementId: agreement?.id ?? "",
    enabled:
      agreement?.productType ===
        DetailedAgreementDTOProductTypeEnum.InterestRate ||
      agreement?.productType ===
        DetailedAgreementDTOProductTypeEnum.DailyPayout ||
      hasOnlyOneInterestRateProductInDefaultView,
  })

  if (balances.isLoading || agreements.isLoading) {
    return (
      <div
        className={clsx("flex flex-col items-center justify-center", {
          "shadow-light-sm border-card rounded-xl bg-white p-4": !summary,
        })}
      >
        <Loader size="xs" />
      </div>
    )
  }

  if (!balances.data) {
    return null
  }

  let balanceValue = visibleAgreementId
    ? (balance?.values!.CURRENT_TO_REPAY || 0) -
      (balance?.values!.COLLECTION_PENDING || 0)
    : (balances.data.aggregatedBalance!.values!.CURRENT_TO_REPAY || 0) -
      (balances.data.aggregatedBalance!.values!.COLLECTION_PENDING || 0)

  balanceValue = balanceValue < 1 ? 0 : balanceValue

  const Component = summary ? "div" : Widget

  const title = summary
    ? ""
    : `${t("totalBalance")}
          ${
            agreementId
              ? ""
              : t("acrossActiveLoans", {
                  count: activeAgreements?.length || 0,
                })
          }`

  return (
    <Component
      title={title}
      icon={
        summary ? undefined : (
          <BoxIcon
            severity="accent-1"
            icon={<HugeiconsIcon icon={Chart03SolidStandard} />}
          />
        )
      }
    >
      <div
        className={clsx(
          "text-center",
          !summary && "flex h-full flex-col items-center justify-center"
        )}
      >
        {summary ? (
          <Typography type="h5" color="neutral-800" className="!font-sans">
            {
              separate(
                balanceValue || 0,
                balances.data.aggregatedBalance?.currency!
              ).whole
            }
            <Typography tag="span" color="neutral-800" className="!font-sans">
              {
                separate(
                  balanceValue || 0,
                  balances.data.aggregatedBalance?.currency!
                ).fraction
              }
            </Typography>
          </Typography>
        ) : (
          <Typography type="h4" color="neutral-800" className="mb-2 !font-bold">
            {format(
              balanceValue || 0,
              balances.data.aggregatedBalance?.currency!
            )}
          </Typography>
        )}
        {!summary &&
          !visibleAgreementId &&
          hasLocV2 &&
          (activeAgreements || []).length > 1 && (
            <Typography type="tableValue" color="neutral-700">
              {t("totalBalanceIncludes")}
            </Typography>
          )}
        {!summary && !visibleAgreementId && !hasLocV2 && (
          <Typography type="tableValue" color="neutral-700">
            {t(hasOnlyRbf ? "includesInitialAdvance" : "includesInitialLoan")}
          </Typography>
        )}
        {!summary &&
          (agreement?.productType ===
            DetailedAgreementDTOProductTypeEnum.InterestRate ||
            agreement?.productType ===
              DetailedAgreementDTOProductTypeEnum.DailyPayout ||
            hasOnlyOneInterestRateProductInDefaultView) && (
            <>
              <Typography type="tableValue" color="neutral-700">
                {t("includesPrincipalBalance")}{" "}
                <span className="font-bold">
                  {format(
                    ledgerBalanceQuery.data?.currentPrincipal || 0,
                    balances.data.aggregatedBalance?.currency!
                  )}
                </span>
              </Typography>
              <Typography type="tableValue" color="neutral-700">
                {agreement?.productType ===
                DetailedAgreementDTOProductTypeEnum.DailyPayout
                  ? t("includesDailyFeesBalance")
                  : t("includesInterestBalance")}{" "}
                <span className="font-bold">
                  {format(
                    ledgerBalanceQuery.data?.currentInterest || 0,
                    balances.data.aggregatedBalance?.currency!
                  )}
                </span>
              </Typography>
              {!!ledgerBalanceQuery.data?.currentFees &&
                ledgerBalanceQuery.data.currentFees > 0 && (
                  <Typography type="tableValue" color="neutral-700">
                    {t("includesLateFeesBalance")}{" "}
                    <span className="font-bold">
                      {format(
                        ledgerBalanceQuery.data.currentFees,
                        balances.data.aggregatedBalance?.currency!
                      )}
                    </span>
                  </Typography>
                )}
            </>
          )}
        {agreement &&
          agreement.productType !==
            DetailedAgreementDTOProductTypeEnum.InterestRate &&
          agreement.productType !==
            DetailedAgreementDTOProductTypeEnum.DailyPayout && (
            <Typography type="tableValue" color="neutral-700">
              {t(
                agreement.detailedProductType ===
                  DetailedAgreementDTODetailedProductTypeEnum.Rbf
                  ? "includesInitialAdvance"
                  : "includesInitialLoan"
              )}
            </Typography>
          )}
      </div>
    </Component>
  )
}

export default BalanceBox
