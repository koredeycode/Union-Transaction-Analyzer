import {
  chainLogoMap,
  formatReadableUTC,
  formatTxAmount,
  getTxStatus,
} from "../lib/utils";
import type { Transfer, TransferAnalysisResult } from "../types";

export const TransactionDetails = ({
  tx,
  // isOpen,
  setIsOpen,
}: {
  tx: Transfer;
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex flex-col justify-start items-center z-50 p-2 md:p-8"
      id="transaction-detail-modal"
    >
      <div className="glass-effect rounded-2xl w-full max-w-sm text-left relative animate-view-in mt-8">
        <button
          className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-10"
          id="close-detail-modal-button"
        >
          <span
            className="material-icons-outlined"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            close
          </span>
        </button>
        <div className="p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              id="detail-status-icon"
            >
              {getTxStatus(tx) === "completed" && (
                <span className="material-icons-outlined text-4xl text-green-400">
                  check_circle
                </span>
              )}
              {getTxStatus(tx) === "pending" && (
                <div className="w-10 h-10 border-4 border-yellow-400 rounded-full border-t-transparent animate-spin-slow"></div>
              )}
              {getTxStatus(tx) === "failed" && (
                <span className="material-icons-outlined text-4xl text-red-400">
                  cancel
                </span>
              )}
            </div>
            <p
              className="text-3xl font-bold text-[var(--text-primary)]"
              id="detail-token-amount"
            >
              {formatTxAmount(tx)}
            </p>

            {getTxStatus(tx) === "completed" && (
              <p className="font-medium text-green-400" id="detail-status-text">
                Completed
              </p>
            )}
            {getTxStatus(tx) === "pending" && (
              <p
                className="font-medium text-yellow-400"
                id="detail-status-text"
              >
                Pending
              </p>
            )}
            {getTxStatus(tx) === "failed" && (
              <p className="font-medium text-red-400" id="detail-status-text">
                Failed
              </p>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">From</p>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.05)]">
                <img
                  alt="From Chain"
                  className="w-6 h-6 rounded-full"
                  id="detail-from-chain-icon"
                  src={chainLogoMap[tx.source_chain.universal_chain_id]}
                />
                <div>
                  <p
                    className="font-medium text-[var(--text-primary)]"
                    id="detail-from-chain-name"
                  >
                    {tx.source_chain.display_name}
                  </p>
                  <p
                    className="text-sm text-[var(--text-tertiary)] break-all"
                    id="detail-from-address"
                  >
                    {`${tx.sender_display.slice(
                      0,
                      5
                    )}...${tx.sender_display.slice(-5)}`}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <span className="material-icons-outlined text-xl text-[var(--text-secondary)]">
                arrow_downward
              </span>
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">To</p>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.05)]">
                <img
                  alt={tx.destination_chain.display_name}
                  className="w-6 h-6 rounded-full"
                  id="detail-to-chain-icon"
                  src={chainLogoMap[tx.destination_chain.universal_chain_id]}
                />
                <div>
                  <p
                    className="font-medium text-[var(--text-primary)]"
                    id="detail-to-chain-name"
                  >
                    {tx.destination_chain.display_name}
                  </p>
                  <p
                    className="text-sm text-[var(--text-tertiary)] break-all"
                    id="detail-to-address"
                  >
                    {`${tx.receiver_display.slice(
                      0,
                      5
                    )}...${tx.receiver_display.slice(-5)}`}
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-[var(--card-border)] text-center">
              <p
                className="text-sm text-[var(--text-secondary)]"
                id="detail-time"
              >
                {formatReadableUTC(tx.transfer_send_timestamp)}
              </p>
            </div>
          </div>
        </div>
        <p className="text-xs text-center mt-2 mb-2 text-gray-500 dark:text-gray-400">
          designed by{" "}
          <a
            className="font-semibold text-[var(--accent)] hover:underline"
            href="https://twitter.com/intent/follow?screen_name=korefomo"
            target="_blank"
            rel="noopener noreferrer"
          >
            @korefomo
          </a>
        </p>
      </div>
    </div>
  );
};

export const QuickAnalysisModal = ({
  quickAnalysis,
  setIsOpen,
}: {
  quickAnalysis: TransferAnalysisResult | null;
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}) => {
  return (
    quickAnalysis && (
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex flex-col justify-start items-center z-50 p-3 md:p-8 overflow-y-auto"
        id="analysis-modal"
      >
        <div>
          <div className="glass-effect rounded-2xl w-full max-w-sm text-left relative animate-view-in mt-8">
            <button
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-10"
              id="close-analysis-modal-button"
            >
              <span
                className="material-icons-outlined"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                close
              </span>
            </button>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-6 text-center text-[var(--text-primary)]">
                Quick Analysis
              </h3>
              <div className="w-full space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="md:text-sm text-xs text-[var(--text-secondary)]">
                      Total Transactions
                    </p>
                    <p className="text-xl font-bold text-[var(--text-primary)]">
                      {quickAnalysis.summary.total}
                    </p>
                  </div>
                  <div className="glass-effect p-3 rounded-lg">
                    <p className="md:text-sm text-xs text-[var(--text-secondary)]">
                      Unique Chains
                    </p>
                    <p className="text-xl font-bold text-[var(--text-primary)]">
                      {quickAnalysis.summary.uniqueChains}
                    </p>
                  </div>
                </div>
                <div className="glass-effect p-3 rounded-lg">
                  {/* <p className="text-sm text-[var(--text-secondary)] mb-1">
                    Duration
                  </p>
                  <p className="text-xl font-bold text-[var(--text-primary)]">
                    {quickAnalysis.basic.durationDays} days
                  </p> */}
                  <p className="text-sm text-[var(--text-secondary)]">
                    Duration{" "}
                    <span className="text-xs text-[var(--text-tertiary)]">
                      ({quickAnalysis.basic.durationDays}) days
                    </span>
                  </p>
                  <p className="md:text-lg text-sm font-bold text-[var(--text-primary)]">
                    {`${new Date(
                      quickAnalysis.basic.timeRange.from
                    ).toDateString()} - ${new Date(
                      quickAnalysis.basic.timeRange.to
                    ).toDateString()}`}
                  </p>
                </div>
                <div className="glass-effect p-3 rounded-lg">
                  <p className="text-sm text-[var(--text-secondary)] mb-1">
                    Top Route
                  </p>
                  <p className="md:text-xl text-sm font-bold text-[var(--text-primary)]">
                    {quickAnalysis.summary.topRoute.source}{" "}
                    <span className="text-[var(--text-secondary)]">→</span>{" "}
                    {quickAnalysis.summary.topRoute.destination}
                  </p>
                </div>
                <div className="glass-effect p-3 rounded-lg">
                  <p className="text-sm text-[var(--text-secondary)] mb-1">
                    Favorite Token
                  </p>
                  <p className="text-xl font-bold text-[var(--text-primary)]">
                    {quickAnalysis.summary.topToken}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">
                  designed by{" "}
                  <a
                    className="font-semibold text-[var(--accent)] hover:underline"
                    href="https://twitter.com/intent/follow?screen_name=korefomo"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @korefomo
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button
              className="mb-4 w-full bg-slate-800 dark:bg-black hover:bg-slate-700 dark:hover:bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              onClick={() => {
                const tweetText = encodeURIComponent(
                  `ZKGM! A quick proof of click 🚀\n\n📊 ${quickAnalysis?.summary.total} txns over ${quickAnalysis?.basic.durationDays} days and ${quickAnalysis?.basic.uniqueChains} chains\n🔁 Top Route: ${quickAnalysis?.summary.topRoute.source} → ${quickAnalysis?.summary.topRoute.destination}\n💎 Top Token: ${quickAnalysis?.summary.topToken}\n\nFull stats in the images below!\n\nCheck yours at union-transaction-analyzer.vercel.app/transactions\n\nBuilt by @korefomo`
                );

                const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
                window.open(tweetUrl, "_blank");
              }}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.205 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Share stats on X</span>
            </button>
          </div>
        </div>
      </div>
    )
  );
};
