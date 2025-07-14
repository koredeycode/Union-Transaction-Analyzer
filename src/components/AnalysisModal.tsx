import { useEffect, useState } from "react";
import { fetchTransfers } from "../lib/unionApi";
import { analyzeTransfers } from "../lib/analyzeTransfers";
import type { TransferAnalysisResult, Transfer } from "../types";

interface AnalysisModalProps {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  walletAddress: string;
  onShowResult: () => void;
  onSetResult: (result: TransferAnalysisResult | null) => void;
}

export default function AnalysisModal({
  isOpen,
  setIsOpen,
  walletAddress,
  onShowResult,
  onSetResult,
}: AnalysisModalProps) {
  const [transactionCount, setTransactionCount] = useState(0);
  const [phase, setPhase] = useState<"extracting" | "analyzing" | "done">(
    "extracting"
  );
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!isOpen || !walletAddress) return;

    let cancelled = false;

    async function fetchAndAnalyze() {
      setTransactionCount(0);
      setPhase("extracting");
      setHasError(false);

      const transfers: Transfer[] = [];
      let page: string | null = null;

      try {
        while (!cancelled) {
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

        if (transfers.length === 0) {
          setHasError(true);
          return;
        }

        setPhase("analyzing");

        setTimeout(() => {
          const result = analyzeTransfers(transfers);
          onSetResult(result);
          setPhase("done");
        }, 1500);
      } catch (err) {
        console.error("❌ Error during analysis:", err);
        setHasError(true);
      }
    }

    fetchAndAnalyze();

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
        <h3 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
          Analyzing Transactions...
        </h3>

        <div className="space-y-6">
          {/* Extracting */}
          <StatusRow
            phase={phase}
            status="extracting"
            label={`Getting transactions - (${transactionCount} found)`}
            success={transactionCount > 0}
            // showError={phase !== "extracting" && transactionCount === 0}
            showError={hasError}
          />

          {/* Analyzing */}
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
        </div>

        {/* Error */}
        {hasError && (
          <div className="mt-8 pt-6 border-t border-[var(--card-border)]">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-[var(--accent)] hover:opacity-90 text-[var(--accent-dark)] font-semibold py-4 px-4 rounded-xl shadow-lg shadow-[var(--accent)]/20 transition-all duration-300 transform hover:scale-105"
            >
              Restart Analysis
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
              Show Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Small reusable helper for cleaner render
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
