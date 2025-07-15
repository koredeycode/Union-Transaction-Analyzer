export interface Transfer {
  success: boolean | null;
  source_chain: { display_name: string; universal_chain_id: string };
  destination_chain: { display_name: string; universal_chain_id: string };
  transfer_send_timestamp: string;
  transfer_recv_timestamp?: string;
  sort_order: string;
  base_token: string;
  base_token_name?: string;
  base_token_symbol?: string;
  base_token_decimals?: number;
  base_amount: string;
}

export interface TransferAnalysisResult {
  basic: {
    total: number;
    uniqueChains: number;
    durationDays: number;
    timeRange: { from: string; to: string };
    completed: number;
    pending: number;
    failed: number;
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
