import useLineOfCreditAgreements from "../../../hooks/useLineOfCreditAgreements"

/**
 * Finds the LoC agreement matching the given agreement ID.
 * For Fixed draws, also checks nested `draws` array.
 */
const useLocAgreement = (
  agreementId: string | undefined,
  { includeDraws }: { includeDraws?: boolean } = {}
) => {
  const { locAgreements } = useLineOfCreditAgreements()

  const locAgreement = locAgreements.data?.content?.find((el) =>
    includeDraws
      ? el.agreementId?.id === agreementId ||
        el.draws?.some((draw) => draw.agreementId === agreementId)
      : el.agreementId?.id === agreementId
  )

  return locAgreement ?? null
}

export default useLocAgreement
