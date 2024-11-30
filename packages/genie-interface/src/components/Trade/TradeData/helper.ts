import {
  AllPositions,
  OpenPositionInfo,
  Tx
} from "@squaredlab-io/sdk/src/interfaces/index.interface";

export function getOpenTransactions(
  openOrders: AllPositions | undefined
): OpenPositionInfo[] {
  if (!openOrders) return [];
  const longPos = openOrders.longPositions;
  const shortPos = openOrders.shortPositions;

  const data = [...longPos, ...shortPos];
  return data.filter((pos) => parseFloat(pos.tokenSize) !== 0);
}

export function getClosedTransactions(transactions?: Tx[]): Tx[] {
  console.log("closed txs", transactions);
  if (!transactions) return new Array<Tx>();
  return transactions
    .filter((tx) => tx.action === "CL" || tx.action === "CS")
    .sort((a, b) => parseInt(b.dateTime) - parseInt(a.dateTime));
}

export function getDateTime(blockTimestamp: string) {
  const dateObj = new Date(parseInt(blockTimestamp) * 1000);

  // Get date components
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1; // Months are zero-indexed, so add 1
  const year = dateObj.getFullYear();

  // Get time components
  const hours = dateObj.getHours().toString().padStart(2, "0"); // Ensure two digits
  const minutes = dateObj.getMinutes().toString().padStart(2, "0"); // Ensure two digits

  // Format date and time strings
  const formattedDate = `${day}/${month}/${year}`;
  const formattedTime = `${hours}:${minutes}`;

  return {
    date: formattedDate,
    time: formattedTime
  };
}
