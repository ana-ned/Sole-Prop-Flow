import { useTranslation } from "react-i18next"
import Button from "../../../../components/Basic/Button"
import Typography from "../../../../components/Basic/Typography"
import Card from "../../../../components/UI/Card/Card"
import Logo from "../../../../components/UI/Logo"
import { RegistrationInvitationInfoResponseStatusEnum } from "../../../../services/api/organisation-users"
import { RegistrationInvitationInfoResponseStatusEnum as RegistrationInvitationInfoResponseStatusEnumPartners } from "../../../../services/api/partners"

const InvitationFailedCard = ({
  status,
}: {
  status?:
    | RegistrationInvitationInfoResponseStatusEnumPartners
    | RegistrationInvitationInfoResponseStatusEnum
}) => {
  const { t } = useTranslation("invitations", { keyPrefix: "invitation" })

  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center">
      <Card>
        <div className="mx-auto my-0 h-14.5 w-65.5 pt-4">
          <Logo link={false} />
        </div>
        <Typography type="h5" className="mt-8 mb-6">
          {
            // @ts-expect-error not covering all statuses
            t(`errors.${status || "DEFAULT_ERROR"}.title`)
          }
        </Typography>
        <Typography type="body" className="mb-8 px-4">
          {
            // @ts-expect-error not covering all statuses
            t(`errors.${status || "DEFAULT_ERROR"}.description`)
          }
        </Typography>
        {status ===
          RegistrationInvitationInfoResponseStatusEnum.InvitationRegisteredUser && (
          <Button href="/" className="mb-3">
            {t("loginToAccount")}
          </Button>
        )}
      </Card>
    </div>
  )
}

export default InvitationFailedCard
