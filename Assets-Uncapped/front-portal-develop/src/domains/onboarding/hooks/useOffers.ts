import { useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { isFuture } from "date-fns"
import useAuth from "../../../hooks/useAuth"
import useDeal from "../../../hooks/useDeal"
import {
  CommonOfferDetailsRepaymentTypeEnum,
  OfferControllerV3Api,
  OfferResponse,
  OfferResponseOfferStatusEnum,
} from "../../../services/api/agreements"
import apiConfig, { ApiServicesEnum } from "../../../services/api/api-config"
import { CustomerFacingDealDetailsResponseStageEnum } from "../../../services/api/hubspot"
import { OFFER_SELECTED_STATUSES } from "../utils/offers"

export const AGREEMENTS_OFFERS_QUERY_KEY = "AGREEMENTS-OFFERS"

const checkIfOfferManual = (offers?: OfferResponse[]) => {
  if (
    offers &&
    offers.length > 0 &&
    offers.every(
      (item) =>
        item.offerDetails?.commonOfferDetails?.repaymentType ===
        CommonOfferDetailsRepaymentTypeEnum.Manual
    )
  ) {
    return true
  }

  return offers
    ?.filter((offer: OfferResponse) =>
      (
        [
          OfferResponseOfferStatusEnum.Selected,
          OfferResponseOfferStatusEnum.PreSigned,
        ] as OfferResponseOfferStatusEnum[]
      ).includes(offer.offerStatus!)
    )
    .some(
      (item) =>
        item.offerDetails?.commonOfferDetails?.repaymentType ===
        CommonOfferDetailsRepaymentTypeEnum.Manual
    )
}

const useOffers = () => {
  const { isAuthenticated, getToken, organisation } = useAuth()
  const deal = useDeal()

  const query = useQuery({
    queryKey: [AGREEMENTS_OFFERS_QUERY_KEY],
    queryFn: async () =>
      new OfferControllerV3Api(
        apiConfig({
          token: await getToken(),
          service: ApiServicesEnum.Agreements,
        })
      ).getAllForPortal({
        xXORGID: organisation?.organisationId!,
      }),
    enabled: isAuthenticated && !!organisation?.organisationId,
    select: (data) =>
      data.filter((offer) => {
        if (offer.offerStatus === OfferResponseOfferStatusEnum.Expired) {
          return offer.dealId === deal.data?.id
        }

        return true
      }),
    refetchInterval:
      !organisation?.activated &&
      [
        CustomerFacingDealDetailsResponseStageEnum.DataCompleteness,
        CustomerFacingDealDetailsResponseStageEnum.DataValidation,
        CustomerFacingDealDetailsResponseStageEnum.Underwriting,
      ].includes(deal.data?.stage as any)
        ? 5000
        : false,
    refetchOnWindowFocus: false,
    notifyOnChangeProps: ["data", "error", "isLoading", "isError"], // this is required to avoid infinite re-renders during pooling above
  })

  const selectedOffer = query.data?.find(({ offerStatus }) =>
    OFFER_SELECTED_STATUSES.includes(offerStatus!)
  )

  const getOfferById = useCallback(
    (offerId: string) => {
      return query.data?.find((item) => item.id === offerId)
    },
    [query.data]
  )

  return {
    ...query,
    selectedOffer,
    getOfferById,
    isOfferManual: checkIfOfferManual(query.data),
    signeableOffers:
      query.data
        ?.filter((item) => item.expirationDate && isFuture(item.expirationDate))
        .filter((item) =>
          (
            [
              OfferResponseOfferStatusEnum.New,
              OfferResponseOfferStatusEnum.Selected,
              OfferResponseOfferStatusEnum.PreSigned,
            ] as OfferResponseOfferStatusEnum[]
          ).includes(item.offerStatus!)
        )
        .filter(
          (item) =>
            !(
              item.offerStatus === OfferResponseOfferStatusEnum.Selected &&
              item.offerDetails?.commonOfferDetails?.signedOffline
            )
        ) || [],
  }
}

export default useOffers
