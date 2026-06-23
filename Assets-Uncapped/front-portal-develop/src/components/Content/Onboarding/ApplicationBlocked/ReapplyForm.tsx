import { ReactNode } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { yupResolver } from "@hookform/resolvers/yup"
import { RegisterOrganisationRequestCurrencyEnum } from "../../../../services/api/organisation-users"
import Button from "../../../Basic/Button"
import FormControl from "../../../Forms/FormControl"
import MoneyFields from "../../../Forms/MoneyFields"
import Select from "../../../Forms/Select"
import FormLayout from "../../../UI/FormLayout/FormLayout"
import FundingTypesCard from "./FundingTypesCard"
import { reapplySchema, ReapplyFormData } from "./reapplyFormSchema"

interface ReapplyFormProps {
  header: ReactNode
  onReapply?: (data: ReapplyFormData) => void
  isReapplyLoading?: boolean
  showFundingTypesCard?: boolean
}

const ReapplyForm = ({
  header,
  onReapply,
  isReapplyLoading,
  showFundingTypesCard,
}: ReapplyFormProps) => {
  const { t } = useTranslation("onboarding", {
    keyPrefix: "ApplicationBlocked",
  })

  const applicationTypeOptions = (
    t("reapplyForm.applicationTypeOptions", {
      returnObjects: true,
    }) as string[]
  ).map((item) => ({
    value: item,
    label: item,
  }))

  const { control, handleSubmit, formState, watch } = useForm<ReapplyFormData>({
    resolver: yupResolver(reapplySchema),
    defaultValues: {
      fundingAmount: { currency: "USD", amount: "" },
      applicationType: "",
    },
    mode: "onBlur",
  })

  const onSubmit = (data: ReapplyFormData) => {
    onReapply?.(data)
  }

  return (
    <FormLayout>
      {header}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLayout.Content>
          <FormControl>
            <MoneyFields
              control={control}
              prefix="fundingAmount"
              label={t("reapplyForm.fundingAmountLabel")}
              watch={watch}
              order={0}
              currencies={Object.values(
                RegisterOrganisationRequestCurrencyEnum
              )}
            />
          </FormControl>

          <FormControl>
            <Select
              control={control}
              name="applicationType"
              label={t("reapplyForm.requiredFundingTimeHorizonLabel")}
              placeholder={t("reapplyForm.requiredFundingTimeHorizonLabel")}
              options={applicationTypeOptions}
            />
          </FormControl>

          {showFundingTypesCard && (
            <FundingTypesCard title={t("reapplyForm.fundingTypesTitle")} />
          )}
        </FormLayout.Content>

        <FormLayout.Footer>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!formState.isValid}
              loading={isReapplyLoading}
            >
              {t("reapplyButton")}
            </Button>
          </div>
        </FormLayout.Footer>
      </form>
    </FormLayout>
  )
}

export default ReapplyForm
