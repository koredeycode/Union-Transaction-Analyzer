export default function PopularRoutesCard({ routes }) {
  return (
    <div className="p-4 rounded-xl text-left glass-effect">
      <h4 className="text-lg font-semibold mb-1 text-[var(--text-primary)]">
        Popular Routes
      </h4>
      <p className="text-sm text-[var(--text-secondary)] mb-3">
        Total: {routes.length} routes
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="p-2 text-left font-medium text-[var(--text-secondary)]">
                Source
              </th>
              <th className="p-2 text-left font-medium text-[var(--text-secondary)]">
                Destination
              </th>
              <th className="p-2 text-right font-medium text-[var(--text-secondary)]">
                Count
              </th>
            </tr>
          </thead>
          <tbody className="text-[var(--text-primary)]">
            {routes.map((route, i) => (
              <tr
                key={i}
                className="border-b border-slate-100 dark:border-slate-800"
              >
                <td className="p-2">{route.source}</td>
                <td className="p-2">{route.destination}</td>
                <td className="p-2 text-right font-medium">{route.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
