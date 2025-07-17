// import { useState } from "react";
import { useEffect, useState } from "react";
import type { Transfer, TransferAnalysisResult } from "../types";
import { analyzeTransfers } from "../lib/analyzeTransfers";
import { chains, getTxStatus } from "../lib/utils";
import {
  QuickAnalysisModal,
  TransactionDetails,
} from "./TransactionList Modals";
import Transaction from "./Transaction";
// import html2canvas from "html2canvas";

// const STORY_DURATION = 5000;

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
    setFilteredTransfers(transfers);
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
