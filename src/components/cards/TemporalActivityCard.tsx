import React from "react";

type DataPoint = {
  label: string;
  count: number;
};

type Props = {
  weekdayData: DataPoint[];
  monthlyData: DataPoint[];
  total: number;
};

const TemporalActivityCard: React.FC<Props> = ({
  weekdayData,
  monthlyData,
  total,
}) => {
  const barHeight = (count: number): string =>
    total > 0 ? `${(count / total) * 100}%` : "0%";

  return (
    <div>
      <h4 className="text-lg font-semibold mb-3 text-left text-[var(--text-primary)]">
        Temporal Insight
      </h4>
      <div className="space-y-6">
        {/* Weekday chart */}
        <div className="p-4 rounded-xl text-left glass-effect">
          <p className="text-sm text-[var(--text-secondary)] text-left mb-2">
            By Weekday
          </p>
          <div className="flex justify-between items-end h-32 space-x-2">
            {weekdayData.map((day, i) => (
              <div
                key={i}
                className="flex flex-col items-center flex-1 h-full justify-end"
              >
                <div className="text-xs text-[var(--text-secondary)] mb-1">
                  {day.count}
                </div>
                <div
                  className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-md"
                  style={{ height: barHeight(day.count) }}
                >
                  <div className="bg-[var(--accent)] w-full h-full rounded-t-md"></div>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {day.label.slice(0, 3)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly chart */}
        <div className="p-4 rounded-xl text-left glass-effect">
          <p className="text-sm text-[var(--text-secondary)] text-left mb-2">
            By Month
          </p>
          <div className="flex justify-between items-end h-32 space-x-2">
            {monthlyData.map((month, i) => (
              <div
                key={i}
                className="flex flex-col items-center flex-1 h-full justify-end"
              >
                <div className="text-xs text-[var(--text-secondary)] mb-1">
                  {month.count}
                </div>
                <div
                  className="w-full bg-slate-200 dark:bg-slate-700 rounded-t-md"
                  style={{ height: barHeight(month.count) }}
                >
                  <div className="bg-[var(--accent)] w-full h-full rounded-t-md"></div>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)] mt-1">
                  {month.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemporalActivityCard;
