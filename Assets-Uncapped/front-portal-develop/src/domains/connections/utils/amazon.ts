export enum AmazonRegionsEnum {
  NorthAmerica = "NorthAmerica",
  Europe = "Europe",
  FarEast = "FarEast",
}

export const AMAZON_ELIGIBLE_REGIONS = {
  [AmazonRegionsEnum.Europe]: [
    "GBR",
    "ESP",
    "ITA",
    "POL",
    "NLD",
    "DEU",
    "FRA",
    "SWE",
    "TUR",
    "SAU",
    "ARE",
    "EGY",
    "IND",
  ],
  [AmazonRegionsEnum.NorthAmerica]: ["USA", "BRA", "CAN", "MEX"],
  [AmazonRegionsEnum.FarEast]: ["SGP", "JPN", "AUS"],
}
