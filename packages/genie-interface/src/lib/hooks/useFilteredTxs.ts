import { Tx } from "@squaredlab-io/sdk/src/interfaces/index.interface";

interface ReturnType {
  txs: Tx[];
  noTxs: boolean;
}

export function useFilteredTxs(tx: Tx[] | undefined, term: string): ReturnType {
  if (!tx) return { txs: [], noTxs: true };
  else if (term == "") return { txs: tx, noTxs: false };
  const searchTerm = term.toLowerCase();
  const filtered = tx.filter((t) => {
    const matchTerm = `${t.underlying.symbol}`.toLowerCase();
    if (matchTerm.indexOf(searchTerm) >= 0) return true;
    return false;
  });
  const noTxs = filtered.length === 0;
  return { txs: filtered, noTxs };
}
