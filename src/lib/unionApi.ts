import type { Transfer } from "../types"; // Make sure this is defined in your types.ts
// Make sure this is defined in your types.ts

const endpoint = "https://graphql.union.build/v1/graphql";

const headers = {
  accept: "application/graphql-response+json, application/json",
  "content-type": "application/json",
  Referer: "https://app.union.build/",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

const unifiedQuery = `
  query FetchTransfers($addresses: jsonb, $limit: Int!, $page: String, $compare: ComparisonOp) {
    v2_transfers(
      args: {
        p_limit: $limit
        p_addresses_canonical: $addresses
        p_sort_order: $page
        p_comparison: $compare
      }
    ) {
      success
      source_chain {
        universal_chain_id
        logo_uri
        display_name
      }
      destination_chain {
        universal_chain_id
        logo_uri
        display_name
      }
      sender_canonical
      sender_display
      receiver_canonical
      receiver_display
      transfer_send_timestamp
      transfer_send_transaction_hash
      transfer_recv_timestamp
      packet_hash
      base_token
      base_token_name
      base_token_symbol
      base_token_decimals
      base_amount
      quote_token
      quote_amount
      sort_order
    }
  }
`;

interface FetchTransfersOptions {
  addresses: string[];
  limit?: number;
  page?: string | null;
  compare?: "lt" | "gt";
}

export async function fetchTransfers({
  addresses,
  limit = 100,
  page = null,
  compare = "lt",
}: FetchTransfersOptions): Promise<Transfer[]> {
  const variables: Record<string, any> = {
    addresses,
    limit,
    compare,
  };

  if (page) variables.page = page;
  // if (compare !== null && compare !== undefined) variables.compare = compare;
  console.log(variables);
  try {
    const body = JSON.stringify({
      query: unifiedQuery,
      variables,
      operationName: "FetchTransfers",
    });

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body,
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);

    const json = await res.json();
    const transfers: Transfer[] = json.data?.v2_transfers || [];

    return transfers;
  } catch (err) {
    console.error("❌ Error fetching transfers:", err);
    return [];
  }
}
