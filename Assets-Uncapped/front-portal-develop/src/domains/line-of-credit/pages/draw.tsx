import { useParams } from "react-router"
import PageLoader from "../../../components/Collections/PageLoader"
import MultistepForm from "../../../components/Headless/MultistepForm"
import useLineOfCreditAgreements from "../../../hooks/useLineOfCreditAgreements"
import ErrorIndex from "../../../pages/error/_error"
import { LineOfCreditResponseTypeEnum } from "../../../services/api/agreements"
import AddBank from "../components/draw/AddBank"
import DrawDepositMethod from "../components/draw/DrawDepositMethod"
import Loc2DrawSummary from "../components/draw/Loc2DrawSummary"
import NewDraw from "../components/draw/NewDraw"
import NewLoc2Draw from "../components/draw/NewLoc2Draw"
import UploadBankStatement from "../components/draw/UploadBankStatement"

const DrawIndex = () => {
  const { id } = useParams()
  const { locAgreements } = useLineOfCreditAgreements()
  const lineOfCredit = locAgreements.data?.content?.find(
    (item) => item.id === id
  )

  if (locAgreements.isLoading) {
    return <PageLoader />
  }

  if (!lineOfCredit) {
    return <ErrorIndex type="404" />
  }

  const isInterestRate =
    lineOfCredit.type === LineOfCreditResponseTypeEnum.InterestRate

  const steps = isInterestRate
    ? [
        <NewLoc2Draw key="new-loc2-draw" />,
        <Loc2DrawSummary key="loc2-draw-summary" />,
      ]
    : [
        <NewDraw key="new-draw" />,
        <DrawDepositMethod key="draw-deposit-method" />,
        <UploadBankStatement key="upload-bank-statement" />,
        <AddBank key="add-bank" />,
      ]

  return (
    <MultistepForm
      initialData={{
        backUrl: isInterestRate ? `/` : `/line-of-credit/${lineOfCredit.id}`,
        lineOfCredit,
      }}
    >
      {steps}
    </MultistepForm>
  )
}

export default DrawIndex
