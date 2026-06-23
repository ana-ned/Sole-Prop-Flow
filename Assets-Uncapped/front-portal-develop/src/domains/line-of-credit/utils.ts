import {
  DrawResponse,
  LineOfCreditResponse,
  LineOfCreditResponseStatusEnum,
} from "../../services/api/agreements"

export const getTitle = (draw: DrawResponse) => {
  return draw.name?.replace("_", " ") || ""
}

export const canRequestDraw = (lineOfCredit: LineOfCreditResponse) => {
  // eslint-disable-next-line sonarjs/prefer-single-boolean-return
  if (
    lineOfCredit.status === LineOfCreditResponseStatusEnum.DrawPeriodEnded ||
    lineOfCredit.balance?.available?.amount === 0 ||
    lineOfCredit.drawParameters?.minimumDrawAmount?.amount! >
      lineOfCredit.balance?.available?.amount!
  ) {
    return false
  }

  return true
}
