import { NavLink, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import React from "react";

const Header: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navLinks = [
    { name: "Analyze Txs", to: "/" },
    { name: "View Txs", to: "/transactions" },
  ];

  return (
    <header className="flex justify-between items-center p-4 md:p-6 border-b border-[var(--card-border)]">
      {/* Logo section links to home */}
      <NavLink to="/" className="flex items-center gap-2 group">
        <span className="material-icons-outlined text-xl text-[var(--accent)] transition-transform group-hover:rotate-12">
          data_usage
        </span>
        <div>
          <h1 className="text-xs md:text-lg font-bold tracking-tight text-[var(--text-primary)] leading-tight">
            Union Txns
          </h1>
          <h1 className="text-xs md:text-lg font-bold tracking-tight text-[var(--text-primary)] leading-tight">
            Analyzer
          </h1>
        </div>
      </NavLink>

      {/* Navigation + Theme */}
      <div className="flex items-center gap-4 ">
        <nav className="flex items-center gap-4">
          {navLinks.map(({ name, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={(e) => {
                if (currentPath === to) e.preventDefault(); // Disable click on current page
              }}
              className={({ isActive }) =>
                `text-sm md:text-lg font-medium px-2 py-1 rounded transition-colors ${
                  isActive
                    ? "text-[var(--text-primary)] border-b-2 border-[var(--accent)] cursor-default"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`
              }
            >
              {name}
            </NavLink>
          ))}
        </nav>

        <div className="fixed bottom-2 right-4 z-40">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
