import { useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import PageBar from "../../../components/UI/PageBar"
import useAuth, { getUserOverviewQueryKey } from "../../../hooks/useAuth"
import BookCallBox from "../components/BookCallBox"
import OnboardingLayout from "../components/OnboardingLayout"

const BookCall = () => {
  const { t } = useTranslation("onboarding", { keyPrefix: "bookCall" })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const auth = useAuth()

  const proceed = async () => {
    await queryClient.invalidateQueries({
      queryKey: getUserOverviewQueryKey(auth.organisation?.organisationId!),
    })
    await navigate(-1)
  }

  return (
    <OnboardingLayout menu={false}>
      <OnboardingLayout.Parent
        pageBar={
          <PageBar
            title={t("title")}
            onClickBack={proceed}
            withChat
            desktopHeaderType="h4"
          />
        }
      >
        <BookCallBox pageMode />
      </OnboardingLayout.Parent>
    </OnboardingLayout>
  )
}

export default BookCall
