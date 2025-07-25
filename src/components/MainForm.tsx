import { useState, type FormEvent } from "react";
// import {
//   isValidBech32Address,
//   isValidEvmAddress,
//   bech32AddressToHex,
// } from "@unionlabs/client";

import {
  toCanonical as bech32AddressToHex,
  isValidCosmosAddress as isValidBech32Address,
  isValidEvmAddress,
} from "../lib/address";

interface MainFormProps {
  onAnalyze: (evmWallet: string, cosmosWallet: string) => void;
  isHome: boolean;
}

export default function MainForm({ onAnalyze, isHome = true }: MainFormProps) {
  const [evmWallet, setEvmWallet] = useState<string>("");
  const [cosmosWallet, setCosmosWallet] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const verb = isHome ? "Analyze" : "View";

  const handleAnalyze = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!evmWallet && !cosmosWallet) {
      setErrorMessage("Please enter at least one wallet address.");
      setShowError(true);
      return;
    }

    if (evmWallet && !isValidEvmAddress(evmWallet.trim())) {
      setErrorMessage("Please enter a valid EVM wallet address.");
      setShowError(true);
      return;
    }

    if (cosmosWallet && !isValidBech32Address(cosmosWallet.trim())) {
      setErrorMessage("Please enter a valid Cosmos wallet address.");
      setShowError(true);
      return;
    }

    onAnalyze(evmWallet.trim(), bech32AddressToHex(cosmosWallet.trim()));
    setEvmWallet(evmWallet);
    setCosmosWallet(cosmosWallet);
  };

  return (
    <main className="flex-grow flex flex-col justify-center items-center px-4 text-center relative">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[var(--background)] bg-[linear-gradient(to_right,rgba(128,128,128,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.04)_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-[var(--accent)] opacity-20 blur-[100px]"></div>
      </div>

      <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-5 text-[var(--text-primary)]">
        {verb} Your Union Transactions
      </h2>
      <p className="text-[var(--text-secondary)] mb-10 max-w-lg text-sm md:text-lg">
        Enter your wallet address(es) to fetch and {verb.toLowerCase()} your
        transactions.
      </p>

      <div className="w-full max-w-md mb-8">
        <form className="flex flex-col gap-4" onSubmit={handleAnalyze}>
          <div className="relative">
            <input
              value={evmWallet}
              onChange={(e) => setEvmWallet(e.target.value)}
              placeholder="Enter your EVM wallet address"
              className={`w-full bg-[var(--input-bg)] border ${
                showError
                  ? "border-red-500 animate-shake"
                  : "border-[var(--input-border)]"
              } rounded-xl px-5 py-4 text-center text-sm placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] transition-all text-base text-[var(--text-primary)]`}
              type="text"
            />
          </div>
          <div className="relative">
            <input
              value={cosmosWallet}
              onChange={(e) => setCosmosWallet(e.target.value)}
              placeholder="Enter any of your cosmos wallet address"
              className={`w-full bg-[var(--input-bg)] border ${
                showError
                  ? "border-red-500 animate-shake"
                  : "border-[var(--input-border)]"
              } rounded-xl px-5 py-4 text-center text-sm placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] transition-all text-base text-[var(--text-primary)]`}
              type="text"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--accent)] hover:opacity-90 text-[var(--accent-dark)] font-semibold py-4 px-4 rounded-xl shadow-lg shadow-[var(--accent)]/20 transition-all duration-300 transform hover:scale-105"
          >
            {verb} Transactions
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
      <footer className="text-center text-sm mt-8 text-gray-500 dark:text-gray-400">
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
      </footer>
    </main>
  );
}
