import React, { useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { HugeiconsIcon } from "@hugeicons/react"
import { Invoice02SolidSharp } from "@hugeicons-pro/core-solid-sharp"
import {
  Calendar02SolidStandard,
  DiscountTag02SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { UseQueryResult } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as yup from "yup"
import { useShallow } from "zustand/shallow"
import DeferredRepaymentSelection from "../../../domains/onboarding/components/offers/DeferredRepaymentSelection"
import OfferDetailItem from "../../../domains/onboarding/components/offers/OfferDetailItem"
import OfferDetailsCardV2, {
  OfferDetailItemProps,
} from "../../../domains/onboarding/components/offers/OfferDetailsCardV2"
import useStore from "../../../hooks/useStore"
import {
  LineOfCreditResponseCollectionFrequencyEnum,
  CommonOfferDetailsRepaymentFrequencyEnum,
  RepaymentParametersResponse,
} from "../../../services/api/agreements"
import { format, formatAsPercentage } from "../../../utils/money"
import { titleCase } from "../../../utils/string"
import BetweenAmount from "../../../utils/validator-rules/between-amount"
import BoxIcon from "../../Basic/BoxIcon"
import Button from "../../Basic/Button"
import ButtonGroup from "../../Basic/ButtonGroup"
import SanitizedHtml from "../../Basic/SanitizedHtml"
import Typography from "../../Basic/Typography"
import SliderInput from "../../Forms/SliderInput"
import Card from "../../UI/Card"
import FormLayout from "../../UI/FormLayout/FormLayout"
import PageBar from "../../UI/PageBar"
import Widget from "../../UI/Widget"

interface LocDrawFormData {
  amount: string
  repaymentTermsMonths: number
  repaymentFee: number
  offerSelectedDeferredRepayment?: {
    deferredRepaymentPeriod: number
    deferredRepaymentAdditionalFee: number
  }
}

const LocDrawForm = ({
  values,
  onSubmit,
  onClickBack,
  setCurrentAmount,
  setCurrentRepaymentTermsMonths,
  footerAddition,
  isLoading,
  pagebarVisible = true,
}: {
  pagebarVisible?: boolean
  onClickBack?: () => void
  onSubmit: (formdata: LocDrawFormData) => void
  setCurrentAmount: (amount: number) => void
  setCurrentRepaymentTermsMonths: (repaymentTermsMonths: number) => void
  footerAddition?: React.ReactElement
  isLoading?: boolean
  values: {
    minDrawAmount: number
    maxDrawAmount: number
    drawRepaymentDurationMinimum?: number
    drawRepaymentDurationMaximum: number
    currency: string
    amount?: number
    collectionFrequency:
      | LineOfCreditResponseCollectionFrequencyEnum
      | CommonOfferDetailsRepaymentFrequencyEnum
    drawFee: number
    repaymentFee: number
    repaymentFeeAmount: number
    totalRepaymentAmount: number
    onClickSkip?: () => Promise<void>
    skipCtaCopy?: string
    deferredRepaymentPeriod?: number
    customisationFee?: number
    deferredRepayment?: any
    deferredRepaymentFees: (number | undefined)[]
    deferredRepaymentDates: UseQueryResult<RepaymentParametersResponse>[]
    deferredRepaymentMaxDays?: number
    numberOfRepayments?: number
    singleRepaymentAmount?: number
  }
}) => {
  const { t } = useTranslation("common", { keyPrefix: "LocDrawForm" })
  const { t: tOnboarding } = useTranslation("onboarding")
  const {
    minDrawAmount,
    maxDrawAmount,
    currency,
    drawRepaymentDurationMinimum,
    drawRepaymentDurationMaximum,
    amount,
    collectionFrequency,
    repaymentFee,
    repaymentFeeAmount,
    totalRepaymentAmount,
    customisationFee,
    deferredRepayment,
    deferredRepaymentFees,
    deferredRepaymentDates,
    deferredRepaymentMaxDays,
    numberOfRepayments,
    singleRepaymentAmount,
  } = values

  const { control, watch, handleSubmit, formState, setValue } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        amount: yup
          .string()
          .required()
          .test(BetweenAmount(minDrawAmount, maxDrawAmount, currency)),
        repaymentTermsMonths: yup
          .number()
          .required()
          .min(drawRepaymentDurationMinimum || drawRepaymentDurationMaximum)
          .max(drawRepaymentDurationMaximum),
      })
    ),
    mode: "onBlur",
  })

  const { offerSelectedDeferredRepayment } = useStore(
    useShallow((state) => ({
      offerSelectedDeferredRepayment: state.offerSelectedDeferredRepayment,
    }))
  )

  const currentAmount = Number.parseFloat(watch("amount"))
  const repaymentTermsMonths = watch("repaymentTermsMonths")

  useEffect(() => {
    if (maxDrawAmount) {
      setValue("amount", String(maxDrawAmount), { shouldValidate: true })
    }

    if (amount) {
      setValue("amount", String(amount), { shouldValidate: true })
    }

    if (drawRepaymentDurationMaximum) {
      setValue("repaymentTermsMonths", drawRepaymentDurationMaximum, {
        shouldValidate: true,
      })
    }
  }, [setValue, maxDrawAmount, drawRepaymentDurationMaximum, amount])

  useEffect(() => {
    setCurrentAmount(currentAmount)
  }, [currentAmount, setCurrentAmount])

  useEffect(() => {
    setCurrentRepaymentTermsMonths(repaymentTermsMonths)
  }, [repaymentTermsMonths, setCurrentRepaymentTermsMonths])

  return (
    <FormLayout>
      <form
        onSubmit={handleSubmit((formData) => {
          onSubmit({
            ...formData,
            repaymentFee,
            offerSelectedDeferredRepayment,
          })
        })}
      >
        <FormLayout.Content>
          {pagebarVisible && (
            <PageBar title={t("title")} desktopHeaderType="h4" />
          )}
          <div className="flex flex-col gap-6">
            <Widget
              title={t("chooseDrawAmount")}
              icon={
                <BoxIcon
                  severity="accent-3"
                  icon={<HugeiconsIcon icon={Invoice02SolidSharp} />}
                />
              }
            >
              <div className="flex flex-col gap-4">
                <Typography type="smallCopy" color="neutral-700">
                  <SanitizedHtml
                    as="span"
                    content={t("chooseDrawAmountDescription")}
                  />
                </Typography>
                {minDrawAmount === maxDrawAmount ? (
                  <Card>
                    <OfferDetailItem
                      label={t("amount")}
                      value={format(currentAmount, currency)}
                    />
                  </Card>
                ) : (
                  <Card>
                    <SliderInput
                      label={t("amount")}
                      currency={currency}
                      name="amount"
                      control={control}
                      min={minDrawAmount}
                      max={maxDrawAmount}
                    />
                  </Card>
                )}
              </div>
            </Widget>

            <Widget
              title={t("repaymentsSection")}
              icon={
                <BoxIcon
                  severity="accent-6"
                  icon={<HugeiconsIcon icon={Calendar02SolidStandard} />}
                />
              }
            >
              <div className="flex flex-col gap-4">
                {deferredRepayment &&
                  deferredRepayment.maxNumberOfDeferredMonths > 0 && (
                    <Typography type="smallCopy" color="neutral-700">
                      <SanitizedHtml
                        as="span"
                        content={t("repaymentsDescription")}
                      />
                    </Typography>
                  )}
                <Card>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                      <OfferDetailItem
                        label={t("repaymentsTerms")}
                        value={t("repaymentsTermsValue", {
                          count: repaymentTermsMonths,
                        })}
                      />
                      <SliderInput
                        name="repaymentTermsMonths"
                        control={control}
                        min={
                          drawRepaymentDurationMinimum ||
                          drawRepaymentDurationMaximum
                        }
                        max={drawRepaymentDurationMaximum}
                      />
                    </div>

                    <OfferDetailItem
                      label={t("repaymentFrequency")}
                      value={titleCase(collectionFrequency)}
                    />
                  </div>
                </Card>

                {deferredRepayment &&
                  deferredRepayment.maxNumberOfDeferredMonths > 0 && (
                    <DeferredRepaymentSelection
                      customFee={{
                        subText: t("totalDrawFeeSubText"),
                        value: repaymentFee,
                      }}
                      params={{
                        advance: currentAmount,
                        deferredRepayment,
                        currency,
                        deferredRepaymentDates,
                        deferredRepaymentFees,
                      }}
                      maxDays={
                        drawRepaymentDurationMaximum === repaymentTermsMonths
                          ? deferredRepayment.maxNumberOfDeferredMonths
                          : deferredRepaymentMaxDays &&
                              deferredRepaymentMaxDays > -1
                            ? deferredRepaymentMaxDays
                            : 0
                      }
                      loading={deferredRepaymentMaxDays === undefined}
                      variant="compact"
                    />
                  )}
              </div>
            </Widget>

            <OfferDetailsCardV2
              title={t("repaymentDetailsSection")}
              icon={
                <BoxIcon
                  severity="accent-4"
                  icon={<HugeiconsIcon icon={DiscountTag02SolidStandard} />}
                />
              }
              items={
                (deferredRepayment &&
                deferredRepayment.maxNumberOfDeferredMonths > 0
                  ? [
                      {
                        label: `${t("totalDrawFee")} (${formatAsPercentage(
                          (repaymentFee + (customisationFee || 0)) * 100,
                          2,
                          { removeTrailingZeros: true }
                        )})`,
                        value: format(
                          repaymentFeeAmount +
                            (customisationFee || 0) * currentAmount,
                          currency,
                          {
                            minimumFractionDigits: 0,
                          }
                        ),
                      },
                      {
                        label: t("totalRepayable"),
                        value: format(
                          totalRepaymentAmount +
                            (customisationFee || 0) * currentAmount,
                          currency,
                          {
                            minimumFractionDigits: 0,
                          }
                        ),
                      },
                      ...(numberOfRepayments !== undefined &&
                      singleRepaymentAmount !== undefined
                        ? [
                            {
                              label: tOnboarding(
                                `offers.collectionsDetails.repaymentSchedule.${collectionFrequency}`,
                                {
                                  count: numberOfRepayments,
                                }
                              ),
                              value: format(singleRepaymentAmount, currency, {
                                minimumFractionDigits: 0,
                              }),
                            },
                          ]
                        : []),
                    ]
                  : [
                      {
                        label: t("drawFee", {
                          rate: formatAsPercentage(repaymentFee * 100, 2, {
                            removeTrailingZeros: true,
                          }),
                        }),
                        value: format(repaymentFeeAmount, currency, {
                          minimumFractionDigits: 0,
                        }),
                      },
                      {
                        label: t("totalPayback"),
                        value: format(totalRepaymentAmount, currency, {
                          minimumFractionDigits: 0,
                        }),
                      },
                      ...(numberOfRepayments !== undefined &&
                      singleRepaymentAmount !== undefined
                        ? [
                            {
                              label: tOnboarding(
                                `offers.collectionsDetails.repaymentSchedule.${collectionFrequency}`,
                                {
                                  count: numberOfRepayments,
                                }
                              ),
                              value: format(singleRepaymentAmount, currency, {
                                minimumFractionDigits: 0,
                              }),
                            },
                          ]
                        : []),
                    ]) as OfferDetailItemProps[]
              }
            />
          </div>
        </FormLayout.Content>
        <FormLayout.Footer>
          <ButtonGroup onClickBack={onClickBack}>
            {footerAddition}
            <Button
              type="submit"
              loading={isLoading}
              disabled={!formState.isValid}
            >
              {t("cta")}
            </Button>
          </ButtonGroup>
        </FormLayout.Footer>
      </form>
    </FormLayout>
  )
}

export default LocDrawForm
