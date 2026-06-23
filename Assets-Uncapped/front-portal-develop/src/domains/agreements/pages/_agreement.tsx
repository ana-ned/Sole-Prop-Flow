import PageLoader from "../../../components/Collections/PageLoader"
import ErrorIndex from "../../../pages/error/_error"
import DailyPayoutPage from "../components/DailyPayout/DailyPayoutPage"
import FixedPage from "../components/Fixed/FixedPage"
import InterestRatePage from "../components/InterestRate/InterestRatePage"
import LineOfCreditFixedPage from "../components/LineOfCreditFixed/LineOfCreditFixedPage"
import LineOfCreditInterestRatePage from "../components/LineOfCreditInterestRate/LineOfCreditInterestRatePage"
import RbfPage from "../components/Rbf/RbfPage"
import useAgreementData from "../hooks/useAgreementData"

const AgreementIndex = () => {
  const {
    agreement,
    balance,
    repaymentSchedule,
    backUrl,
    isLoading,
    isInterestRate,
    isLineOfCreditInterestRate,
    isLineOfCreditFixed,
    isRbf,
    isDailyPayout,
  } = useAgreementData()

  if (isLoading) {
    return <PageLoader />
  }

  if (!agreement) {
    return <ErrorIndex type="404" />
  }

  if (!balance) {
    return <ErrorIndex type="500" />
  }

  if (isLineOfCreditInterestRate) {
    return (
      <LineOfCreditInterestRatePage
        agreement={agreement}
        balance={balance}
        backUrl={backUrl}
      />
    )
  }

  if (isInterestRate) {
    return (
      <InterestRatePage
        agreement={agreement}
        balance={balance}
        backUrl={backUrl}
      />
    )
  }

  if (isLineOfCreditFixed) {
    return (
      <LineOfCreditFixedPage
        agreement={agreement}
        balance={balance}
        repaymentSchedule={repaymentSchedule}
        backUrl={backUrl}
      />
    )
  }

  if (isRbf) {
    return <RbfPage agreement={agreement} balance={balance} backUrl={backUrl} />
  }

  if (isDailyPayout) {
    return <DailyPayoutPage backUrl={backUrl} />
  }

  return (
    <FixedPage
      agreement={agreement}
      balance={balance}
      repaymentSchedule={repaymentSchedule}
      backUrl={backUrl}
    />
  )
}

export default AgreementIndex
