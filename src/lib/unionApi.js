const endpoint = "https://graphql.union.build/v1/graphql";

const headers = {
  accept: "application/graphql-response+json, application/json",
  "content-type": "application/json",
  Referer: "https://app.union.build/",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

const unifiedQuery = `
  query FetchTransfers($addresses: jsonb, $limit: Int!, $page: String) {
    v2_transfers(
      args: {
        p_limit: $limit
        p_addresses_canonical: $addresses
        p_sort_order: $page
      }
    ) {
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
      receiver_canonical
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

export async function fetchTransfers({ address, limit = 100, page = null }) {
  // const allTransfers = [];
  // let page = null;

  try {
    const body = JSON.stringify({
      query: unifiedQuery,
      variables: {
        addresses: [address.toLowerCase()],
        limit,
        ...(page && { page }),
      },
      operationName: "FetchTransfers",
    });

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body,
    });

    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    const transfers = json.data?.v2_transfers || [];

    page = transfers[transfers.length - 1].sort_order;

    return transfers;
  } catch (err) {
    console.error("❌ Error fetching transfers:", err);
    return [];
  }
}
