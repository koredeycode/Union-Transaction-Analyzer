import { useEffect, useState } from "react";
import { fetchTransfers } from "../lib/unionApi";
import { analyzeTransfers } from "../lib/analyzeTransfers";
import type { Transfer, TransferAnalysisResult } from "../types";

interface AnalysisModalProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  walletAddresses: string[];
  onShowResult: () => void;
  onSetResult: (
    transfers: Transfer[],
    analysis: TransferAnalysisResult | null
  ) => void;
  isHome: boolean;
}

export default function AnalysisModal({
  isOpen,
  setIsOpen,
  walletAddresses,
  onShowResult,
  onSetResult,
  isHome,
}: AnalysisModalProps) {
  const [transactionCount, setTransactionCount] = useState(0);
  const [phase, setPhase] = useState<
    "extracting" | "analyzing" | "viewing" | "done"
  >("extracting");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!isOpen || !walletAddresses) return;

    let cancelled = false;

    async function fetchAndAnalyzeOrView() {
      setTransactionCount(0);
      setPhase("extracting");
      setHasError(false);

      const transfers: Transfer[] = [];
      // const analysis = {} as TransferAnalysisResult;
      let page: string | null = null;

      try {
        while (!cancelled) {
          const batch = await fetchTransfers({
            addresses: walletAddresses.filter((e) => e),
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

        if (transfers.length === 0) {
          setHasError(true);
          return;
        }

        const analysis = analyzeTransfers(transfers);
        if (isHome) {
          setPhase("analyzing");
          onSetResult(transfers, analysis);
          setPhase("done");
        } else {
          setPhase("viewing");
          onSetResult(transfers, analysis);
          setPhase("done");
        }
      } catch (err) {
        console.error("Error during analysis:", err);
        setHasError(true);
      }
    }

    fetchAndAnalyzeOrView();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="p-8">
      <div className="animate-view-in">
        <h3 className="md:text-xl text-lg font-bold mb-6 text-[var(--text-primary)]">
          {isHome ? "Analysing" : "Viewing"} Transactions...
        </h3>

        <div className="space-y-6">
          {/* Extracting */}
          <StatusRow
            phase={phase}
            status="extracting"
            label={`Getting transactions - (${transactionCount} found)`}
            success={transactionCount > 0}
            showError={hasError}
          />

          {/* Analyzing */}
          {isHome ? (
            <StatusRow
              phase={phase}
              status="analyzing"
              label={
                phase === "done" && transactionCount === 0
                  ? "No transactions to analyze"
                  : "Analyzing results..."
              }
              success={phase === "done" && transactionCount > 0}
              showError={hasError}
            />
          ) : (
            <StatusRow
              phase={phase}
              status="viewing"
              label={
                phase === "done" && transactionCount === 0
                  ? "No transactions to view"
                  : "Viewing results..."
              }
              success={phase === "done" && transactionCount > 0}
              showError={hasError}
            />
          )}
        </div>

        {/* Error */}
        {hasError && (
          <div className="mt-8 pt-6 border-t border-[var(--card-border)]">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-[var(--accent)] hover:opacity-90 text-[var(--accent-dark)] font-semibold py-4 px-4 rounded-xl shadow-lg shadow-[var(--accent)]/20 transition-all duration-300 transform hover:scale-105"
            >
              Restart {isHome ? "Analysis" : "View"}
            </button>
          </div>
        )}

        {/* Done */}
        {!hasError && phase === "done" && (
          <div className="mt-8 pt-6 border-t border-[var(--card-border)]">
            <button
              onClick={onShowResult}
              className="w-full bg-[var(--accent)] hover:opacity-90 text-[var(--accent-dark)] font-semibold py-4 px-4 rounded-xl shadow-lg shadow-[var(--accent)]/20 transition-all duration-300 transform hover:scale-105"
            >
              {isHome ? "Show Analysis" : "View Transactions"}
            </button>
            <p className="text-[var(--text-secondary)] mb-10 max-w-lg text-xs mt-2">
              Note that this app tracks only v2 transactions as at now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusRow({
  phase,
  status,
  label,
  success,
  showError = false,
}: {
  phase: string;
  status: string;
  label: string;
  success: boolean;
  showError?: boolean;
}) {
  const isCurrent = phase === status;

  let icon = null;
  if (isCurrent) {
    // Still running → show spinner
    icon = (
      <div className="w-6 h-6 border-2 border-[var(--accent)] rounded-full border-t-transparent animate-spin-slow" />
    );
  } else if (success) {
    // Completed successfully
    icon = (
      <span className="material-icons-outlined text-2xl text-green-400">
        check_circle
      </span>
    );
  }
  if (showError) {
    // Only show ❌ if explicitly told
    icon = (
      <span className="material-icons-outlined text-2xl text-red-400">
        cancel
      </span>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
      <div className="flex-1 text-left">
        <p className="text-[var(--text-primary)]">{label}</p>
      </div>
    </div>
  );
}
