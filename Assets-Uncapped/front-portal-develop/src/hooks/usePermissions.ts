import useBalances from "./useBalances"

const usePermissions = () => {
  const balances = useBalances()

  return {
    payment: {
      create:
        (balances.data?.aggregatedBalance?.values?.AVAILABLE_TOTAL || 0) > 0,
    },
  }
}

export default usePermissions
