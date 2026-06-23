import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Routes, Route, useParams, Link, useNavigate } from "react-router"
import Button from "../../../components/Basic/Button"
import Typography from "../../../components/Basic/Typography"
import ListItemContainer from "../../../components/Collections/ListItemContainer"
import PageLoader from "../../../components/Collections/PageLoader"
import MissingLocDocumentsModal from "../../../components/Shared/MissingLocDocumentsModal/MissingLocDocumentsModal"
import Layout from "../../../components/UI/Layout"
import PageBar from "../../../components/UI/PageBar"
import PortalMenu from "../../../components/UI/PortalMenu"
import useDeal from "../../../hooks/useDeal"
import useDevice from "../../../hooks/useDevice"
import useLineOfCreditAgreements from "../../../hooks/useLineOfCreditAgreements"
import { useTracking } from "../../../hooks/useTracking"
import ErrorIndex from "../../../pages/error/_error"
import {
  DrawResponseStatusEnum,
  LineOfCreditResponseStatusEnum,
} from "../../../services/api/agreements"
import { ReactComponent as InfoIcon } from "../../../svgs/info.svg"
import { format } from "../../../utils/money"
import useMissingDocuments from "../../dashboard/hooks/useMissingDocuments"
import LocListItem from "../components/LocListItem"
import MissingDocumentsAlert from "../components/MissingDocumentsAlert"
import { canRequestDraw } from "../utils"
import BackgroundPatternImage from "./assets/backgroundPattern.svg"
import LineOfCreditDetails from "./line-of-credit-details"

const LineOfCreditIndex = () => {
  const { isDesktop } = useDevice()
  const { t } = useTranslation("line-of-credit")
  const { trackEvent } = useTracking()
  const { id } = useParams()
  const navigate = useNavigate()
  const { locAgreements } = useLineOfCreditAgreements()
  const [documentsModalOpen, setDocumentsModalOpen] = useState(false)
  const documents = useMissingDocuments()
  const deal = useDeal()
  const lineOfCredit = locAgreements.data?.content?.find(
    (item) => item.id === id
  )

  if (locAgreements.isLoading || documents.isLoading) {
    return <PageLoader />
  }

  if (!lineOfCredit) {
    return <ErrorIndex type="404" />
  }

  const pendingDraws = lineOfCredit.draws?.filter((draw) =>
    (
      [
        DrawResponseStatusEnum.WaitingForSignature,
        DrawResponseStatusEnum.Pending,
      ] as DrawResponseStatusEnum[]
    ).includes(draw.status!)
  )
  const activeDraws = lineOfCredit.draws?.filter(
    (draw) => draw.status === DrawResponseStatusEnum.Active
  )
  const closedDraws = lineOfCredit.draws?.filter(
    (draw) => draw.status === DrawResponseStatusEnum.Closed
  )

  const DrawButton = (
    <Button
      type="button"
      disabled={!canRequestDraw(lineOfCredit)}
      onClick={async () => {
        if (
          lineOfCredit.status ===
          LineOfCreditResponseStatusEnum.WaitingForDocuments
        ) {
          setDocumentsModalOpen(true)
        } else {
          trackEvent({
            category: "line-of-credit",
            name: "new-draw",
            action: "click",
          })
          await navigate(`/line-of-credit/${lineOfCredit.id}/draw`)
        }
      }}
    >
      {t("main.cta")}
    </Button>
  )

  return (
    <Layout
      menu={<PortalMenu />}
      sidebar={
        <Routes>
          <Route
            path="/details"
            element={
              <Layout.Child
                desktopTitle={
                  deal.isAmazonPartnership
                    ? t("details.titleFlexibleCreditLine")
                    : t("details.title")
                }
                redirectOnClose={`/line-of-credit/${lineOfCredit.id}`}
                withChat
              >
                <LineOfCreditDetails />
              </Layout.Child>
            }
          />
          {isDesktop && (
            <Route
              path="/"
              element={
                <Layout.Child
                  autoHeight
                  desktopTitle={
                    deal.isAmazonPartnership
                      ? t("details.titleFlexibleCreditLine")
                      : t("details.title")
                  }
                  withChat
                >
                  <LineOfCreditDetails />
                </Layout.Child>
              }
            />
          )}
        </Routes>
      }
    >
      <Layout.Parent>
        <PageBar
          title={
            lineOfCredit.status === LineOfCreditResponseStatusEnum.Paused
              ? t("main.title.paused")
              : t("main.title.available")
          }
          backUrl="/"
          actionButton={isDesktop && DrawButton}
        />
        <div className="grid gap-6">
          <div
            className="flex flex-col items-center gap-2 rounded-xl bg-cover bg-center bg-no-repeat px-6 pt-7 pb-6 text-center"
            style={{ backgroundImage: `url(${BackgroundPatternImage})` }}
          >
            <Typography type="h3" color="white">
              {format(
                lineOfCredit.balance?.available?.amount!,
                lineOfCredit.balance?.available?.currency!,
                {
                  minimumFractionDigits: 0,
                }
              )}
            </Typography>
            <Typography color="white">
              {t("main.outOfAmount", {
                amount: format(
                  lineOfCredit.limit!.amount!,
                  lineOfCredit.limit!.currency!,
                  {
                    minimumFractionDigits: 0,
                  }
                ),
              })}
            </Typography>
          </div>
          <MissingDocumentsAlert lineOfCredit={lineOfCredit} />
          {!isDesktop && (
            <div className="flex items-center justify-between">
              <Typography type="link" color="secondary">
                <Link
                  to={`/line-of-credit/${lineOfCredit.id}/details`}
                  className="flex items-center justify-end"
                >
                  {t("main.viewDetails")} <InfoIcon className="ml-2" />
                </Link>
              </Typography>
              {DrawButton}
            </div>
          )}
          {!!pendingDraws?.length && (
            <div>
              <Typography type="bodyTitle" className="mb-2" color="neutral-600">
                {t("main.draws.pendingDraws")}
              </Typography>
              <ListItemContainer>
                {pendingDraws.map((draw) => (
                  <LocListItem draw={draw} key={draw.id} />
                ))}
              </ListItemContainer>
            </div>
          )}
          {!!activeDraws?.length && (
            <div>
              <Typography type="bodyTitle" className="mb-2" color="neutral-600">
                {t("main.draws.yourDraws")}
              </Typography>
              <ListItemContainer>
                {activeDraws.map((draw) => (
                  <LocListItem draw={draw} key={draw.id} />
                ))}
              </ListItemContainer>
            </div>
          )}
          {!!closedDraws?.length && (
            <div>
              <Typography type="bodyTitle" className="mb-2" color="neutral-600">
                {t("main.draws.closedDraws")}
              </Typography>
              <ListItemContainer>
                {closedDraws.map((draw) => (
                  <LocListItem draw={draw} key={draw.id} />
                ))}
              </ListItemContainer>
            </div>
          )}
        </div>
        <MissingLocDocumentsModal
          isOpen={documentsModalOpen}
          onClose={() => {
            setDocumentsModalOpen(false)
          }}
          lineOfCredit={lineOfCredit}
          daysLeft={documents.data!.daysLeft}
        />
      </Layout.Parent>
    </Layout>
  )
}

export default LineOfCreditIndex
