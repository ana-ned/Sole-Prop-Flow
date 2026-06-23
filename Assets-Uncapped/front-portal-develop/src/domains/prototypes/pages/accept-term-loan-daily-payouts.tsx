// Term Loan + Daily Payouts acceptance flow.
// Composed from the shared shell + the two offer modules.

import AcceptanceFlow from "../offers/_acceptance-flow"
import termLoan from "../offers/term-loan"
import dailyPayouts from "../offers/daily-payouts"

const AcceptTermLoanDailyPayouts = () => (
  <AcceptanceFlow offers={[termLoan, dailyPayouts]} />
)

export default AcceptTermLoanDailyPayouts
