import { useEffect, useState } from "react";

import { fetchTransfers } from "../lib/unionApi";
import { analyzeTransfers } from "../lib/analyzeTransfers";
import data from "./sample.json";

export default function AnalysisModal({
  isOpen,
  onClose,
  onShowResult,
  onSetResult,
  walletAddress,
}) {
  const [transactionCount, setTransactionCount] = useState(0);
  const [phase, setPhase] = useState("extracting"); // extracting → analyzing → done
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    if (!isOpen || !walletAddress) return;

    // let isCancelled = false;

    async function fetchAndAnalyze() {
      setTransactionCount(0);
      setPhase("extracting");

      const transfers = [];
      let page = null;

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
        if (!lastSortOrder || batch.length < 100) {
          break;
        }

        page = lastSortOrder;

        //offline
        // transfers.push(...data);
        // setTransactionCount(transfers.length);
        // break;
      }

      // if (isCancelled) return;
      console.log("setiing phse to analysing");
      setPhase("analyzing");

      setTimeout(() => {
        if (!isCancelled) {
          const result = analyzeTransfers(transfers);
          onSetResult(result);
          setPhase("done");
        }
      }, 1500);
    }

    fetchAndAnalyze();

    return () => {
      // isCancelled = true;
    };
  }, []);
  // }, [isOpen, walletAddress, onComplete]);

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
              {/* <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                <div
                  className="bg-[var(--accent)] h-1.5 rounded-full progress-bar"
                  style={{ width: `${progressPercent}%` }}
                />
              </div> */}
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
            {/* <p className="text-sm text-[var(--text-secondary)] mb-3">
              or download the result
            </p>
            <div className="flex justify-center items-center">
              <button className="flex items-center gap-2 bg-[var(--card-background)] hover:bg-opacity-70 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200 px-4 py-2 rounded-lg border border-[var(--card-border)]">
                <span className="material-icons-outlined">file_download</span>
                <span className="font-medium">JSON</span>
              </button>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}
