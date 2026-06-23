// Tiny chart-helper bits reused by MCA Bar Chart and DP Bar Chart.

export const stripeFill = (color: string) =>
  `repeating-linear-gradient(135deg, ${color} 0 4px, transparent 4px 8px)`

export const LegendSwatch = ({
  fill,
  label,
  solid = false,
}: {
  fill: string
  label: string
  solid?: boolean
}) => (
  <div className="flex items-center gap-2">
    <span
      className="size-[14px] shrink-0 rounded-[2px]"
      style={
        solid
          ? { backgroundColor: fill }
          : { backgroundColor: "#ffffff", backgroundImage: fill }
      }
      aria-hidden
    />
    <span className="font-primary text-[14px] font-semibold leading-[1.5]" style={{ color: "#193a43" }}>
      {label}
    </span>
  </div>
)
