// import { useState } from "react";
import { useEffect, useState } from "react";
import type { Transfer, TransferAnalysisResult } from "../types";
import { analyzeTransfers } from "../lib/analyzeTransfers";
// import html2canvas from "html2canvas";

// const STORY_DURATION = 5000;

const chains = [
  {
    display_name: "Xion Testnet",
    universal_chain_id: "xion.xion-testnet-2",
    logo_uri: "https://app.union.build/logos/chains/color/XION.svg",
  },
  // {
  //   display_name: "Union Testnet",
  //   universal_chain_id: "union.union-testnet-10",
  //   logo_uri:
  //     "https://cache-logos.unionlabs.workers.dev/unionlabs/token-lists/main/logos/UNION.svg",
  // },
  {
    display_name: "Sei Testnet",
    universal_chain_id: "sei.1328",
    logo_uri: "https://app.union.build/logos/chains/color/SEI.svg",
  },
  {
    display_name: "Osmosis Testnet",
    universal_chain_id: "osmosis.osmo-test-5",
    logo_uri: "https://app.union.build/logos/chains/color/OSMOSIS.svg",
  },
  {
    display_name: "Holesky",
    universal_chain_id: "ethereum.17000",
    logo_uri: "https://app.union.build/logos/chains/color/ETHEREUM.svg",
  },
  {
    display_name: "Sepolia",
    universal_chain_id: "ethereum.11155111",
    logo_uri: "https://app.union.build/logos/chains/color/ETHEREUM.svg",
  },
  {
    display_name: "Corn Testnet",
    universal_chain_id: "corn.21000001",
    logo_uri: "https://app.union.build/logos/chains/color/CORN.svg",
  },
  {
    display_name: "BSC Testnet",
    universal_chain_id: "bsc.97",
    logo_uri: "https://app.union.build/logos/chains/color/BSC.svg",
  },
  // {
  //   display_name: "BOB Testnet",
  //   universal_chain_id: "bob.808813",
  //   logo_uri:
  //     "https://cache-logos.unionlabs.workers.dev/unionlabs/token-lists/main/logos/BOB.svg",
  // },
  // {
  //   display_name: "Bepolia",
  //   universal_chain_id: "berachain.80069",
  //   logo_uri:
  //     "https://cache-logos.unionlabs.workers.dev/unionlabs/token-lists/main/logos/BERACHAIN.svg",
  // },
  // {
  //   display_name: "Base Testnet",
  //   universal_chain_id: "base.84532",
  //   logo_uri:
  //     "https://cache-logos.unionlabs.workers.dev/unionlabs/token-lists/main/logos/BASE.svg",
  // },
  {
    display_name: "Babylon Testnet",
    universal_chain_id: "babylon.bbn-test-5",
    logo_uri: "https://app.union.build/logos/chains/color/BABYLON.svg",
  },
];

const chainLogoMap = Object.fromEntries(
  chains.map((chain) => [chain.universal_chain_id, chain.logo_uri])
);

interface TransactionProps {
  idx: number;
  transfer: Transfer;
}

function formatTxAmount(tx: Transfer): string {
  let symbol = tx.base_token_symbol || tx.base_token;
  if (symbol.length > 20) {
    symbol = `${symbol.slice(0, 5)}...${symbol.slice(-5)}`;
  }
  const decimals = tx.base_token_decimals || 18;
  // console.log(tx.quote_amount, tx.base_token_decimals);
  const rawAmount = BigInt(tx.base_amount);
  const amount = Number(rawAmount) / 10 ** decimals;

  return `${amount} ${symbol}`;
}

function getTxStatus(tx: Transfer): "completed" | "failed" | "pending" {
  if (tx.success === true) {
    return "completed";
  } else if (tx.success === false) {
    return "failed";
  } else {
    return "pending";
  }
}

function timeAgo(dateString: string) {
  const now: Date = new Date();
  const then: Date = new Date(dateString);
  const secondsAgo = Math.floor((now.getTime() - then.getTime()) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const { label, seconds } of intervals) {
    const count = Math.floor(secondsAgo / seconds);
    if (count > 0) {
      return `${count} ${label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

const Transaction: React.FC<TransactionProps> = ({ idx, transfer }) => {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg glass-effect hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer"
      id={`transaction-${idx}`}
    >
      <div className="flex-[2] flex flex-col justify-start items-start">
        <p className="font-medium text-xs text-sm text-[var(--text-primary)]">
          {formatTxAmount(transfer)}
        </p>

        <div className="flex items-center gap-1 mt-1">
          <img
            alt={`${transfer.source_chain.display_name}`}
            className="w-4 h-4 rounded-full"
            src={chainLogoMap[transfer.source_chain.universal_chain_id]}
          />
          <span className="text-xs md:text-sm text-[var(--text-secondary)]">
            {transfer.source_chain.display_name}
          </span>
          <span className="material-icons-outlined text-xs md:text-sm text-[var(--text-secondary)]">
            arrow_forward
          </span>
          <img
            alt={`${transfer.destination_chain.display_name}`}
            className="w-4 h-4 rounded-full"
            src={chainLogoMap[transfer.destination_chain.universal_chain_id]}
          />
          <span className="text-xs md:text-sm text-[var(--text-secondary)]">
            {transfer.destination_chain.display_name}
          </span>
        </div>
      </div>
      <div className="flex-1 text-right md:text-center mx-4">
        {getTxStatus(transfer) === "completed" && (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-500/10 text-green-400">
            Completed
          </span>
        )}
        {getTxStatus(transfer) === "pending" && (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-500/10 text-yellow-400">
            Pending
          </span>
        )}
        {getTxStatus(transfer) === "failed" && (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-500/10 text-red-400">
            Failed
          </span>
        )}
      </div>
      <div className="flex-1 text-right hidden md:block">
        <p className="text-sm text-[var(--text-secondary)]">
          {timeAgo(transfer.transfer_send_timestamp)}
        </p>
      </div>
    </div>
  );
};

const TransactionDetails = ({
  tx,

  setIsOpen,
}: {
  tx: Transfer;
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex flex-col justify-start items-center z-50 p-2 md:p-8 overflow-y-auto"
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
                Time: {timeAgo(tx.transfer_send_timestamp)}
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

const QuickAnalysisModal = ({
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
                  <p className="text-sm text-[var(--text-secondary)] mb-1">
                    Duration
                  </p>
                  <p className="text-xl font-bold text-[var(--text-primary)]">
                    {quickAnalysis.basic.durationDays} days
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

interface TransactionListProps {
  transfers: Transfer[];
  analysis: TransferAnalysisResult | null;
  setIsInnerOpen: (state: boolean) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transfers,
  analysis,
  setIsInnerOpen,
}) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [isQAModalOpen, setIsQAModalOpen] = useState(false);
  const [isTDModalOPen, setIsTDModalOpen] = useState(false);

  const [indexOfTransaction, setIndexOfTransacton] = useState(0);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    sourceChain: "All Sources",
    status: "All Statuses",
    destinationChain: "All Destinations",
  });

  const [filteredTransfers, setFilteredTransfers] =
    useState<Transfer[]>(transfers);

  function resetFilters() {
    setFilters({
      startDate: "",
      endDate: "",
      sourceChain: "All Sources",
      destinationChain: "All Destinations",
      status: "All Statuses",
    });
    applyFilters();
  }

  function applyFilters() {
    const { startDate, endDate } = filters;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= end) {
        alert("Start date must be earlier than end date.");
        return;
      }
    }

    let result = [...transfers];

    if (filters.startDate) {
      result = result.filter(
        (tx) =>
          new Date(tx.transfer_send_timestamp) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      result = result.filter(
        (tx) =>
          new Date(tx.transfer_send_timestamp) <= new Date(filters.endDate)
      );
    }

    if (filters.status != "All Statuses") {
      if (filters.status) {
        result = result.filter((tx) => getTxStatus(tx) === filters.status);
      }
    }

    if (filters.sourceChain !== "All Sources") {
      result = result.filter(
        (tx) => tx.source_chain.universal_chain_id === filters.sourceChain
      );
    }

    if (filters.destinationChain !== "All Destinations") {
      result = result.filter(
        (tx) =>
          tx.destination_chain.universal_chain_id === filters.destinationChain
      );
    }

    if (
      filters.sourceChain !== "All Sources" &&
      filters.sourceChain === filters.destinationChain
    ) {
      result = [];
    }

    setFilteredTransfers(result);
  }

  useEffect(() => {
    setFilteredTransfers([...transfers]);
  }, [transfers]);

  useEffect(() => {
    setIsInnerOpen(isQAModalOpen || isTDModalOPen);
  }, [isQAModalOpen, isTDModalOPen]);

  return (
    <div className=" w-full max-w-4xl mx-auto px-4 animate-view-in p-4">
      <h3 className="text-2xl font-bold text-left text-[var(--text-primary)] mb-2">
        Transaction History
      </h3>

      <div className="glass-effect rounded-lg mb-6 transition-all duration-300 ease-in-out">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex justify-between items-center w-full p-4 text-left"
        >
          <span className="font-medium text-[var(--text-primary)]">
            Filters
          </span>
          <span
            className={`material-icons-outlined text-[var(--text-secondary)] transition-transform duration-300 ${
              isFilterOpen ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </button>

        {isFilterOpen && (
          <div className="px-4 pb-4">
            <div className="border-t border-[var(--card-border)] pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, startDate: e.target.value }))
                    }
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md px-3 py-2 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring-color)] [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, endDate: e.target.value }))
                    }
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md px-3 py-2 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring-color)] [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">
                    Source Chain
                  </label>
                  <select
                    value={filters.sourceChain}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, sourceChain: e.target.value }))
                    }
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md px-3 py-2 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring-color)]"
                  >
                    <option>All Sources</option>
                    {chains.map((chain) => (
                      <option
                        key={chain.universal_chain_id}
                        value={chain.universal_chain_id}
                        disabled={
                          chain.universal_chain_id === filters.destinationChain
                        }
                      >
                        {chain.display_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">
                    Destination Chain
                  </label>
                  <select
                    value={filters.destinationChain}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        destinationChain: e.target.value,
                      }))
                    }
                    className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md px-3 py-2 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring-color)]"
                  >
                    <option>All Destinations</option>
                    {chains.map((chain) => (
                      <option
                        key={chain.universal_chain_id}
                        value={chain.universal_chain_id}
                        disabled={
                          chain.universal_chain_id === filters.sourceChain
                        }
                      >
                        {chain.display_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--text-secondary)] mb-1 block">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      status: e.target.value,
                    }))
                  }
                  className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md px-3 py-2 text-[var(--text-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring-color)]"
                >
                  <option>All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="flex gap-2 justify-center">
                <button
                  className="glass-effect hover:bg-[rgba(255,255,255,0.1)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg flex items-center gap-2 text-sm"
                  onClick={applyFilters}
                >
                  Apply Filters
                </button>
                <button
                  className="glass-effect hover:bg-[rgba(255,255,255,0.1)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg flex items-center gap-2 text-sm"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {isQAModalOpen && analysis && (
        <QuickAnalysisModal
          isOpen={isQAModalOpen}
          setIsOpen={setIsQAModalOpen}
          quickAnalysis={analyzeTransfers(filteredTransfers)}
        />
      )}
      {isTDModalOPen && filteredTransfers[indexOfTransaction] && (
        <TransactionDetails
          tx={filteredTransfers[indexOfTransaction]}
          isOpen={isTDModalOPen}
          setIsOpen={setIsTDModalOpen}
        />
      )}
      <div className="flex justify-end mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            {filteredTransfers.length} Txs
          </span>
          <button
            className="glass-effect hover:bg-[rgba(255,255,255,0.1)] text-[var(--text-primary)] font-medium py-2 px-4 rounded-lg flex items-center gap-2 text-sm"
            id="quick-analyse-button"
            onClick={() => {
              setIsQAModalOpen(true);
            }}
          >
            {/* <span className="material-icons-outlined text-base">analytics</span> */}
            Quick Analysis
          </button>
        </div>
      </div>

      <div className="space-y-1">
        {filteredTransfers
          .slice((pageNumber - 1) * rowsPerPage, pageNumber * rowsPerPage)
          .map((tx, idx) => (
            <>
              <div
                onClick={() => {
                  setIndexOfTransacton(idx);
                  setIsTDModalOpen(true);
                }}
              >
                <Transaction transfer={tx} idx={idx} key={idx} />
              </div>
              {/* {isTDModalOPen && (
                <TransactionDetails
                  tx={transfers[0]}
                  isOpen={isTDModalOPen}
                  setIsOpen={setIsTDModalOpen}
                />
              )} */}
            </>
          ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-secondary)]">
            Rows per page:
          </span>
          <div className="relative">
            <select
              className="appearance-none bg-[var(--input-bg)] border border-[var(--input-border)] rounded-md pl-3 pr-8 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--ring-color)]"
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPageNumber(1); // reset to first page
              }}
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--text-secondary)]">
              <span className="material-icons-outlined text-base">
                unfold_more
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-[var(--text-secondary)]">
            {`${(pageNumber - 1) * rowsPerPage + 1}-${Math.min(
              pageNumber * rowsPerPage,
              filteredTransfers.length
            )} of ${filteredTransfers.length}`}
          </p>

          <div className="flex items-center gap-2">
            {/* Prev Button */}
            <button
              className={`p-2 rounded-lg glass-effect hover:bg-[rgba(255,255,255,0.1)] ${
                pageNumber === 1 ? "invisible" : ""
              }`}
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              <span className="material-icons-outlined text-base">
                chevron_left
              </span>
            </button>

            {/* Next Button */}
            <button
              className={`p-2 rounded-lg glass-effect hover:bg-[rgba(255,255,255,0.1)] ${
                pageNumber * rowsPerPage >= filteredTransfers.length
                  ? "invisible"
                  : ""
              }`}
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              <span className="material-icons-outlined text-base">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
