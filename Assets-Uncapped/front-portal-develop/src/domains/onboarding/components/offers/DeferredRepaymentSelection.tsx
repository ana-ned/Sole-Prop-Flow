import { useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar02SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { UseQueryResult } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useUnmount } from "react-use"
import * as yup from "yup"
import { useShallow } from "zustand/shallow"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography"
import MultipleRadio from "../../../../components/Forms/MultipleRadio"
import Chip from "../../../../components/UI/Chip"
import Widget from "../../../../components/UI/Widget"
import useStore from "../../../../hooks/useStore"
import {
  DeferredRepaymentsParameters,
  OfferResponseOfferTypeEnum,
  RepaymentParametersResponse,
} from "../../../../services/api/agreements"
import { format, formatAsPercentage } from "../../../../utils/money"
import { getFirstRepaymentDay } from "../../utils/offers"

const DeferredRepaymentSelection = ({
  params,
  maxDays,
  loading,
  variant = "default",
  customFee,
}: {
  params: {
    advance: number
    deferredRepayment?: DeferredRepaymentsParameters
    currency: string
    offerType?: OfferResponseOfferTypeEnum
    deferredRepaymentFees: (number | undefined)[]
    deferredRepaymentDates: UseQueryResult<RepaymentParametersResponse>[]
    baseFee?: number
  }
  maxDays: number
  loading?: boolean
  variant?: "default" | "compact"
  customFee?: {
    subText: string
    value: number
  }
}) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers.deferredRepaymentSelection",
  })
  const setOfferSelectedDeferredRepayment = useStore(
    useShallow((state) => state.setOfferSelectedDeferredRepayment)
  )

  const { control, watch, setValue } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        deferredRepaymentMonths: yup.string(),
      })
    ),
    mode: "onBlur",
    defaultValues: {
      deferredRepaymentMonths: "0",
    },
  })

  const datesLoading = params.deferredRepaymentDates.some(
    (query) => query.isLoading
  )

  const radioOptions = Array.from({
    length: params.deferredRepayment?.maxNumberOfDeferredMonths
      ? params.deferredRepayment.maxNumberOfDeferredMonths + 1
      : 0,
  }).map((_, index) => ({
    label: (
      <div className="mb-1 flex">
        <Typography type="bodyMedium" className="mr-2">
          {t("startRepayingOnDay")}{" "}
          {datesLoading
            ? 0
            : getFirstRepaymentDay(
                params.deferredRepaymentDates[index].data?.repaymentStartDate!
              )}
        </Typography>
        {index > 0 ? (
          <Chip
            label={t("paymentHoliday")}
            color={index > maxDays ? "disabled" : "success"}
          />
        ) : (
          <Chip label={t("default")} color="default" />
        )}
      </div>
    ),
    value: `${index}`,
    sub:
      variant === "compact"
        ? `${formatAsPercentage((params.deferredRepaymentFees[index] || 0) * 100 + (customFee?.value || params.baseFee || 0) * 100, 2, { removeTrailingZeros: true })} ${customFee?.subText || t("fixedFee")}`
        : `${formatAsPercentage((params.deferredRepaymentFees[index] || 0) * 100, 2, { removeTrailingZeros: true })} ${t("paymentHolidayFee")} (+ ${format(
            (params.deferredRepaymentFees[index] || 0) * params.advance,
            params.currency,
            {
              minimumFractionDigits: 0,
            }
          )})`,
    disabled: index > maxDays,
  }))

  const deferredRepaymentMonths = watch("deferredRepaymentMonths")

  useEffect(() => {
    setOfferSelectedDeferredRepayment({
      deferredRepaymentPeriod: Number(deferredRepaymentMonths),
      deferredRepaymentAdditionalFee:
        params.deferredRepaymentFees[Number(deferredRepaymentMonths)]!,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredRepaymentMonths, setOfferSelectedDeferredRepayment])

  useEffect(() => {
    if ((Number(deferredRepaymentMonths) || 0) > maxDays) {
      setValue("deferredRepaymentMonths", "0")
    }
  }, [maxDays, setValue, deferredRepaymentMonths])

  useUnmount(() => {
    setOfferSelectedDeferredRepayment(undefined)
  })

  if (variant === "compact") {
    return (
      <MultipleRadio
        variant={variant}
        name="deferredRepaymentMonths"
        control={control}
        options={radioOptions}
        loading={loading}
      />
    )
  }

  return (
    <Widget
      icon={
        <BoxIcon
          severity="accent-6"
          icon={<HugeiconsIcon icon={Calendar02SolidStandard} />}
        />
      }
      title={t("firstRepayment")}
    >
      {params.offerType !== OfferResponseOfferTypeEnum.Fixed && (
        <Typography color="neutral-700" className="mb-4">
          <SanitizedHtml
            as="span"
            content={
              params.offerType === OfferResponseOfferTypeEnum.FixedCustomizable
                ? t("copyRangedOffer")
                : t("copyLoc")
            }
          />
        </Typography>
      )}
      <MultipleRadio
        variant={variant}
        name="deferredRepaymentMonths"
        control={control}
        options={radioOptions}
        loading={loading}
      />
    </Widget>
  )
}
export default DeferredRepaymentSelection
