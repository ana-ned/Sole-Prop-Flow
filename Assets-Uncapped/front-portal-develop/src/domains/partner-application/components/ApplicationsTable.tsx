import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import PageLoader from "../../../components/Collections/PageLoader"
import useDevice from "../../../hooks/useDevice"
import {
  ApplicationDetailsResponse,
  ApplicationDetailsResponseStatusEnum,
} from "../../../services/api/partners"
import useApplications from "../hooks/useApplications"
import {
  formatPartnerApplicationDate,
  getPartnerApplicationTitle,
} from "../partner-application.utils"
import OfferAmount from "./OfferAmount"
import StatusBadge from "./StatusBadge"

const ApplicationsTable = () => {
  const { t } = useTranslation("partner-application", {
    keyPrefix: "applicationsTable",
  })
  const { isDesktop } = useDevice()
  const navigate = useNavigate()
  const query = useApplications()

  const handleItemClick = async (item: ApplicationDetailsResponse) => {
    await (item.status === ApplicationDetailsResponseStatusEnum.Draft
      ? navigate(`/partner/application/create/${item.id}`)
      : navigate(`/partner/application/details/${item.id}`))
  }

  if (query.isLoading) {
    return <PageLoader />
  }

  const thClass = "p-4 text-sm font-bold text-neutral-800"
  const tdClass =
    "border-b border-neutral-300 bg-white p-4 text-sm text-neutral-800 transition-all duration-150 ease-in-out group-hover:bg-neutral-300 group-last:border-b-0 first:group-first:rounded-tl-xl last:group-first:rounded-tr-xl first:group-last:rounded-bl-xl last:group-last:rounded-br-xl"

  return (
    <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
      <table className="w-full align-top">
        <thead className="align-bottom">
          <tr>
            <th className={thClass}>{t("companyName")}</th>
            <th className={thClass}>{t("dealStage")}</th>
            {isDesktop && <th className={thClass}>{t("dateCreated")}</th>}
            {isDesktop && <th className={thClass}>{t("offer")}</th>}
          </tr>
        </thead>
        <tbody>
          {query.data?.content?.map((item) => (
            <tr
              key={item.id}
              className="group"
              onClick={async () => {
                await handleItemClick(item)
              }}
              role="button"
            >
              <td className={tdClass}>{getPartnerApplicationTitle(item)}</td>
              <td className={tdClass} aria-label={item.status}>
                <StatusBadge application={item} />
              </td>
              {isDesktop && (
                <td className={tdClass}>
                  {formatPartnerApplicationDate(item.createDate)}
                </td>
              )}
              {isDesktop && (
                <td
                  className={tdClass}
                  aria-label={String(item.offerDetailsResponse?.amount)}
                >
                  <OfferAmount application={item} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ApplicationsTable
