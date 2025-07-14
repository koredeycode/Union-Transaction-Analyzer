import ThemeToggle from "./ThemeToggle";
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-6">
      <div className="flex items-center gap-2">
        <span className="material-icons-outlined text-3xl text-[var(--accent)]">
          data_usage
        </span>
        <div>
          <h1 className="md:text-lg font-bold tracking-tight text-[var(--text-primary)]">
            Union Txns
          </h1>
          <h1 className="md:text-lg font-bold tracking-tight text-[var(--text-primary)]">
            Analyzer
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
