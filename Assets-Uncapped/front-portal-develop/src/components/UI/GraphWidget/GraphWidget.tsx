import {
  CartesianGrid,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CurveProps,
  Area,
} from "recharts"
import Typography from "../../Basic/Typography"
import Loader from "../Loader"

export interface GraphWidgetProps {
  title?: string
  description?: string
  height: number
  data: { name: string; value: number }[]
  type: CurveProps["type"]
  nameFormatter?: (name: string) => string
  valueFormatter?: (value: number) => string
  isLoading?: boolean
}

const GraphWidget = ({
  title,
  description,
  height,
  data,
  type,
  nameFormatter,
  valueFormatter,
  isLoading,
}: GraphWidgetProps) => {
  const longestLabelLength = Math.max(
    ...data.map(
      ({ value }) =>
        (valueFormatter ? valueFormatter(value) : value.toString()).length
    )
  )

  if (!isLoading && data.length === 0) {
    return null
  }

  return (
    <>
      {!!title && (
        <Typography type="bodyTitle" className="p-4" color="neutral-600">
          {title}
        </Typography>
      )}
      <div className="w-full p-2">
        {isLoading ? (
          <div style={{ height }}>
            <Loader />
          </div>
        ) : (
          <ResponsiveContainer height={height}>
            <AreaChart
              data={data}
              {...{
                overflow: "visible",
              }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1ebdc0" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#1ebdc0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="2 2"
                vertical={false}
                stroke="var(--color-neutral-300)"
              />
              <XAxis
                type="category"
                dataKey="name"
                tick={{
                  fill: "var(--color-neutral-600)",
                  fontSize: 14,
                  fontFamily: "Sora",
                  fontWeight: 700,
                  dy: 12,
                }}
                tickLine={false}
                stroke="var(--color-neutral-300)"
                tickFormatter={nameFormatter}
                allowDuplicatedCategory={false}
                ticks={[data[0]?.name, data.at(-1)?.name!]}
              />
              <YAxis
                domain={[0, "dataMax"]}
                tick={{
                  fill: "var(--color-neutral-600)",
                  fontSize: 14,
                  fontFamily: "Sora",
                  fontWeight: 700,
                }}
                tickLine={false}
                tickCount={5}
                axisLine={false}
                height={30}
                interval="preserveStartEnd"
                tickFormatter={valueFormatter}
                width={longestLabelLength * 9}
              />
              <Area
                type={type}
                dataKey="value"
                stroke="#1ebdc0"
                fill="url(#colorUv)"
                strokeWidth="2px"
                strokeLinecap="round"
                strokeLinejoin="round"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
        {description && (
          <Typography
            color="neutral-600"
            type="smallCopy"
            className="mt-3 text-center"
          >
            {description}
          </Typography>
        )}
      </div>
    </>
  )
}

export default GraphWidget
