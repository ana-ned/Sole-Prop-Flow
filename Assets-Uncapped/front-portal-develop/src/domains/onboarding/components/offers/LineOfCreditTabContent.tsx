import { useEffect } from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { HugeiconsIcon } from "@hugeicons/react"
import { Invoice02SolidSharp } from "@hugeicons-pro/core-solid-sharp"
import {
  DiscountTag02SolidStandard,
  MoneySend02SolidStandard,
} from "@hugeicons-pro/core-solid-standard"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useDebounce } from "react-use"
import * as yup from "yup"
import BoxIcon from "../../../../components/Basic/BoxIcon"
import SanitizedHtml from "../../../../components/Basic/SanitizedHtml"
import Typography from "../../../../components/Basic/Typography/Typography"
import SliderInput from "../../../../components/Forms/SliderInput"
import Card from "../../../../components/UI/Card"
import MainBanner from "../../../../components/UI/MainBanner"
import Widget from "../../../../components/UI/Widget"
import useStore from "../../../../hooks/useStore"
import { OfferResponse } from "../../../../services/api/agreements"
import { format, formatAsPercentage } from "../../../../utils/money"
import BetweenAmount from "../../../../utils/validator-rules/between-amount"
import useOffers from "../../hooks/useOffers"
import { getLineOfCreditOfferParams } from "../../utils/offers"
import OfferConvenienceFeesCard from "./OfferConvenienceFeesCard"
import OfferDetailItem from "./OfferDetailItem"
import OfferExpirationNotice from "./OfferExpirationNotice"

const LineOfCreditTabContent = ({ offer }: { offer: OfferResponse }) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "offers",
  })
  const { selectedOffer } = useOffers()
  const { setOfferCustomizations, offerCustomizations } = useStore(
    (state) => state
  )
  const offerParams = getLineOfCreditOfferParams(offer, offerCustomizations)

  const { control, watch, setValue } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        amount: yup
          .string()
          .required()
          .test(
            BetweenAmount(
              offerParams.minAdvance,
              offerParams.maxAdvance,
              offerParams.currency!
            )
          ),
        term: yup.number().required(),
      })
    ),
    defaultValues: {
      amount: String(offerParams.advance || 1),
      term: offerParams.repaymentLength > 0 ? offerParams.repaymentLength : 1,
    },
    mode: "onBlur",
  })

  const amountValue = watch("amount")
  const termValue = watch("term")

  useEffect(() => {
    setValue("amount", String(offerParams.maxAdvance || 1))
    setValue("term", offerParams.repaymentLength)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offer.id])

  useDebounce(
    () => {
      setOfferCustomizations(offer, {
        lineOfCreditParameters: {
          totalAdvanceAmount: Number(amountValue),
          drawRepaymentDurationInMonths: termValue,
        },
      })
    },
    200,
    [amountValue, termValue]
  )

  const repaymentTermDisplay =
    offerParams.repaymentLengthMinimum &&
    offerParams.repaymentLengthMinimum !== offerParams.repaymentLength
      ? `${offerParams.repaymentLengthMinimum} - ${offerParams.repaymentLength}`
      : `${offerParams.repaymentLength}`

  const displayAmount =
    selectedOffer?.id === offer.id
      ? offer.offerDetails?.lineOfCreditDetails?.totalAdvanceAmount
      : offerParams.advance

  return (
    <div className="flex flex-col gap-6">
      <MainBanner
        title={
          <>
            <Typography type="bodyMedium" color="white">
              {t("lineOfCredit.yourOffer")}
            </Typography>
            <Typography type="h2" color="white">
              {format(displayAmount ?? 0, offerParams.currency!, {
                minimumFractionDigits: 0,
              })}
            </Typography>
          </>
        }
      />
      <OfferExpirationNotice offer={offer} />

      {offer.offerDetails?.commonOfferDetails?.automatic && (
        <Typography className="mb-6" color="neutral-600">
          <SanitizedHtml as="span" content={t("automatic")} />
        </Typography>
      )}

      {selectedOffer?.id !== offer.id &&
        offerParams.minAdvance !== offerParams.maxAdvance && (
          <Widget
            title={t("offersEdit.capital")}
            icon={
              <BoxIcon
                severity="accent-3"
                icon={<HugeiconsIcon icon={Invoice02SolidSharp} />}
              />
            }
          >
            <Card>
              <SliderInput
                label={t("lineOfCredit.facilityLimit")}
                currency={offerParams.currency}
                name="amount"
                control={control}
                min={offerParams.minAdvance}
                max={offerParams.maxAdvance}
              />
            </Card>
          </Widget>
        )}

      <Widget
        title={t("lineOfCredit.facilityDetails")}
        icon={
          <BoxIcon
            severity="accent-10"
            icon={<HugeiconsIcon icon={DiscountTag02SolidStandard} />}
          />
        }
      >
        <Card>
          <div className="flex flex-col gap-2">
            <OfferDetailItem
              label={t("lineOfCredit.drawdownPeriod.title")}
              value={t("month", { count: offerParams.drawdownPeriod })}
              description={t("lineOfCredit.drawdownPeriod.description", {
                term: t("month", { count: termValue }),
              })}
            />

            <OfferDetailItem
              label={t("lineOfCredit.facilityFee.title")}
              value={formatAsPercentage(offerParams.facilityFee * 100, 2, {
                removeTrailingZeros: true,
              })}
              description={t("lineOfCredit.facilityFee.description", {
                repaymentFrequency: t(
                  `collectionSchedule.${offerParams.repaymentFrequency!}`
                ).toLowerCase(),
              })}
              condition={offerParams.facilityFee > 0}
            />
          </div>
        </Card>
      </Widget>

      <Widget
        title={t("lineOfCredit.drawDetails")}
        icon={
          <BoxIcon
            severity="accent-9"
            icon={<HugeiconsIcon icon={MoneySend02SolidStandard} />}
          />
        }
      >
        <Card>
          <div className="flex flex-col gap-2">
            <OfferDetailItem
              label={t("lineOfCredit.drawDuration.title")}
              value={t("lineOfCredit.drawDuration.value", {
                duration: repaymentTermDisplay,
              })}
              description={t("lineOfCredit.drawDuration.description")}
            />

            <OfferDetailItem
              label={t("lineOfCredit.drawFee.title")}
              value={formatAsPercentage(
                (offerParams.baseFee * 100) / offerParams.repaymentLength,
                2,
                {
                  removeTrailingZeros: true,
                }
              )}
              description={t("lineOfCredit.drawFee.description")}
            />

            <OfferDetailItem
              label={t("lineOfCredit.repaymentFrequency.title")}
              value={
                offerParams.repaymentFrequency
                  ? t(`collectionSchedule.${offerParams.repaymentFrequency}`)
                  : "--"
              }
              description={t("lineOfCredit.repaymentFrequency.description")}
            />
          </div>
        </Card>
      </Widget>

      <OfferConvenienceFeesCard offer={offer} />
    </div>
  )
}

export default LineOfCreditTabContent
