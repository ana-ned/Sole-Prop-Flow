import {
  TransactionFee,
  TransactionFeeTypeEnum,
} from "../../../services/api/agreements"

const EXPECTED_ORDER: Record<TransactionFeeTypeEnum, number> = {
  [TransactionFeeTypeEnum.ConvenienceFee]: 1,
  [TransactionFeeTypeEnum.CardFee]: 2,
  [TransactionFeeTypeEnum.CashTransferFee]: 3,
  [TransactionFeeTypeEnum.CurrencyExchangeFee]: 4,
  [TransactionFeeTypeEnum.TransferFee]: 5,
  [TransactionFeeTypeEnum.Unknown]: 6,
}

const sortFees = (fees?: TransactionFee[]) =>
  fees?.toSorted(
    (a, b) =>
      EXPECTED_ORDER[a.type] - EXPECTED_ORDER[b.type] ||
      a.type.localeCompare(b.type)
  ) || []

export default sortFees
