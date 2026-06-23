import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import Typography from "../../../../components/Basic/Typography"
import ListItemContainer from "../../../../components/Collections/ListItemContainer"
import FormControl from "../../../../components/Forms/FormControl"
import Input from "../../../../components/Forms/Input"
import { StepProps } from "../../../../components/Headless/MultistepForm"
import FormLayout from "../../../../components/UI/FormLayout/FormLayout"
import ListItemLarge from "../../../../components/UI/ListItemLarge"
import PageBar from "../../../../components/UI/PageBar"
import { useTracking } from "../../../../hooks/useTracking"
import { BillVendorDTO } from "../../../../services/api/loan-operations"
import { ReactComponent as AddIcon } from "../../../../svgs/add.svg"
import { ReactComponent as SearchIcon } from "../../../../svgs/search.svg"
import { titleCase } from "../../../../utils/string"
import { PayFormSchema } from "../../pages/_pay.schema"

const getNumberName = (vendor: BillVendorDTO) =>
  vendor.accountIban ? "iban" : "accountNumber"

const ChoosePayeeStep = ({ data, onSubmit }: StepProps<PayFormSchema>) => {
  const { t } = useTranslation("pay", { keyPrefix: "index.choosePayeeStep" })
  const navigate = useNavigate()
  const { trackEvent } = useTracking()

  const { control, handleSubmit, watch } = useForm<PayFormSchema>({
    defaultValues: data,
    mode: "onBlur",
  })

  const searchQuery = watch("search")

  const filteredVendors = (data?.availableVendors || []).filter((vendor) => {
    return (
      !searchQuery ||
      vendor.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <FormLayout>
      <PageBar
        backUrl="/"
        title={t("title")}
        actionButton={{
          onClick: async () => {
            trackEvent({
              category: "pay",
              name: "new-payee",
              action: "click",
            })
            await navigate("/pay/new")
          },
          children: <AddIcon />,
        }}
      />

      <form onSubmit={handleSubmit(onSubmit!)}>
        <FormLayout.Content>
          <FormControl>
            <Input
              label={t("search")}
              name="search"
              control={control}
              icon={<SearchIcon />}
            />
          </FormControl>

          {!searchQuery && (
            <Typography type="bodyTitle" color="neutral-600" className="mb-4">
              {t("allPayees")}
            </Typography>
          )}

          {filteredVendors.length > 0 && (
            <ListItemContainer>
              {filteredVendors.map((item) => (
                <ListItemLarge
                  key={item.id}
                  initialIcon={item.name?.[0] || ""}
                  iconBackgroundColor="white"
                  title={item.name || ""}
                  subtitle={`${titleCase(item.category || "")} | ${t(
                    `numbers.${getNumberName(item)}`
                  )} ${item.accountIban || item.accountNumber}`}
                  more={{
                    type: "button",
                    onClick: () => {
                      trackEvent({
                        category: "pay",
                        name: "choose-payee",
                        action: "select",
                      })
                      onSubmit?.({ selectedVendor: item })
                    },
                  }}
                />
              ))}
            </ListItemContainer>
          )}
        </FormLayout.Content>
      </form>
    </FormLayout>
  )
}

export default ChoosePayeeStep
