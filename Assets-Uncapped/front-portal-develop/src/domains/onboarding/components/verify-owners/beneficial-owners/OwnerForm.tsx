import { useParams } from "react-router"
import PageLoader from "../../../../../components/Collections/PageLoader"
import useBeneficialOwners from "../../../hooks/useBeneficialOwners"
import { BeneficialOwnerForm } from "../beneficial-owners-flow.types"
import OwnerDetails from "./form-steps/OwnerDetails"

const OwnerForm = () => {
  const { id } = useParams()
  const { data, isLoading } = useBeneficialOwners()

  const current = id ? data?.find((item) => item.externalId === id) : undefined

  const initialData: BeneficialOwnerForm = {
    firstName: current?.firstName || "",
    lastName: current?.lastName || "",
    email: current?.email || "",
    fullOwner: current,
  }

  if (isLoading) {
    return <PageLoader />
  }

  return <OwnerDetails data={initialData} />
}

export default OwnerForm
