import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import Button from "../../../../components/Basic/Button"
import Typography from "../../../../components/Basic/Typography"
import Modal from "../../../../components/UI/Modal"
import useAuth from "../../../../hooks/useAuth"
import { useTracking } from "../../../../hooks/useTracking"
import { format } from "../../../../utils/money"
import { ONBOARDING_BASE_PATH } from "../../../onboarding/constants"
import FindBusiness from "../../components/eligibility-check/FindBusiness"
import ModalHeaderImage from "./assets/modal-header.webp"

const FundingEligibleBallparkOfferModal = ({
  onClose,
  ...props
}: React.ComponentProps<typeof Modal>) => {
  const { trackEvent } = useTracking()
  const navigate = useNavigate()
  const auth = useAuth()
  const { t } = useTranslation("registration", {
    keyPrefix: "eligibility.infoScreens.eligibleBallparkOffer",
  })
  const handleButtonClick = () => {
    trackEvent({
      category: "registration",
      name: "eligible-ballpark-offer",
      action: "proceed",
    })
    onClose?.()
  }

  const handleCloseClick = async () => {
    handleButtonClick()
    await navigate(ONBOARDING_BASE_PATH)
  }
  return (
    <Modal {...props} onClose={handleCloseClick} size="sm" className="!p-0">
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className="bg-brand-600 bg-cover bg-center p-4 text-center select-none"
        style={{ backgroundImage: `url(${ModalHeaderImage})` }}
        onClick={handleCloseClick}
      >
        <h2>
          <Typography
            tag="span"
            className="block"
            color="white"
            type="bodyMedium"
          >
            {t("title")}
          </Typography>
          <Typography
            tag="strong"
            color="white"
            type="h2"
            className="!leading-[1] !font-bold"
          >
            {format(
              auth.organisationData?.preliminaryOffer?.amount || 0,
              auth.organisationData?.preliminaryOffer?.currency || "USD",
              {
                minimumFractionDigits: 0,
              }
            )}
          </Typography>
        </h2>
      </div>
      <div className="flex flex-col gap-5 px-5 py-6">
        <Typography className="text-center select-none" type="body">
          {t("copy")}
        </Typography>
        <Button
          variant="primary"
          href={ONBOARDING_BASE_PATH}
          onClick={handleButtonClick}
          className="font-semibold"
        >
          {t("continue")}
        </Button>
      </div>
    </Modal>
  )
}

const FundingEligibleBallparkOffer = () => {
  return (
    <>
      <FundingEligibleBallparkOfferModal isOpen />
      <FindBusiness />
    </>
  )
}

export default FundingEligibleBallparkOffer
