import { TIER_BIG_BREAKPOINT } from "../../../utils/globals"

const isSmallTier = (revenue: number) => {
  return !!revenue && revenue < TIER_BIG_BREAKPOINT
}

export default isSmallTier
