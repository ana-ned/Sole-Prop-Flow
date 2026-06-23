import { useForm } from "react-hook-form"
import useAuth from "../../../../hooks/useAuth"
import apiConfig, { ApiServicesEnum } from "../../../../services/api/api-config"
import {
  PartnerControllerApi,
  PartnerDetailsResponse,
} from "../../../../services/api/partners"
import Select from "../../../Forms/Select"
import useDebouncedSearch from "./useDebouncedSearch"

const getLabel = (item: PartnerDetailsResponse) => {
  if (item.name && item.id) {
    return `${item.name} (${item.id})`
  }
  return ""
}

const PartnerSelector = () => {
  const auth = useAuth()
  const { control } = useForm()

  const { data, isFetching, setQuery } =
    useDebouncedSearch<PartnerDetailsResponse>({
      queryKey: "PARTNERS_INDEX",
      queryFn: async (query) =>
        new PartnerControllerApi(
          apiConfig({
            token: await auth.getToken(),
            service: ApiServicesEnum.Partners,
          })
        ).getPartnerList({
          xXPARTNERID: "",
          query,
        }),
    })

  return (
    <div>
      <Select
        name="partner"
        isLoading={isFetching}
        onChange={(selected) => {
          const entity = data.find((item) => item.id === selected.value)

          if (entity) {
            auth.setImpersonateAsPartner(entity)
          }
        }}
        onInputChange={(newValue: string) => {
          setQuery(newValue)
        }}
        searchable
        options={data.map((item) => ({
          value: item.id || "",
          label: getLabel(item),
        }))}
        label="Impersonate as Partner"
        control={control}
      />
    </div>
  )
}

export default PartnerSelector
