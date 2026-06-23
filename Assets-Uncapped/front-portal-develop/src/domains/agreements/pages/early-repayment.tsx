import { useLocation, useParams } from "react-router"
import PageLoader from "../../../components/Collections/PageLoader"
import Layout from "../../../components/UI/Layout"
import PortalMenu from "../../../components/UI/PortalMenu"
import ErrorIndex from "../../../pages/error/_error"
import { AvailableTypeForAgreementAvailableRepaymentTypeEnum } from "../../../services/api/agreements"
import useEarlyRepayments from "../../transactions/hooks/useEarlyRepayments"
import EarlyRepaymentFull from "../components/EarlyRepayment/EarlyRepaymentFull"
import EarlyRepaymentPartial from "../components/EarlyRepayment/EarlyRepaymentPartial"

const EarlyRepayment = () => {
  const params = useParams<{ agreementId: string }>()
  const locationState = useLocation().state as { backUrl?: string } | undefined
  const earlyRepaymentsQuery = useEarlyRepayments()

  const getBackUrl = () => {
    if (locationState?.backUrl) {
      return locationState.backUrl
    }

    if (earlyRepaymentsQuery.data?.length === 1) {
      return "/transactions"
    }

    return "/loans/early-repayments"
  }

  if (earlyRepaymentsQuery.isLoading) {
    return <PageLoader />
  }

  const earlyRepayment = earlyRepaymentsQuery.data?.find(
    (el) => el.agreementId === params.agreementId
  )

  if (
    !!earlyRepaymentsQuery.data &&
    (earlyRepaymentsQuery.data.length === 0 || !earlyRepayment)
  ) {
    return <ErrorIndex type="404" />
  }

  return (
    <Layout menu={<PortalMenu />}>
      <Layout.Parent>
        {earlyRepayment?.availableRepaymentType ===
        AvailableTypeForAgreementAvailableRepaymentTypeEnum.FullLeftToRepayOnly ? (
          <EarlyRepaymentFull backUrl={getBackUrl()} />
        ) : (
          <EarlyRepaymentPartial backUrl={getBackUrl()} />
        )}
      </Layout.Parent>
    </Layout>
  )
}

export default EarlyRepayment
