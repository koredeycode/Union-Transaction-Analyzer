export default function ChainUsageCard({
  sourceChains,
  destinationChains,
  total,
}) {
  const maxSource = Math.max(...sourceChains.map((c) => c.count));
  const maxDest = Math.max(...destinationChains.map((c) => c.count));

  const renderBar = (label, count, color) => (
    <div className="w-full" key={label}>
      <p className="text-sm mb-1 text-[var(--text-primary)]">
        {label} ({count})
      </p>
      <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
        <div
          className={`${color} h-2.5 rounded-full`}
          style={{ width: `${(count / total) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div>
      <h4 className="text-lg font-semibold mb-3 text-left text-[var(--text-primary)]">
        Chain Usage
      </h4>
      <div className="grid grid-cols-1  gap-6 text-left">
        <div className="glass-effect p-4 rounded-xl">
          <h4 className="text-lg font-semibold mb-1 text-[var(--text-primary)]">
            Top Source Chains
          </h4>
          <p className="text-sm text-[var(--text-secondary)] mb-3">
            Total: {sourceChains.length} chains
          </p>
          <div className="space-y-2">
            {sourceChains.map((chain) =>
              renderBar(chain.label, chain.count, "bg-cyan-400")
            )}
          </div>
        </div>
        <div className="glass-effect p-4 rounded-xl">
          <h4 className="text-lg font-semibold mb-1 text-[var(--text-primary)]">
            Top Destination Chains
          </h4>
          <p className="text-sm text-[var(--text-secondary)] mb-3">
            Total: {destinationChains.length} chains
          </p>
          <div className="space-y-2">
            {destinationChains.map((chain) =>
              renderBar(chain.label, chain.count, "bg-fuchsia-500")
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
