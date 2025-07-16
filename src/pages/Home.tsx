import { useState } from "react";
import Carousel from "../components/Carousel";
import Header from "../components/Header";
import AnalysisModal from "../components/AnalysisModal";
import MainForm from "../components/MainForm";
import { Analytics } from "@vercel/analytics/react";
import type { TransferAnalysisResult, Transfer } from "../types";

export default function Home() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<TransferAnalysisResult | null>(null);
  // const [transfers, setTransfers] = useState<Transfer[] | null>(null);

  const [wallets, setWallets] = useState<string[]>([]);

  const handleAnalyze = (...data: string[]) => {
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
    // setTransfers(transfers);
    transfers = transfers;
    setAnalysis(analysis);
  };

  const handleRestart = () => {
    setShowResults(false);
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col justify-even h-screen">
      <Header />
      {!showResults && <MainForm onAnalyze={handleAnalyze} isHome={true} />}

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
              isHome={true}
            />
          </div>
        </div>
      )}
      <Analytics />

      {isModalOpen && showResults && analysis && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex justify-center items-center p-2 z-50 overflow-y-auto max-h-screen">
          <div className="glass-effect rounded-2xl w-full max-w-lg text-center relative mt-8 md:mt-2">
            <button
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-20"
              onClick={() => {
                setModalOpen(false);
                setShowResults(false);
              }}
            >
              <span className="material-icons-outlined">close</span>
            </button>
            <Carousel analysis={analysis} onRestart={handleRestart} />
          </div>
        </div>
      )}
    </div>
  );
}
