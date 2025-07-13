import { useState } from "react";
import Carousel from "./components/Carousel";
import Header from "./components/Header";
import AnalysisModal from "./components/AnalysisModal";
import MainForm from "./components/MainForm";

export default function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState({});
  const [wallet, setWallet] = useState("");

  const handleAnalyze = (data) => {
    setShowResults(false);
    setModalOpen(true);
    setWallet(data);
  };

  const handleShowResults = () => {
    // setModalOpen(true);
    console.log("showResults", showResults);

    console.log("showing results now");
    setShowResults(true);
  };

  const handleSetResult = (resultData) => {
    setResult(resultData);
  };

  const handleRestart = () => {
    setShowResults(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {!showResults && <MainForm onAnalyze={handleAnalyze} />}
      <footer className="text-center text-sm p-6 text-gray-500 dark:text-gray-400">
        Built by{" "}
        <a
          className="font-semibold text-[var(--accent)] hover:underline"
          href="#"
        >
          @korefomo
        </a>{" "}
        2025
      </footer>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex justify-center items-start z-50 overflow-y-auto p-4">
          <div className="glass-effect rounded-2xl w-full max-w-lg text-center relative mt-8 mb-8">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-20"
              onClick={() => setModalOpen(false)}
            >
              <span className="material-icons-outlined">close</span>
            </button>
            <AnalysisModal
              isOpen={isModalOpen}
              // onClose={() => setModalOpen(false)}
              onShowResult={handleShowResults}
              onSetResult={handleSetResult}
              walletAddress={wallet}
            />
          </div>
        </div>
      )}

      {isModalOpen && showResults && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex justify-center items-start z-50 overflow-y-auto p-4">
          <div className="glass-effect rounded-2xl w-full max-w-lg text-center relative mt-8 mb-8">
            {/* Close Button */}
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
