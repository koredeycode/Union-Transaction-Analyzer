import React from "react";

type TopRoute = {
  source: string;
  destination: string;
};

type Props = {
  total: number;
  uniqueChains: number;
  topDay: string;
  topMonth: string;
  topRoute: TopRoute;
  topToken: string;
};

const SummaryCard: React.FC<Props> = ({
  total,
  uniqueChains,
  topDay,
  topMonth,
  topRoute,
  topToken,
}) => {
  return (
    <div>
      <h4 className="md:text-lg text-sm font-semibold mb-3 text-left text-[var(--text-primary)]">
        Your On-Chain Summary
      </h4>
      <div className="w-full space-y-4 text-left">
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-effect p-3 rounded-lg">
            <p className="md:text-sm text-xs text-[var(--text-secondary)]">
              Total Transactions
            </p>
            <p className="text-xl font-bold text-[var(--text-primary)]">
              {total.toLocaleString()}
            </p>
          </div>
          <div className="glass-effect p-3 rounded-lg">
            <p className="md:text-sm text-xs text-[var(--text-secondary)]">
              Unique Chains
            </p>
            <p className="text-xl font-bold text-[var(--text-primary)]">
              {uniqueChains}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-effect p-3 rounded-lg">
            <p className="md:text-sm text-xs text-[var(--text-secondary)] mb-1">
              Most Active Day
            </p>
            <p className="text-xl font-bold text-[var(--text-primary)]">
              {topDay}
            </p>
          </div>
          <div className="glass-effect p-3 rounded-lg">
            <p className="md:text-sm text-xs text-[var(--text-secondary)] mb-1">
              Most Active Month
            </p>
            <p className="text-xl font-bold text-[var(--text-primary)]">
              {topMonth}
            </p>
          </div>
        </div>
        <div className="glass-effect p-3 rounded-lg">
          <p className="text-sm text-[var(--text-secondary)] mb-1">Top Route</p>
          <p className="md:text-xl text-sm font-bold text-[var(--text-primary)]">
            {topRoute.source}{" "}
            <span className="text-[var(--text-secondary)]">→</span>{" "}
            {topRoute.destination}
          </p>
        </div>
        <div className="glass-effect p-3 rounded-lg">
          <p className="text-sm text-[var(--text-secondary)] mb-1">
            Favorite Token
          </p>
          <p className="text-xl font-bold text-[var(--text-primary)]">
            {topToken}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
