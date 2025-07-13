import { useState, type FormEvent } from "react";

interface MainFormProps {
  onAnalyze: (wallet: string) => void;
}

export default function MainForm({ onAnalyze }: MainFormProps) {
  const [wallet, setWallet] = useState<string>("");

  const handleAnalyze = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!wallet) {
      alert("Insert wallet");
      return;
    }
    onAnalyze(wallet);
  };

  return (
    <main className="flex-grow flex flex-col justify-center items-center px-4 text-center">
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
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-5 py-4 text-center placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--ring-color)] focus:border-[var(--ring-color)] transition-all text-base text-[var(--text-primary)]"
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
    </main>
  );
}
