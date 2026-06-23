import { useForm } from "react-hook-form"
import useAuth from "../../../../hooks/useAuth"
import apiConfig, { ApiServicesEnum } from "../../../../services/api/api-config"
import {
  OrganisationControllerApi,
  OrganisationDTO,
} from "../../../../services/api/organisation-users"
import Select from "../../../Forms/Select"
import useDebouncedSearch from "./useDebouncedSearch"

export const getOrgLabel = (org: OrganisationDTO) => {
  if (org.name && org.id) {
    return `${org.name} (${org.id})`
  }
  return ""
}

const OrganisationSelector = () => {
  const auth = useAuth()
  const { control } = useForm()

  const { data, isFetching, setQuery } = useDebouncedSearch<OrganisationDTO>({
    queryKey: "ORGANISATIONS_INDEX",
    queryFn: async (query) =>
      new OrganisationControllerApi(
        apiConfig({
          token: await auth.getToken(),
          service: ApiServicesEnum.OrganisationUsers,
        })
      ).searchOrganisations({
        xXORGID: "",
        query,
      }),
  })

  return (
    <div>
      <Select
        name="organisation"
        isLoading={isFetching}
        onChange={(selected) => {
          const selectedOrganisation = data.find(
            (item) => item.id === selected.value
          )

          if (selectedOrganisation) {
            auth.setImpersonateAs({
              organisationId: selectedOrganisation.id, // FIXME: Required for backward compatibility with front-backoffice.
              ...selectedOrganisation,
            })
          }
        }}
        onInputChange={(newValue: string) => {
          setQuery(newValue)
        }}
        searchable
        options={data.map((item) => ({
          value: item.id || "",
          label: getOrgLabel(item),
        }))}
        label="Impersonate as Organisation"
        control={control}
      />
    </div>
  )
}

export default OrganisationSelector
