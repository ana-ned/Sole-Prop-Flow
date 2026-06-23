import { HugeiconsIcon } from "@hugeicons/react"
import { MoneyBag02SolidRounded } from "@hugeicons-pro/core-solid-rounded"
import { StarAward02SolidSharp } from "@hugeicons-pro/core-solid-sharp"
import { MoneySend02SolidStandard } from "@hugeicons-pro/core-solid-standard"
import { useTranslation } from "react-i18next"
import BoxIcon from "../../../components/Basic/BoxIcon"
import ListItem from "../../../components/UI/ListItem"
import Widget from "../../../components/UI/Widget"
import usePermissions from "../../../hooks/usePermissions"
import useWithdrawCashLink from "../hooks/useWithdrawCashLink"

const MoreOptions = () => {
  const { t } = useTranslation("dashboard", {
    keyPrefix: "moreOptions",
  })
  const permissions = usePermissions()
  const withdrawCashLink = useWithdrawCashLink()

  const options = []

  if (permissions.payment.create) {
    options.push(
      <ListItem
        key="pay"
        to="/pay"
        event={{
          category: "dashboard",
          name: "button-pay",
          action: "click",
        }}
        icon={
          <BoxIcon
            severity="accent-4"
            icon={<HugeiconsIcon icon={MoneyBag02SolidRounded} />}
          />
        }
      >
        {t("pay")}
      </ListItem>
    )
  }

  if (withdrawCashLink) {
    options.push(
      <ListItem
        key="withdraw"
        to="/withdraw"
        event={{
          category: "dashboard",
          name: "button-withdraw_cash",
          action: "click",
        }}
        icon={
          <BoxIcon
            severity="accent-9"
            icon={<HugeiconsIcon icon={MoneySend02SolidStandard} />}
          />
        }
      >
        {t("withdrawCash")}
      </ListItem>
    )
  }

  options.push(
    <ListItem
      key="refer"
      target="_blank"
      to="https://www.weareuncapped.com/gb/referral"
      event={{
        category: "dashboard",
        name: "refer-and-earn",
        action: "click",
      }}
      icon={
        <BoxIcon
          severity="accent-1"
          icon={<HugeiconsIcon icon={StarAward02SolidSharp} />}
        />
      }
    >
      {t("referAndEarn")}
    </ListItem>
  )

  return (
    <Widget title={t("title")}>
      <div className="shadow-light-sm rounded-card-md flex flex-col gap-2 bg-white p-2">
        {options.map((option) => option)}
      </div>
    </Widget>
  )
}

export default MoreOptions
