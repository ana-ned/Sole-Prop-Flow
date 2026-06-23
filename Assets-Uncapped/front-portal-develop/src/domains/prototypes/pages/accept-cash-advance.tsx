// Cash Advance-only acceptance flow.

import AcceptanceFlow from "../offers/_acceptance-flow"
import cashAdvance from "../offers/cash-advance"

const AcceptCashAdvance = () => <AcceptanceFlow offers={[cashAdvance]} />

export default AcceptCashAdvance
