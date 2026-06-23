import { useEffect, useState } from "react"
import { useParams } from "react-router"
import PageLoader from "../../../components/Collections/PageLoader"
import MultistepForm from "../../../components/Headless/MultistepForm"
import Layout from "../../../components/UI/Layout"
import LogoOnlyMenu from "../../../components/UI/LogoOnlyMenu"
import { BusinessDetailsForm } from "../../onboarding/components/business-details/BusinessDetailsForm.types"
import BusinessDetailsInfo from "../components/businessDetails/BusinessDetailsInfo"
import BusinessDetailsRegisteredAddress from "../components/businessDetails/BusinessDetailsRegisteredAddress"
import BusinessDetailsReview from "../components/businessDetails/BusinessDetailsReview"
import useCompany from "../hooks/useCompany"
import { createInitialFormData } from "../utils/businessDetailsForm"

const PartnerApplicationCreate = () => {
  const { id } = useParams()
  const { companyDetails } = useCompany(id)
  const [initialData, setInitialData] = useState<BusinessDetailsForm>()

  useEffect(() => {
    if (companyDetails.data) {
      setInitialData(createInitialFormData(companyDetails.data))
    }
  }, [companyDetails.data])

  if (companyDetails.isLoading || !initialData) {
    return <PageLoader />
  }

  return (
    <Layout menu={<LogoOnlyMenu />}>
      <Layout.Parent>
        <MultistepForm initialData={initialData}>
          <BusinessDetailsInfo />
          <BusinessDetailsRegisteredAddress />
          <BusinessDetailsReview />
        </MultistepForm>
      </Layout.Parent>
    </Layout>
  )
}

export default PartnerApplicationCreate
