import { useState } from "react";

import Header from "../components/Header";
import AnalysisModal from "../components/AnalysisModal";
import MainForm from "../components/MainForm";
import { Analytics } from "@vercel/analytics/react";
import type { Transfer, TransferAnalysisResult } from "../types";
import TransactionList from "../components/TransactionList";

export default function TransactionsPage() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isInnerModalOpen, setisInnerModalOpen] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<TransferAnalysisResult | null>(null);
  const [transfers, setTransfers] = useState<Transfer[] | null>(null);
  const [wallets, setWallets] = useState<string[]>([]);

  const handleView = (...data: string[]) => {
    setShowResults(false);
    setModalOpen(true);
    setWallets(data);
  };

  const handleShowResults = () => {
    setShowResults(true);
  };

  const handleSetResult = (
    transfers: Transfer[],
    analysis: TransferAnalysisResult | null
  ) => {
    setTransfers(transfers);
    setAnalysis(analysis);
  };

  // const handleRestart = () => {
  //   setShowResults(false);
  //   setModalOpen(false);
  // };

  return (
    <div className="flex flex-col justify-even h-screen">
      <Header />
      {!showResults && <MainForm onAnalyze={handleView} isHome={false} />}
      {/* <footer className="text-center text-sm mb-4 p-6 text-gray-500 dark:text-gray-400">
        ©{" "}
        <a
          className="font-semibold text-[var(--accent)] hover:underline"
          href="https://twitter.com/intent/follow?screen_name=korefomo"
          target="_blank"
          rel="noopener noreferrer"
        >
          @korefomo
        </a>{" "}
        2025
      </footer> */}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex justify-center items-center p-2 z-50 overflow-y-auto p-4">
          <div className="glass-effect rounded-2xl w-full max-w-lg text-center relative mt-8 mb-8">
            <button
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-20"
              onClick={() => setModalOpen(false)}
            >
              <span className="material-icons-outlined">close</span>
            </button>
            <AnalysisModal
              isOpen={isModalOpen}
              setIsOpen={setModalOpen}
              walletAddresses={wallets}
              onShowResult={handleShowResults}
              onSetResult={handleSetResult}
              isHome={false}
            />
          </div>
        </div>
      )}
      <Analytics />

      {isModalOpen && showResults && transfers && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex justify-center items-start z-50 overflow-y-auto">
          <div className="glass-effect rounded-2xl w-full max-w-4xl text-center relative mt-8 mb-8">
            <button
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-20"
              onClick={() => {
                if (isInnerModalOpen) {
                  return;
                }
                setModalOpen(false);
                setShowResults(false);
              }}
            >
              <span className="material-icons-outlined">close</span>
            </button>
            <TransactionList
              setIsInnerOpen={setisInnerModalOpen}
              transfers={transfers}
              setTransfers={setTransfers}
              analysis={analysis}
              wallets={wallets}
            />
            {/* <Carousel slideData={result} onRestart={handleRestart} /> */}
          </div>
        </div>
      )}
    </div>
  );
}
