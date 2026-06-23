import { CustomerPersonAddressDTO } from "../../../services/api/kyc"
import CountryService from "../../../services/country"
import Typography from "../../Basic/Typography"

const AddressSummary = ({
  address,
}: {
  address?: Partial<CustomerPersonAddressDTO>
}) => {
  if (!address) {
    return null
  }

  return (
    <Typography type="body">
      {address.addressLine1 && `${address.addressLine1}, `}
      {address.addressLine2 && `${address.addressLine2}, `}
      {address.locality && `${address.locality}, `}
      {address.region && `${address.region}, `}
      {address.postalCode && `${address.postalCode}, `}
      {address.country &&
        `${CountryService.getByAlpha3(address.country)?.name}`}
    </Typography>
  )
}

export default AddressSummary
