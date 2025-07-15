import React from "react";

type Duration = {
  label: string;
  range: string;
};

type Props = {
  total: number;
  uniqueChains: number;
  duration: Duration;
  success: number;
  pending: number;
  failed: number;
};

const BasicMetricsCard: React.FC<Props> = ({
  total,
  uniqueChains,
  duration,
  success,
  pending,
  failed,
}) => {
  // const successPercent = Math.round((success / (success + failed)) * 100);

  return (
    <div>
      <h4 className="text-lg font-semibold mb-2 text-left text-[var(--text-primary)]">
        Basic Metrics
      </h4>
      <div className="grid grid-cols-2 gap-4 text-left">
        <div className="glass-effect p-4 rounded-xl">
          <p className="md:text-sm text-xs text-[var(--text-secondary)]">
            Total Transactions
          </p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {total.toLocaleString()}
          </p>
        </div>
        <div className="glass-effect p-4 rounded-xl">
          <p className="text-sm text-[var(--text-secondary)]">Unique Chains</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {uniqueChains}
          </p>
        </div>
        <div className="glass-effect p-4 rounded-xl col-span-2">
          <p className="text-sm text-[var(--text-secondary)]">
            Duration{" "}
            <span className="text-xs text-[var(--text-tertiary)]">
              ({duration.label})
            </span>
          </p>
          <p className="md:text-lg text-sm font-bold text-[var(--text-primary)]">
            {duration.range}
          </p>
        </div>

        <div className="glass-effect p-4 rounded-xl col-span-2">
          <p className="text-sm text-[var(--text-secondary)] mb-2">
            Transaction Status
          </p>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 36 36"
              >
                {/* Failed */}
                <circle
                  className="stroke-current text-red-500"
                  cx="18"
                  cy="18"
                  fill="transparent"
                  r="15.9155"
                  strokeDasharray={`${(failed / total) * 100}, 100`}
                  strokeDashoffset="0"
                  strokeWidth="3"
                />
                {/* Pending */}
                <circle
                  className="stroke-current text-yellow-500"
                  cx="18"
                  cy="18"
                  fill="transparent"
                  r="15.9155"
                  strokeDasharray={`${(pending / total) * 100}, 100`}
                  strokeDashoffset={`-${(failed / total) * 100}`}
                  strokeWidth="3"
                />
                {/* Success */}
                <circle
                  className="stroke-current text-[var(--accent)]"
                  cx="18"
                  cy="18"
                  fill="transparent"
                  r="15.9155"
                  strokeDasharray={`${(success / total) * 100}, 100`}
                  strokeDashoffset={`-${
                    (failed / total + pending / total) * 100
                  }`}
                  strokeWidth="3"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-[var(--accent)]">
                {Math.round((success / total) * 100)}%
              </div>
            </div>
            <div className="text-sm space-y-2 text-[var(--text-primary)]">
              <p className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-[var(--accent)] mr-2"></span>
                Success ({success})
              </p>
              <p className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                Pending ({pending})
              </p>
              <p className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                Failed ({failed})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicMetricsCard;
