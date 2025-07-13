import React from "react";

type TokenData = {
  label: string;
  count: number;
};

type Props = {
  tokens: TokenData[];
  total: number;
};

const TokenUsageCard: React.FC<Props> = ({ tokens, total }) => {
  const getColor = (index: number): string => {
    const colors = [
      "bg-green-400",
      "bg-yellow-400",
      "bg-orange-400",
      "bg-purple-400",
      "bg-blue-400",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="p-4 rounded-xl text-left glass-effect">
      <h4 className="text-lg font-semibold mb-1 text-[var(--text-primary)]">
        Most Transferred Token
      </h4>
      <p className="text-sm text-[var(--text-secondary)] mb-3">
        Total: {tokens.length} tokens
      </p>
      <div className="space-y-2 text-[var(--text-primary)]">
        {tokens.map((token, index) => (
          <div className="w-full" key={token.label}>
            <p className="text-sm mb-1">
              {token.label} ({token.count})
            </p>
            <div className="bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
              <div
                className={`${getColor(index)} h-2.5 rounded-full`}
                style={{
                  width: total > 0 ? `${(token.count / total) * 100}%` : "0%",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TokenUsageCard;
