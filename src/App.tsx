import { useState } from "react";
import Carousel from "./components/Carousel";
import Header from "./components/Header";
import AnalysisModal from "./components/AnalysisModal";
import MainForm from "./components/MainForm";

// Define structure of your analysis result (update as needed)
interface TransferAnalysisResult {
  basic: {
    total: number;
    uniqueChains: number;
    durationDays: number;
    timeRange: {
      from: string;
      to: string;
    };
    completed: number;
    pending: number;
  };
  temporal: {
    weekdayData: { label: string; count: number }[];
    monthlyData: { label: string; count: number }[];
  };
  chains: {
    topSource: { label: string; count: number }[];
    topDestination: { label: string; count: number }[];
  };
  routes: { source: string; destination: string; count: number }[];
  tokens: { label: string; count: number }[];
  summary: {
    total: number;
    uniqueChains: number;
    topDay: string;
    topMonth: string;
    topRoute: { source: string; destination: string };
    topToken: string;
  };
}

export default function App() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [result, setResult] = useState<TransferAnalysisResult | null>(null);
  const [wallet, setWallet] = useState<string>("");

  const handleAnalyze = (data: string) => {
    setShowResults(false);
    setModalOpen(true);
    setWallet(data);
  };

  const handleShowResults = () => {
    setShowResults(true);
  };

  const handleSetResult = (resultData: TransferAnalysisResult | null) => {
    setResult(resultData);
  };

  const handleRestart = () => {
    setShowResults(false);
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col justify-even h-screen">
      <Header />
      {!showResults && <MainForm onAnalyze={handleAnalyze} />}
      <footer className="text-center text-sm p-6 text-gray-500 dark:text-gray-400">
        Built by{" "}
        <a
          className="font-semibold text-[var(--accent)] hover:underline"
          href="https://twitter.com/intent/follow?screen_name=korefomo"
          target="_blank"
          rel="noopener noreferrer"
        >
          @korefomo
        </a>{" "}
        2025
      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex justify-center items-start z-50 overflow-y-auto p-4">
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
              walletAddress={wallet}
              onShowResult={handleShowResults}
              onSetResult={handleSetResult}
            />
          </div>
        </div>
      )}

      {isModalOpen && showResults && result && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex justify-center items-start z-50 overflow-y-auto p-4">
          <div className="glass-effect rounded-2xl w-full max-w-lg text-center relative mt-8 mb-8">
            <button
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-20"
              onClick={() => {
                setModalOpen(false);
                setShowResults(false);
              }}
            >
              <span className="material-icons-outlined">close</span>
            </button>
            <Carousel slideData={result} onRestart={handleRestart} />
          </div>
        </div>
      )}
    </div>
  );
}
