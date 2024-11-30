/* DEPRECATED */
import { TOKENS } from "@lib/constants";

export function getTokenAddress(symbol: string | undefined): `0x${string}` {
  if (!symbol) return "0x";
  return TOKENS[symbol.toUpperCase()];
}
