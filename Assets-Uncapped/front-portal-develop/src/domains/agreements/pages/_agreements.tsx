import { HugeiconsIcon } from "@hugeicons/react"
import { ClipboardIcon } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import { useNavigate, useLocation } from "react-router"
import BoxIcon from "../../../components/Basic/BoxIcon"
import SwitcherV2 from "../../../components/Basic/Switcher/SwitcherV2"
import Typography from "../../../components/Basic/Typography"
import PageLoader from "../../../components/Collections/PageLoader"
import Layout from "../../../components/UI/Layout"
import PortalMenu from "../../../components/UI/PortalMenu"
import useAgreements from "../../../hooks/useAgreements"
import useBalances from "../../../hooks/useBalances"
import {
  AgreementsProductGroupEnum,
  DetailedAgreementDTOStatusEnum,
} from "../../../services/api/agreements"
import AgreementCard from "../components/AgreementCard/AgreementCard"

const AGREEMENT_URLS = {
  active: "/loans/",
  past: "/loans/past",
}

const AgreementsIndex = () => {
  const { t } = useTranslation("agreements", { keyPrefix: "list" })
  const navigate = useNavigate()
  const location = useLocation()
  const { data, isLoading } = useAgreements({
    productGroup: AgreementsProductGroupEnum.CustomerLoans,
  })
  const balances = useBalances()

  if (isLoading || balances.isLoading) {
    return <PageLoader />
  }

  const showPast = location.pathname.includes("past")
  const agreements = data
    ?.filter((agreement) =>
      showPast
        ? agreement.status === DetailedAgreementDTOStatusEnum.Closed
        : agreement.status === DetailedAgreementDTOStatusEnum.Active
    )
    // @ts-expect-error: type checks from api
    .toSorted((a, b) => b.activationDate! - a.activationDate!)

  return (
    <Layout menu={<PortalMenu menuOnMobile />}>
      <Layout.Parent>
        <SwitcherV2
          className="mb-6"
          defaultValue={showPast ? AGREEMENT_URLS.past : AGREEMENT_URLS.active}
          values={[
            { value: AGREEMENT_URLS.active, label: t("active") },
            { value: AGREEMENT_URLS.past, label: t("closed") },
          ]}
          onChange={async (newVal) => {
            await navigate(newVal)
          }}
        />
        {agreements?.length === 0 ? (
          <div className="shadow-light-sm border-card rounded-card-md flex flex-col items-center gap-4 bg-white p-10">
            <BoxIcon
              icon={<HugeiconsIcon icon={ClipboardIcon} />}
              severity="accent-3"
              size={10}
            />
            <div className="text-text-secondary flex max-w-[300px] flex-col gap-1 text-center">
              <Typography type="bodyTitle">
                {showPast ? t("empty.past.title") : t("empty.active.title")}
              </Typography>
              <Typography type="smallCopy">
                {showPast ? t("empty.past.copy") : t("empty.active.copy")}
              </Typography>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {agreements?.map((agreement) => (
              <AgreementCard key={agreement.id} agreement={agreement} />
            ))}
          </div>
        )}
      </Layout.Parent>
    </Layout>
  )
}

export default AgreementsIndex
