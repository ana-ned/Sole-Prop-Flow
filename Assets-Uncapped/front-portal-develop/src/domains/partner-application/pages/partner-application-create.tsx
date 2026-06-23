import { useParams } from "react-router"
import PageLoader from "../../../components/Collections/PageLoader"
import MultistepForm from "../../../components/Headless/MultistepForm"
import ErrorIndex from "../../../pages/error/_error"
import { OrganisationCreationRequestBusinessEntityEnum } from "../../../services/api/partners"
import StepBallparkOffer from "../components/StepBallparkOffer"
import StepIntroduceClient from "../components/StepIntroduceClient"
import StepIntroduceOrganisation from "../components/StepIntroduceOrganisation"
import useApplicationDetails from "../hooks/useApplicationDetails"
import { PartnerApplicationFormSchema } from "../partner-application.types"

const PartnerApplicationCreate = () => {
  const { id } = useParams()
  const { data, isLoading, error } = useApplicationDetails(id)
  const initialData: Partial<PartnerApplicationFormSchema> = id
    ? {
        applicationId: data?.id,
        hasOrganisation: !!data?.organisationDetailsResponse,
        firstName: data?.clientDetailsResponse?.firstName,
        lastName: data?.clientDetailsResponse?.lastName,
        email: data?.clientDetailsResponse?.email,
        phoneNumber: data?.clientDetailsResponse?.phoneNumber,
        businessName: data?.organisationDetailsResponse?.businessName,
        businessWebsite: data?.organisationDetailsResponse?.businessWebsite,
        country: data?.organisationDetailsResponse?.country,
        region: data?.organisationDetailsResponse?.regions?.[0],
        revenue: String(data?.organisationDetailsResponse?.revenue),
        businessTypes: [
          ...(data?.organisationDetailsResponse?.businessTypes || []),
        ],
        businessEntity: data?.organisationDetailsResponse
          ?.businessEntity as unknown as OrganisationCreationRequestBusinessEntityEnum,
        mainEcommercePlatform:
          data?.organisationDetailsResponse?.mainEcommercePlatform,
      }
    : {}

  if (id) {
    if (error?.status === 404) {
      return <ErrorIndex type="404" />
    }

    if (isLoading || !data) {
      return <PageLoader />
    }
  }

  return (
    <MultistepForm initialData={initialData}>
      <StepIntroduceClient />
      <StepIntroduceOrganisation />
      <StepBallparkOffer />
    </MultistepForm>
  )
}

export default PartnerApplicationCreate
