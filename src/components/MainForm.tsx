import { useState, type FormEvent } from "react";

interface MainFormProps {
  onAnalyze: (wallet: string) => void;
}

export default function MainForm({ onAnalyze }: MainFormProps) {
  const [wallet, setWallet] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const isValidWallet = (address: string): boolean => {
    // Simple EVM wallet validation (starts with 0x and 40 hex chars)
    return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
  };

  const handleAnalyze = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!wallet || !isValidWallet(wallet)) {
      setErrorMessage("Please enter a valid wallet address.");
      setShowError(true);
      return;
    }

    onAnalyze(wallet.trim());
  };

  return (
    <main className="flex-grow flex flex-col justify-center items-center px-4 text-center relative">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[var(--background)] bg-[linear-gradient(to_right,rgba(128,128,128,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.04)_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-[var(--accent)] opacity-20 blur-[100px]"></div>
      </div>

      <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-5 text-[var(--text-primary)]">
        Analyze Your Union Transactions
      </h2>
      <p className="text-[var(--text-secondary)] mb-10 max-w-lg text-lg">
        Enter your wallet address to fetch and analyse your transactions.
      </p>

      <div className="w-full max-w-md">
        <form className="flex flex-col gap-4" onSubmit={handleAnalyze}>
          <div className="relative">
            <input
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              placeholder="Enter your wallet address"
              className={`w-full bg-[var(--input-bg)] border ${
                showError
                  ? "border-red-500 animate-shake"
                  : "border-[var(--input-border)]"
              } rounded-xl px-5 py-4 text-center placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] transition-all text-base text-[var(--text-primary)]`}
              type="text"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--accent)] hover:opacity-90 text-[var(--accent-dark)] font-semibold py-4 px-4 rounded-xl shadow-lg shadow-[var(--accent)]/20 transition-all duration-300 transform hover:scale-105"
          >
            Analyze
          </button>
        </form>
      </div>

      {/* Error Modal */}
      {showError && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative bg-white dark:bg-slate-800 p-6 m-6 rounded-xl shadow-lg w-full max-w-sm text-center">
            <h3 className="text-xl font-bold text-red-500 mb-2">
              Invalid Wallet
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              {errorMessage}
            </p>
            <button
              className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-20"
              onClick={() => setShowError(false)}
            >
              <span className="material-icons-outlined">close</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
