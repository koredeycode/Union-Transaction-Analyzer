import React from "react";

type Props = {
  total: number;
  uniqueChains: number;
  topRoute: { source: string; destination: string };
  topToken: string;
  days: number;
  onRestart: () => void;
};

const FinalCard: React.FC<Props> = ({
  total,
  uniqueChains,
  topRoute,
  topToken,
  days,
  onRestart,
}) => {
  return (
    <div>
      <div className="px-4 pb-6 pt-4">
        <button
          className="mb-4 w-full bg-slate-800 dark:bg-black hover:bg-slate-700 dark:hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          onClick={() => {
            const tweetText = encodeURIComponent(
              `My @union_build journey 🚀\n\n📊 ${total} txns over ${days} days and ${uniqueChains} chains\n🔁 Top Route: ${topRoute.source} → ${topRoute.destination}\n💎 Top Token: ${topToken}\n\nFull stats in the images below!\n\nCheck yours at union-transaction-analyzer.vercel.app\n\nBuilt by @korefomo`
            );

            const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
            window.open(tweetUrl, "_blank");
          }}
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.205 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <span>Share on X</span>
        </button>
        <button
          className="w-full bg-[var(--accent)] hover:opacity-90 text-[var(--accent-dark)] font-semibold py-3 px-4 rounded-xl shadow-lg shadow-[var(--accent)]/20 transition-all duration-300 transform hover:scale-105"
          onClick={onRestart}
        >
          Analyze Another Wallet
        </button>
      </div>
    </div>
  );
};

export default FinalCard;
