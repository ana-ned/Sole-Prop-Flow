// Term Loan-only acceptance flow.

import AcceptanceFlow from "../offers/_acceptance-flow"
import termLoan from "../offers/term-loan"

const AcceptTermLoan = () => <AcceptanceFlow offers={[termLoan]} />

export default AcceptTermLoan
