import ThemeToggle from "./ThemeToggle";
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-6">
      <div className="flex items-center gap-2">
        <span className="material-icons-outlined text-3xl text-[var(--accent)]">
          data_usage
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          ChainStory
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
