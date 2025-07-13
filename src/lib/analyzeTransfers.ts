import type { Transfer, TransferAnalysisResult } from "../types";

export function analyzeTransfers(
  transfers: Transfer[]
): TransferAnalysisResult | null {
  if (!Array.isArray(transfers)) return null;

  const basic = {
    totalTransactions: transfers.length,
    uniqueChains: new Set<string>(),
    timestamps: [] as Date[],
    statusCounts: { completed: 0, pending: 0 },
  };

  const weekdayActivity: Record<string, number> = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  };

  const monthActivity: Record<string, number> = {};
  const sourceChains: Record<string, number> = {};
  const destinationChains: Record<string, number> = {};
  const routes: Record<string, number> = {};
  const tokenStats: Record<
    string,
    {
      symbol: string;
      name: string | null;
      totalTransferred: number;
      transferCount: number;
    }
  > = {};

  for (const tx of transfers) {
    const sendTime = new Date(tx.transfer_send_timestamp);
    basic.timestamps.push(sendTime);

    const weekday = sendTime.toLocaleDateString("en-US", { weekday: "long" });
    const monthKey = sendTime.toISOString().slice(0, 7); // YYYY-MM

    weekdayActivity[weekday] = (weekdayActivity[weekday] || 0) + 1;
    monthActivity[monthKey] = (monthActivity[monthKey] || 0) + 1;

    const srcLabel =
      tx.source_chain.display_name || tx.source_chain.universal_chain_id;
    const dstLabel =
      tx.destination_chain.display_name ||
      tx.destination_chain.universal_chain_id;

    sourceChains[srcLabel] = (sourceChains[srcLabel] || 0) + 1;
    destinationChains[dstLabel] = (destinationChains[dstLabel] || 0) + 1;

    const routeKey = `${srcLabel} → ${dstLabel}`;
    routes[routeKey] = (routes[routeKey] || 0) + 1;

    if (tx.transfer_recv_timestamp) basic.statusCounts.completed++;
    else basic.statusCounts.pending++;

    let symbol = tx.base_token_symbol || tx.base_token;
    if (symbol.length > 20) {
      symbol = `${symbol.slice(0, 5)}...${symbol.slice(-5)}`;
    }

    const decimals = tx.base_token_decimals || 18;
    const rawAmount = BigInt(tx.base_amount);
    const amount = Number(rawAmount) / 10 ** decimals;

    if (!tokenStats[symbol]) {
      tokenStats[symbol] = {
        symbol,
        name: tx.base_token_name || null,
        totalTransferred: 0,
        transferCount: 0,
      };
    }

    tokenStats[symbol].totalTransferred += amount;
    tokenStats[symbol].transferCount += 1;

    basic.uniqueChains.add(srcLabel);
    basic.uniqueChains.add(dstLabel);
  }

  const sortByValue = (obj: Record<string, number>) =>
    Object.entries(obj).sort((a, b) => b[1] - a[1]);

  const sortedTimestamps = basic.timestamps.sort(
    (a, b) => a.getTime() - b.getTime()
  );
  const firstDate = sortedTimestamps[0];
  const lastDate = sortedTimestamps[sortedTimestamps.length - 1];
  const durationDays = Math.ceil(
    (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const topWeekday = sortByValue(weekdayActivity)[0]?.[0] || "N/A";
  const oldTopMonth = sortByValue(monthActivity)[0]?.[0] || "N/A";
  const date = new Date(`${oldTopMonth}-01`);
  const topMonth = date.toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });

  const topRoute = sortByValue(routes)[0]?.[0] || "N/A";
  const [topRouteSrc, topRouteDst] = topRoute.split(" → ");
  const topToken = Object.values(tokenStats).sort(
    (a, b) => b.transferCount - a.transferCount
  )[0];

  return {
    basic: {
      total: basic.totalTransactions,
      uniqueChains: basic.uniqueChains.size,
      durationDays,
      timeRange: {
        from: firstDate.toISOString(),
        to: lastDate.toISOString(),
      },
      completed: basic.statusCounts.completed,
      pending: basic.statusCounts.pending,
    },
    temporal: {
      weekdayData: Object.entries(weekdayActivity).map(([label, count]) => ({
        label,
        count,
      })),
      monthlyData: Object.entries(monthActivity).map(([key, count]) => {
        const date = new Date(`${key}-01`);
        const label = date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        });
        return { label, count };
      }),
    },
    chains: {
      topSource: sortByValue(sourceChains)
        .slice(0, 3)
        .map(([label, count]) => ({ label, count })),
      topDestination: sortByValue(destinationChains)
        .slice(0, 3)
        .map(([label, count]) => ({ label, count })),
    },
    routes: sortByValue(routes)
      .slice(0, 5)
      .map(([key, count]) => {
        const [source, destination] = key.split(" → ");
        return { source, destination, count };
      }),
    tokens: Object.values(tokenStats)
      .sort((a, b) => b.transferCount - a.transferCount)
      .slice(0, 5)
      .map(({ symbol, transferCount }) => ({
        label: symbol,
        count: transferCount,
      })),
    summary: {
      total: basic.totalTransactions,
      uniqueChains: basic.uniqueChains.size,
      topDay: topWeekday,
      topMonth,
      topRoute: {
        source: topRouteSrc || "N/A",
        destination: topRouteDst || "N/A",
      },
      topToken: topToken?.symbol || "N/A",
    },
  };
}
