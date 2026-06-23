import { ReactNode } from "react"
import Typography from "../../../components/Basic/Typography"
import Chip from "../../../components/UI/Chip"
import MainBanner from "../../../components/UI/MainBanner"
import {
  DetailedAgreementDTO,
  DetailedAgreementDTOStatusEnum,
} from "../../../services/api/agreements"
import { upperCaseFirstLetter } from "../../../utils/string"

const HeaderBanner = ({
  agreement,
  title,
  subtitle,
  children,
}: {
  agreement: DetailedAgreementDTO
  title: ReactNode
  subtitle: string
  children?: ReactNode
}) => {
  const status = agreement.status
    ? upperCaseFirstLetter(agreement.status.toLowerCase())
    : ""

  return (
    <div className="relative">
      <MainBanner
        title={
          <>
            {title}
            <Typography type="smallCopy" className="text-center" color="white">
              {subtitle}
            </Typography>
          </>
        }
      >
        {children}
      </MainBanner>
      {status && (
        <div className="absolute top-4 left-4 z-30">
          <Chip
            label={status}
            color={
              agreement.status === DetailedAgreementDTOStatusEnum.Closed
                ? "disabled"
                : "success"
            }
          />
        </div>
      )}
    </div>
  )
}

export default HeaderBanner
