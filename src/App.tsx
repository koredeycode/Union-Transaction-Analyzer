// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TransactionsPage from "./pages/TransactionsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/transactions" element={<TransactionsPage />} />
    </Routes>
  );
}
