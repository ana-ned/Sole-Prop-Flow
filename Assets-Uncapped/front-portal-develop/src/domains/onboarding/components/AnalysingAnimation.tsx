const DELAYS = [0, 100, 200, 100, 200, 300, 200, 300, 400]

const AnalysingAnimation = () => {
  return (
    <div className="grid size-6 grid-cols-3 grid-rows-3 overflow-hidden rounded-[3px]">
      {DELAYS.map((delay, i) => (
        <div
          key={i}
          className="animate-analysing-pulse bg-current"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  )
}

export default AnalysingAnimation
