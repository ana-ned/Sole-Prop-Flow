import { Fragment, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { MoneyBag02SolidRounded } from "@hugeicons-pro/core-solid-rounded"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router"
import BoxIcon from "../../../components/Basic/BoxIcon"
import PageLoader from "../../../components/Collections/PageLoader"
import Layout from "../../../components/UI/Layout"
import PageBar from "../../../components/UI/PageBar"
import PortalMenu from "../../../components/UI/PortalMenu"
import Widget from "../../../components/UI/Widget"
import useAgreements from "../../../hooks/useAgreements"
import ErrorIndex from "../../../pages/error/_error"
import { AgreementsProductGroupEnum } from "../../../services/api/agreements"
import useEarlyRepayments from "../../transactions/hooks/useEarlyRepayments"
import AgreementListItem from "../components/AgreementListItem/AgreementListItem"

const EarlyRepayments = () => {
  const navigate = useNavigate()
  const { t } = useTranslation("agreements", { keyPrefix: "EarlyRepayment" })
  const locationState = useLocation().state as { backUrl?: string } | undefined
  const { data, isLoading } = useAgreements({
    productGroup: AgreementsProductGroupEnum.CustomerLoans,
  })
  const earlyRepaymentsQuery = useEarlyRepayments()

  useEffect(() => {
    if (!!earlyRepaymentsQuery.data && earlyRepaymentsQuery.data.length === 1) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      navigate(
        `/loans/early-repayments/${earlyRepaymentsQuery.data[0].agreementId}`,
        {
          state: {
            backUrl: locationState?.backUrl,
          },
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [earlyRepaymentsQuery.data])

  if (isLoading || earlyRepaymentsQuery.isLoading) {
    return <PageLoader />
  }

  const agreements = data
    ?.filter(
      (agreement) =>
        !!earlyRepaymentsQuery.data?.find(
          (el) => el.agreementId === agreement.id!
        ) && agreement.repayments?.earlyRepaymentAllowed
    )
    // @ts-expect-error: type checks from api
    .toSorted((a, b) => b.activationDate! - a.activationDate!)

  if (earlyRepaymentsQuery.data?.length === 0 || agreements?.length === 0) {
    return <ErrorIndex type="404" />
  }

  return (
    <Layout menu={<PortalMenu />}>
      <Layout.Parent>
        <PageBar backUrl="/" desktopHeaderType="h4" />
        <Widget
          icon={
            <BoxIcon
              severity="accent-4"
              icon={<HugeiconsIcon icon={MoneyBag02SolidRounded} />}
            />
          }
          title={t("titleSelection")}
        >
          <div className="rounded-card-md flex flex-col gap-4 bg-white p-4 shadow-sm">
            {agreements?.map((agreement, index) => (
              <Fragment key={agreement.id}>
                <AgreementListItem
                  agreement={agreement}
                  withSeparator={index !== 0}
                  context="early-repayment"
                />
              </Fragment>
            ))}
          </div>
        </Widget>
      </Layout.Parent>
    </Layout>
  )
}

export default EarlyRepayments
