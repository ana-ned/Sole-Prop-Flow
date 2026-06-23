import { HugeiconsIcon } from "@hugeicons/react"
import { StarAward02SolidSharp } from "@hugeicons-pro/core-solid-sharp"
import { useTranslation } from "react-i18next"
import { format } from "../../utils/money"
import { initials } from "../../utils/string"
import BoxIcon from "../Basic/BoxIcon"
import SanitizedHtml from "../Basic/SanitizedHtml"
import Typography from "../Basic/Typography"
import Loader from "../UI/Loader"
import Widget from "../UI/Widget"

export interface MerchantData {
  name: string
  icon?: string
  amount: number
}

const CreditLimitCalculationWidget = ({
  currency,
  multiplier,
  maximumCreditLimit,
  creditLimit,
  merchantData,
  isLoading,
}: {
  currency: string
  multiplier?: number
  maximumCreditLimit: number
  creditLimit: number
  merchantData: MerchantData[]
  isLoading: boolean
}) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers.lineOfCredit.CreditLimitCalculationWidget",
  })
  const sortedMerchantData = merchantData.toSorted(
    (first, second) => second.amount - first.amount
  )
  const totalMonthlyPayout = merchantData.reduce(
    (sum, { amount }) => sum + amount,
    0
  )

  return (
    <Widget
      title={t("title")}
      icon={
        <BoxIcon
          severity="accent-9"
          icon={<HugeiconsIcon icon={StarAward02SolidSharp} />}
        />
      }
    >
      <div className="flex flex-col gap-4">
        <Typography type="body">
          <SanitizedHtml
            content={t("description", {
              multiplier,
              amount: format(maximumCreditLimit, currency, {
                minimumFractionDigits: 0,
              }),
            })}
            as="span"
          />
        </Typography>

        {isLoading && (
          <div className="shadow-light-sm border-card rounded-card-md flex flex-col bg-white p-4">
            <Loader size="xs" />
          </div>
        )}
        {!isLoading && merchantData.length > 0 && (
          <div className="shadow-light-sm border-card rounded-card-md flex flex-col gap-2 bg-white p-2 px-4">
            {sortedMerchantData.map((merchant) => (
              <div key={merchant.name} className="flex items-center gap-2">
                <div className="flex shrink-0 items-center justify-center rounded-lg bg-neutral-100 p-2">
                  {merchant.icon ? (
                    <img
                      src={merchant.icon}
                      alt={merchant.name}
                      className="size-6"
                    />
                  ) : (
                    <div className="flex size-6 items-center justify-center">
                      <Typography
                        type="h5"
                        color="brand-700"
                        className="font-bold"
                      >
                        {initials(merchant.name.charAt(0))}
                      </Typography>
                    </div>
                  )}
                </div>
                <Typography type="body" className="grow">
                  {merchant.name}
                </Typography>
                <Typography type="smallCopy">
                  {format(merchant.amount, currency, {
                    minimumFractionDigits: 2,
                  })}
                </Typography>
              </div>
            ))}

            <div className="mt-2 flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <Typography type="bodyTitle">{t("monthlyPayouts")}</Typography>
                <Typography type="smallTitle">
                  {format(totalMonthlyPayout, currency, {
                    minimumFractionDigits: 0,
                  })}
                </Typography>
              </div>

              <div className="flex items-start justify-between">
                <Typography type="bodyTitle">
                  {t("availableCreditLimit", { multiplier })}
                </Typography>
                <Typography type="smallTitle">
                  {format(creditLimit, currency, {
                    minimumFractionDigits: 0,
                  })}
                </Typography>
              </div>
            </div>
          </div>
        )}
      </div>
    </Widget>
  )
}

export default CreditLimitCalculationWidget
