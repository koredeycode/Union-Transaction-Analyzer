import { useEffect, useState } from "react";
import { fetchTransfers } from "../lib/unionApi";
import { analyzeTransfers } from "../lib/analyzeTransfers";
import type { TransferAnalysisResult, Transfer } from "../types"; // ← define these
// ← define these

interface AnalysisModalProps {
  isOpen: boolean;
  walletAddress: string;
  onShowResult: () => void;
  onSetResult: (result: TransferAnalysisResult | null) => void;
}

export default function AnalysisModal({
  isOpen,
  walletAddress,
  onShowResult,
  onSetResult,
}: AnalysisModalProps) {
  const [transactionCount, setTransactionCount] = useState<number>(0);
  const [phase, setPhase] = useState<"extracting" | "analyzing" | "done">(
    "extracting"
  );

  useEffect(() => {
    if (!isOpen || !walletAddress) return;

    let cancelled = false;

    async function fetchAndAnalyze() {
      setTransactionCount(0);
      setPhase("extracting");

      const transfers: Transfer[] = [];
      let page: string | null = null;

      while (true) {
        const batch = await fetchTransfers({
          address: walletAddress,
          limit: 100,
          page,
        });

        if (!batch.length) break;
        transfers.push(...batch);
        setTransactionCount(transfers.length);

        const lastSortOrder = batch[batch.length - 1].sort_order;
        if (!lastSortOrder || batch.length < 100) break;
        page = lastSortOrder;
      }

      if (cancelled) return;

      setPhase("analyzing");

      setTimeout(() => {
        if (cancelled) return;
        const result = analyzeTransfers(transfers);
        onSetResult(result);
        setPhase("done");
      }, 1500);
    }

    fetchAndAnalyze();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="p-8">
      <div className="animate-view-in">
        <h3 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
          Analyzing Transactions...
        </h3>

        <div className="space-y-6">
          {/* Extraction */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 flex items-center justify-center">
              {phase === "extracting" ? (
                <div className="w-6 h-6 border-2 border-[var(--accent)] rounded-full border-t-transparent animate-spin-slow" />
              ) : (
                <span className="material-icons-outlined text-2xl text-green-400">
                  check_circle
                </span>
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="text-[var(--text-primary)]">
                Getting transactions - ({transactionCount} transactions found)
              </p>
            </div>
          </div>

          {/* Analysis */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 flex items-center justify-center">
              {phase === "done" ? (
                <span className="material-icons-outlined text-2xl text-green-400">
                  check_circle
                </span>
              ) : (
                <div
                  className={`w-6 h-6 border-2 border-slate-500 rounded-full border-t-transparent ${
                    phase === "analyzing" ? "animate-spin-slow" : "hidden"
                  }`}
                />
              )}
            </div>
            <div className="flex-1 text-left">
              <p
                className={`${
                  phase === "analyzing" || phase === "done"
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)]"
                }`}
              >
                {phase === "done" ? "Analysis Complete!" : "Analyzing results"}
              </p>
            </div>
          </div>
        </div>

        {/* Done Actions */}
        {phase === "done" && (
          <div className="mt-8 pt-6 border-t border-[var(--card-border)]">
            <button
              onClick={onShowResult}
              className="w-full bg-[var(--accent)] hover:opacity-90 text-[var(--accent-dark)] font-semibold py-4 px-4 rounded-xl shadow-lg shadow-[var(--accent)]/20 transition-all duration-300 transform hover:scale-105"
            >
              Show Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
