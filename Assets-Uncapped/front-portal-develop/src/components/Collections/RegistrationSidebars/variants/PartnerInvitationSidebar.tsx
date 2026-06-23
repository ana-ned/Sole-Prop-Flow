import { Trans, useTranslation } from "react-i18next"
import { RegistrationInvitationInfoResponseSourceEnum } from "../../../../services/api/organisation-users/models"
import SanitizedHtml from "../../../Basic/SanitizedHtml"
import Typography from "../../../Basic/Typography"
import Accordion from "../../../UI/Accordion"
import Layout from "../../../UI/Layout"
import { ReactComponent as ListIconChart } from "../assets/list-icon-chart.svg"
import { ReactComponent as ListIconMoney } from "../assets/list-icon-money.svg"
import { ReactComponent as ListIconStar } from "../assets/list-icon-star.svg"
import topImg from "../assets/sidebar-top.webp"

const getQueryLink = (
  source: RegistrationInvitationInfoResponseSourceEnum
): string | null => {
  switch (source) {
    case RegistrationInvitationInfoResponseSourceEnum.Marcus: {
      return "https://www.weareuncapped.com/goldman-sachs-faqs"
    }
    case RegistrationInvitationInfoResponseSourceEnum.Sellersfi: {
      return "https://www.weareuncapped.com/sellersfi-faqs"
    }
    default: {
      return null
    }
  }
}

const PartnerInvitationSidebar = ({
  source,
}: {
  source: RegistrationInvitationInfoResponseSourceEnum
}) => {
  const { t } = useTranslation("invitations", {
    keyPrefix: "PartnerInvitationSidebar",
  })

  const listIcons = [
    <ListIconStar key="list-icon-star" />,
    <ListIconChart key="list-icon-chart" />,
    <ListIconMoney key="list-icon-money" />,
  ]

  const queryLink = getQueryLink(source)

  return (
    <Layout.Sidebar
      className="bg-surface-elevated-2 flex flex-col items-center"
      content={
        <>
          <header className="flex w-full flex-col items-center bg-white pb-10">
            <img src={topImg} alt="top" className="w-full" />
            <ul className="mx-[60px] max-w-[490px] list-none p-0">
              {t("headerList", { returnObjects: true }).map(
                (el: string, i: number) => (
                  <li key={el} className="flex gap-4 [&:not(:last-child)]:mb-4">
                    {listIcons[i]}
                    <Typography>
                      <SanitizedHtml as="span" content={el} />
                    </Typography>
                  </li>
                )
              )}
            </ul>
          </header>
          <footer className="mx-[60px] my-10 mb-[60px] max-w-[490px]">
            <Typography type="h5" className="mb-5">
              {t("questionsHeader")}
            </Typography>
            <Accordion
              className="[&>div]:bg-none [&>div]:p-0 [&>div]:shadow-none"
              items={t("questionsAnswered", { returnObjects: true }).map(
                (el) => ({
                  label: el.label,
                  content: el.content,
                })
              )}
            />
            {queryLink && (
              <Typography className="mt-5">
                <Trans
                  ns="invitations"
                  i18nKey="PartnerInvitationSidebar.knowMore"
                  components={{
                    href: (
                      // eslint-disable-next-line jsx-a11y/anchor-has-content
                      <a href={queryLink} target="_blank" rel="noreferrer" />
                    ),
                  }}
                />
              </Typography>
            )}
          </footer>
        </>
      }
    />
  )
}

export default PartnerInvitationSidebar
