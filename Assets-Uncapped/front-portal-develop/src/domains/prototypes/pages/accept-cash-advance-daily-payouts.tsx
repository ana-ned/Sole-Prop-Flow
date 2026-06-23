// Cash Advance + Daily Payouts acceptance flow.
// Composed from the shared shell + the two offer modules.

import AcceptanceFlow from "../offers/_acceptance-flow"
import cashAdvance from "../offers/cash-advance"
import dailyPayouts from "../offers/daily-payouts"

const AcceptCashAdvanceDailyPayouts = () => (
  <AcceptanceFlow offers={[cashAdvance, dailyPayouts]} />
)

export default AcceptCashAdvanceDailyPayouts
