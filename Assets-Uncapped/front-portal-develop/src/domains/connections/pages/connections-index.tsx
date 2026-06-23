import { useState } from "react"
import clsx from "clsx"
import { useTranslation } from "react-i18next"
import Button from "../../../components/Basic/Button"
import Typography from "../../../components/Basic/Typography"
import ListItemContainer from "../../../components/Collections/ListItemContainer"
import CheckList from "../../../components/UI/CheckList"
import Layout from "../../../components/UI/Layout"
import ListItemLarge from "../../../components/UI/ListItemLarge"
import PortalMenu from "../../../components/UI/PortalMenu"
import useAuth from "../../../hooks/useAuth"
import useDeal from "../../../hooks/useDeal"
import useDevice from "../../../hooks/useDevice"
import { OrganisationOverviewOrganisationSourceEnum } from "../../../services/api/organisation-users"
import { ReactComponent as PlusIcon } from "../../../svgs/plus.svg"
import PartnershipWelcomeModal from "../../dashboard/components/PartnershipWelcomeModal"
import { ReactComponent as GroupAccountingIcon } from "../assets/group-accounting.svg"
import { ReactComponent as GroupAmazonIcon } from "../assets/group-amazon.svg"
import { ReactComponent as GroupBanksIcon } from "../assets/group-banks.svg"
import { ReactComponent as GroupSalesIcon } from "../assets/group-sales.svg"
import ConnectionBox from "../components/ConnectionBox"
import useConnections from "../hooks/useConnections"

const ConnectionsIndex = () => {
  const auth = useAuth()
  const { t } = useTranslation("connections", { keyPrefix: "index" })
  const connections = useConnections()
  const [modal, setModal] = useState<"WELCOME_PARTNERSHIP">()
  const { isMobile } = useDevice()
  const deal = useDeal()

  const groups = [
    ...(deal.isAmazonSeller
      ? [
          {
            title: t("groups.amazon.title"),
            connect: t("groups.amazon.connect"),
            connections: connections.salesConnections.filter((el) =>
              ["AMAZON", "AMAZON_V2"].includes(el.systemId!)
            ),
            route: "/connections/add/amazon",
            icon: <GroupAmazonIcon />,
          },
        ]
      : []),
    ...(deal.isAmazonSeller
      ? [
          {
            title: t("groups.otherSales.title"),
            connect: t("groups.otherSales.connect"),
            connections: connections.salesConnections.filter(
              (el) => !["AMAZON", "AMAZON_V2"].includes(el.systemId!)
            ),
            route: "/connections/add/sales",
            icon: <GroupSalesIcon />,
          },
        ]
      : []),
    ...(deal.isAmazonSeller
      ? []
      : [
          {
            title: t("groups.sales.title"),
            connect: t("groups.sales.connect"),
            connections: connections.salesConnections,
            route: "/connections/add/sales",
            icon: <GroupSalesIcon />,
          },
        ]),
    {
      title: t("groups.bank.title"),
      connect: t("groups.bank.connect"),
      connections: connections.bankingConnections,
      route: "/connections/add/bank-search",
      icon: <GroupBanksIcon />,
    },
    {
      title: t("groups.accounting.title"),
      connect: t("groups.accounting.connect"),
      connections: connections.accountingConnections,
      route: "/connections/add/accounting",
      icon: <GroupAccountingIcon />,
    },
  ]

  const requiredModeForPartnership =
    !auth.organisationData?.preferences?.seenMarcusWelcomeModal &&
    [
      OrganisationOverviewOrganisationSourceEnum.Marcus,
      OrganisationOverviewOrganisationSourceEnum.Sellersfi,
    ].includes(auth.organisationData?.organisationSource as any)

  return (
    <Layout
      menu={requiredModeForPartnership ? null : <PortalMenu menuOnMobile />}
      sidebar={
        !isMobile &&
        requiredModeForPartnership && (
          <Layout.Child autoHeight className="space-y-4">
            {t("sidebarBlocks", { returnObjects: true }).map((block) => (
              <div key={block.title}>
                <Typography type="bodyTitle" className="mb-4">
                  {block.title}
                </Typography>
                <CheckList items={block.list} />
              </div>
            ))}
          </Layout.Child>
        )
      }
    >
      <Layout.Parent
        className={clsx("flex flex-col", {
          "pb-6": isMobile && requiredModeForPartnership,
        })}
      >
        <Typography type={isMobile ? "h5" : "h4"} className="mb-4 md:mb-6">
          {t("title")}
        </Typography>

        <Typography className="mb-4 md:mb-8">
          {t(`descriptions.${deal.isAmazonSeller ? "amazon" : "core"}`)}
        </Typography>

        <div className="flex flex-col gap-y-5">
          {groups.map((item) => (
            <div key={item.title}>
              <Typography type="bodyTitle" className="mb-4">
                {item.title}
              </Typography>
              <ListItemContainer>
                {item.connections.map((connection) => (
                  <ConnectionBox key={connection.id} connection={connection} />
                ))}
                <ListItemLarge
                  icon={item.icon}
                  href={item.route}
                  title={item.connect}
                  more={{
                    type: "link",
                    element: <PlusIcon />,
                  }}
                />
              </ListItemContainer>
            </div>
          ))}
        </div>

        {requiredModeForPartnership && (
          <>
            <div className="mt-4 flex flex-col gap-y-4 text-center">
              <Button
                type="button"
                onClick={() => {
                  setModal("WELCOME_PARTNERSHIP")
                }}
                disabled={groups.some((item) => item.connections.length === 0)}
              >
                {t("buttons.submit")}
              </Button>
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  setModal("WELCOME_PARTNERSHIP")
                }}
              >
                {t("buttons.skip")}
              </Button>
            </div>

            <PartnershipWelcomeModal
              isOpen={modal === "WELCOME_PARTNERSHIP"}
              sourceType={auth.organisationData?.organisationSource as any}
            />
          </>
        )}
      </Layout.Parent>
    </Layout>
  )
}

export default ConnectionsIndex
