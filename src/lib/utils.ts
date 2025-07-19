import type { Transfer } from "../types";

export const chains = [
  {
    display_name: "Xion Testnet",
    universal_chain_id: "xion.xion-testnet-2",
    logo_uri: "https://app.union.build/logos/chains/color/XION.svg",
  },
  // {
  //   display_name: "Union Testnet",
  //   universal_chain_id: "union.union-testnet-10",
  //   logo_uri:
  //     "https://cache-logos.unionlabs.workers.dev/unionlabs/token-lists/main/logos/UNION.svg",
  // },
  {
    display_name: "Sei Testnet",
    universal_chain_id: "sei.1328",
    logo_uri: "https://app.union.build/logos/chains/color/SEI.svg",
  },
  {
    display_name: "Osmosis Testnet",
    universal_chain_id: "osmosis.osmo-test-5",
    logo_uri: "https://app.union.build/logos/chains/color/OSMOSIS.svg",
  },
  {
    display_name: "Holesky",
    universal_chain_id: "ethereum.17000",
    logo_uri: "https://app.union.build/logos/chains/color/ETHEREUM.svg",
  },
  {
    display_name: "Sepolia",
    universal_chain_id: "ethereum.11155111",
    logo_uri: "https://app.union.build/logos/chains/color/ETHEREUM.svg",
  },
  {
    display_name: "Corn Testnet",
    universal_chain_id: "corn.21000001",
    logo_uri: "https://app.union.build/logos/chains/color/CORN.svg",
  },
  {
    display_name: "BSC Testnet",
    universal_chain_id: "bsc.97",
    logo_uri: "https://app.union.build/logos/chains/color/BSC.svg",
  },
  // {
  //   display_name: "BOB Testnet",
  //   universal_chain_id: "bob.808813",
  //   logo_uri:
  //     "https://cache-logos.unionlabs.workers.dev/unionlabs/token-lists/main/logos/BOB.svg",
  // },
  // {
  //   display_name: "Bepolia",
  //   universal_chain_id: "berachain.80069",
  //   logo_uri:
  //     "https://cache-logos.unionlabs.workers.dev/unionlabs/token-lists/main/logos/BERACHAIN.svg",
  // },
  // {
  //   display_name: "Base Testnet",
  //   universal_chain_id: "base.84532",
  //   logo_uri:
  //     "https://cache-logos.unionlabs.workers.dev/unionlabs/token-lists/main/logos/BASE.svg",
  // },
  {
    display_name: "Babylon Testnet",
    universal_chain_id: "babylon.bbn-test-5",
    logo_uri: "https://app.union.build/logos/chains/color/BABYLON.svg",
  },
];

export const chainLogoMap = Object.fromEntries(
  chains.map((chain) => [chain.universal_chain_id, chain.logo_uri])
);

export function formatTxAmount(tx: Transfer): string {
  let symbol = tx.base_token_symbol || tx.base_token;
  if (symbol.length > 20) {
    symbol = `${symbol.slice(0, 5)}...${symbol.slice(-5)}`;
  }
  const decimals = tx.base_token_decimals || 18;
  // console.log(tx.quote_amount, tx.base_token_decimals);
  const rawAmount = BigInt(tx.base_amount);
  const amount = Number(rawAmount) / 10 ** decimals;

  return `${amount} ${symbol}`;
}

export function getTxStatus(tx: Transfer): "completed" | "failed" | "pending" {
  if (tx.success === true) {
    return "completed";
  } else if (tx.success === false) {
    return "failed";
  } else {
    return "pending";
  }
}

export function timeAgo(dateString: string) {
  const now: Date = new Date();
  const then: Date = new Date(dateString);
  const secondsAgo = Math.floor((now.getTime() - then.getTime()) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const { label, seconds } of intervals) {
    const count = Math.floor(secondsAgo / seconds);
    if (count > 0) {
      return `${count} ${label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

export function formatReadableUTC(datetimeString: string) {
  const date = new Date(datetimeString);

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });

  const day = date.getUTCDate();
  const month = date.toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
  const year = date.getUTCFullYear();

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  const hour12 = hours % 12 || 12;
  const paddedMinutes = minutes.toString().padStart(2, "0");

  return `${weekday}, ${day} ${month} ${year}, ${hour12}:${paddedMinutes} ${ampm} UTC`;
}
