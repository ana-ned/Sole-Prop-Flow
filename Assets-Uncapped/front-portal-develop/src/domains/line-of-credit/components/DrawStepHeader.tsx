import { useTranslation } from "react-i18next"
import { Link } from "react-router"
import Typography from "../../../components/Basic/Typography"
import Card from "../../../components/UI/Card"
import useDevice from "../../../hooks/useDevice"
import {
  DrawRepaymentPreviewResponse,
  DrawResponse,
  LineOfCreditResponse,
} from "../../../services/api/agreements"
import { format } from "../../../utils/money"
import DrawSummary from "./DrawSummary"

const DrawStepHeader = ({
  draw,
  lineOfCredit,
  deferredRepayments,
}: {
  draw: DrawResponse
  lineOfCredit: LineOfCreditResponse
  deferredRepayments?: DrawRepaymentPreviewResponse
}) => {
  const { t } = useTranslation("line-of-credit", {
    keyPrefix: "DrawStepHeader",
  })
  const { isMobile } = useDevice()

  return (
    <>
      <Card className="mb-6">
        <Typography className="mb-2 text-neutral-700">
          {t("amountToDraw")}
        </Typography>
        <Typography type="h4">
          {format(draw.size?.amount!, lineOfCredit.limit?.currency!)}
        </Typography>
      </Card>

      {isMobile && (
        <>
          <DrawSummary
            draw={draw}
            lineOfCredit={lineOfCredit}
            deferredRepayments={deferredRepayments}
          />
          <Typography className="mt-3 mb-4 text-right">
            <Link to="more">{t("more")}</Link>
          </Typography>
        </>
      )}
    </>
  )
}

export default DrawStepHeader
