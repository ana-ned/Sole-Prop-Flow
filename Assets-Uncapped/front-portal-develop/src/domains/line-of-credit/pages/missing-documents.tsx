import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Navigate, useLocation, useNavigate } from "react-router"
import { useShallow } from "zustand/shallow"
import Button from "../../../components/Basic/Button"
import Typography from "../../../components/Basic/Typography"
import PageLoader from "../../../components/Collections/PageLoader/PageLoader"
import DocumentsList from "../../../components/Shared/DocumentsList"
import Alert from "../../../components/UI/Alert"
import Layout from "../../../components/UI/Layout"
import PageBar from "../../../components/UI/PageBar"
import PortalMenu from "../../../components/UI/PortalMenu"
import useLineOfCreditAgreements from "../../../hooks/useLineOfCreditAgreements"
import useStore from "../../../hooks/useStore"
import { LineOfCreditResponseStatusEnum } from "../../../services/api/agreements"
import useMissingDocuments from "../../dashboard/hooks/useMissingDocuments"
import DocumentsEmptyImage from "../assets/documents-empty.webp"
import DocumentsSubmittedModal from "../components/missing-documents/DocumentsSubmittedModal"
import DoThisLaterModal from "../components/missing-documents/DoThisLaterModal"
import { LINE_OF_CREDIT_DOCUMENTS_PATH } from "../constants"

enum ModalType {
  DoThisLater,
  DocumentsSubmitted,
}

const MissingDocuments = () => {
  const { t } = useTranslation("line-of-credit", {
    keyPrefix: "missingDocuments",
  })
  const navigate = useNavigate()
  const { data, isLoading } = useMissingDocuments()
  const { locAgreements, currentLocAgreement } = useLineOfCreditAgreements()
  const [modal, setModal] = useState<ModalType | null>()
  const locationState = useLocation().state as
    | { backUrl?: string; origin?: string; id: string }
    | undefined
  const { documentsReferer, setDocumentsReferer } = useStore(
    useShallow((state) => ({
      documentsReferer: state.documentsReferer,
      setDocumentsReferer: state.setDocumentsReferer,
    }))
  )

  const isPaused =
    currentLocAgreement.data?.status === LineOfCreditResponseStatusEnum.Paused

  const isDrawRequest = documentsReferer?.origin === "DRAW_REQUEST"

  useEffect(() => {
    if (locationState?.origin === "DRAW_REQUEST" && !!locationState.id) {
      setDocumentsReferer({
        origin: "DRAW_REQUEST",
        id: locationState.id,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (data?.missingDocuments?.length === 0) {
      if (isDrawRequest) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        navigate(
          `/line-of-credit/${currentLocAgreement.data!.id}/draw/${documentsReferer.id}/sign`
        )
      } else {
        setModal(ModalType.DocumentsSubmitted)
      }
    }
  }, [
    currentLocAgreement.data,
    data,
    navigate,
    documentsReferer,
    isDrawRequest,
  ])

  if (isLoading || locAgreements.isLoading || currentLocAgreement.isLoading) {
    return <PageLoader />
  }

  if (locAgreements.data?.content?.length === 0) {
    return <Navigate to={"/"} />
  }

  const proceed = async (to?: string) => {
    setDocumentsReferer(undefined)
    await navigate(to || "/")
  }

  return (
    <Layout menu={<PortalMenu />}>
      <Layout.Parent className="flex flex-col">
        <PageBar
          desktopHeaderType="h4"
          title={t("title")}
          onClickBack={async () => {
            await proceed(locationState?.backUrl)
          }}
        />
        <div className="flex-grow-1">
          <Typography type="body">{t("copy")}</Typography>
          {data?.missingDocuments && data.missingDocuments.length > 0 && (
            <DocumentsList
              data={data.missingDocuments}
              path={LINE_OF_CREDIT_DOCUMENTS_PATH}
              category="onboarding"
            />
          )}
          {data?.missingDocuments?.length === 0 && isDrawRequest && (
            <>
              <img
                src={DocumentsEmptyImage}
                alt={t("title")}
                className="mb-4"
                style={{ width: "100%" }}
              />
              <Typography color="primary" className="mt-6">
                {t("thankYou")}
              </Typography>
            </>
          )}
        </div>
        <footer className="mt-10 flex flex-col gap-y-4">
          {isPaused && isDrawRequest && (
            <Alert type="info">{t("pauseAlert")}</Alert>
          )}
          {data?.missingDocuments &&
            data.missingDocuments.length > 0 &&
            !isDrawRequest && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setModal(ModalType.DoThisLater)
                }}
              >
                {t("later")}
              </Button>
            )}
          {isDrawRequest && (
            <Button
              type="button"
              variant="primary"
              disabled={
                !!data?.missingDocuments && data.missingDocuments.length > 0
              }
              onClick={async () => {
                await navigate(
                  `/line-of-credit/${currentLocAgreement.data!.id}/draw/${documentsReferer.id}/sign`
                )
              }}
            >
              {t("continue")}
            </Button>
          )}
        </footer>
      </Layout.Parent>
      <DoThisLaterModal
        isOpen={modal === ModalType.DoThisLater}
        onClose={() => {
          setModal(null)
        }}
        onClick={async () => {
          await proceed()
        }}
      />
      <DocumentsSubmittedModal
        isOpen={modal === ModalType.DocumentsSubmitted}
        onClose={async () => {
          await proceed()
        }}
      />
    </Layout>
  )
}

export default MissingDocuments
