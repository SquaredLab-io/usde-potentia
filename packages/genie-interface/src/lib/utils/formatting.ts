import BigNumber from "bignumber.js";
import { formatUnits } from "viem";
import { isValidPositiveNumber } from "./checkVadility";

/**
 * Gives expontential values if number is lesser than 1e-3 or greater than -1e-3
 * Rest if gives in dollar expressions
 **/
export function formatNumber(
  num: number,
  isDollar: boolean = false,
  decimals: 0 | 1 | 2 | 3 = 2
) {
  if (num === 0 || Math.abs(num) < Math.pow(10, -decimals)) {
    const zeroes = "0".repeat(decimals);
    return isDollar ? `$0.${zeroes}` : `0.${zeroes}`;
  }
  // Otherwise, format to exactly three decimal places
  return isDollar ? toDollarUnits(num, decimals) : toUnits(num, decimals);
}

export function formatDollarUnits(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}

export function formatLimit(amount: string | undefined, limit: number) {
  const _amount = parseFloat(amount ?? "0");
  const isUnderLimit = _amount >= limit || _amount <= limit * -1;
  return {
    sign: _amount >= limit,
    value: isUnderLimit ? _amount : 0
  };
}

/**
 *
 * @param num Number to convert into Dollar Notation
 * @param decimals Number of decimals to round to
 * @returns Converted amounts in Dollarsx
 */
export function toDollarUnits(
  num: number | undefined,
  decimals: 0 | 1 | 2 | 3 = 2
): string {
  if (!num || isNaN(num)) return "$0.00";

  const absNum = Math.abs(num);
  const isPositive = num > 0;
  const sign = isPositive ? "" : "-";

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  if (absNum >= 1e9) {
    return `${sign}$${formatter.format(absNum / 1e9)}B`;
  } else if (absNum >= 1e6) {
    return `${sign}$${formatter.format(absNum / 1e6)}M`;
  }
  return `${sign}$${formatter.format(absNum)}`;
}

/**
 *
 * @param num Number to convert into Dollar Notation
 * @param decimals Number of decimals to round to
 * @returns Converted amounts in shortned Units
 */
export default function toUnits(
  num: number | undefined,
  decimals: 0 | 1 | 2 | 3
): string {
  if (!num || isNaN(num)) return "0.00";

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  if (num >= 1e9) {
    return formatter.format(num / 1e9) + "B";
  } else if (num >= 1e6) {
    return formatter.format(num / 1e6) + "M";
  }
  return formatter.format(num);
}

export function shortenHash(hash: string | undefined, start: number = 8, end: number = 6): string {
  if (!hash) return "N/A";
  return hash.slice(0, start) + "..." + hash.slice(-end);
}

export function getDollarQuote(
  baseAmount: string,
  oraclePrice: string,
  decimals: number
): string {
  return formatNumber(
    getDecimalAdjusted(baseAmount, decimals) * formatOraclePrice(BigInt(oraclePrice)),
    true // convert to dollar denotion
  );
}

export function getDecimalDeadjusted(
  value: string | undefined,
  decimals: number | undefined
): string {
  if (!isValidPositiveNumber(value) || !value || !decimals) return "0";
  return new BigNumber(value).multipliedBy(10 ** decimals).toFixed(0);
}

export function getDecimalAdjusted(
  value: string | undefined,
  decimals: number | undefined
): number {
  if (!value || !decimals) return 0;
  return parseFloat(value) / 10 ** decimals;
}

export function _getDecimalAdjusted(
  value: string | undefined,
  decimals: number | undefined
): string {
  if (!value || !decimals) return "0";
  return formatUnits(BigInt(value), decimals);
}

export function formatOraclePrice(price: bigint | undefined): number {
  if (!price) return 0;
  return parseInt(price.toString()) / 10 ** 18;
}

export function formatTimestamp(timestamp: string): {
  date: string;
  time: string;
} {
  const dateObj = new Date(parseInt(timestamp) * 1000);

  // Format date
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = dateObj.getFullYear();

  const date = `${day}.${month}.${year}`;

  // Format time
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");

  const time = `${hours}:${minutes}:${seconds}`;

  return { date, time };
}

export function timestampToDate(timestamp: number): string {
  const dateObj = new Date(timestamp * 1000);

  // Format date
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * To deprecate
 */
export function getCorrectFormattedValue(value: number, inDollars = false): string {
  if (value < 0.00001) return inDollars ? "< $0.00001" : "< 0.00001";
  else return inDollars ? `$${value.toFixed(5)}` : value.toFixed(5);
}
