import {
  chainLogoMap,
  formatTxAmount,
  getTxStatus,
  timeAgo,
} from "../lib/utils";
import type { Transfer } from "../types";

interface TransactionProps {
  idx: number;
  transfer: Transfer;
}

const Transaction: React.FC<TransactionProps> = ({ idx, transfer }) => {
  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg glass-effect hover:bg-[rgba(255,255,255,0.03)] transition-colors cursor-pointer"
      id={`transaction-${idx}`}
    >
      <div className="flex-[2] flex flex-col justify-start items-start">
        <p className="font-medium text-xs text-sm text-[var(--text-primary)]">
          {formatTxAmount(transfer)}
        </p>

        <div className="flex items-center gap-1 mt-1">
          <img
            alt={`${transfer.source_chain.display_name}`}
            className="w-4 h-4 rounded-full"
            src={chainLogoMap[transfer.source_chain.universal_chain_id]}
          />
          <span className="text-xs md:text-sm text-[var(--text-secondary)]">
            {transfer.source_chain.display_name}
          </span>
          <span className="material-icons-outlined text-xs md:text-sm text-[var(--text-secondary)]">
            arrow_forward
          </span>
          <img
            alt={`${transfer.destination_chain.display_name}`}
            className="w-4 h-4 rounded-full"
            src={chainLogoMap[transfer.destination_chain.universal_chain_id]}
          />
          <span className="text-xs md:text-sm text-[var(--text-secondary)]">
            {transfer.destination_chain.display_name}
          </span>
        </div>
      </div>
      <div className="flex-1 text-right md:text-center mx-4">
        {getTxStatus(transfer) === "completed" && (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-500/10 text-green-400">
            Completed
          </span>
        )}
        {getTxStatus(transfer) === "pending" && (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-500/10 text-yellow-400">
            Pending
          </span>
        )}
        {getTxStatus(transfer) === "failed" && (
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-red-500/10 text-red-400">
            Failed
          </span>
        )}
      </div>
      <div className="flex-1 text-right hidden md:block">
        <p className="text-sm text-[var(--text-secondary)]">
          {timeAgo(transfer.transfer_send_timestamp)}
        </p>
      </div>
    </div>
  );
};

export default Transaction;
