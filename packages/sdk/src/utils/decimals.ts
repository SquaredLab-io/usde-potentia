import BigNumber from "bignumber.js";

export function normalizeDecimals(
  tokenAmount: BigNumber,
  tokenDecimal: number,
  standard: number
): BigNumber {
  if (tokenDecimal > standard) {
    return tokenAmount.dividedBy(BigNumber(10).pow(tokenDecimal - standard));
  } else if (standard > tokenDecimal) {
    return tokenAmount.multipliedBy(BigNumber(10).pow(standard - tokenDecimal));
  } else {
    return tokenAmount;
  }
}

export function denorm(tokenAmount: BigNumber, standard: number): BigNumber {
  return normalizeDecimals(tokenAmount, 18, standard);
}

export function norm(tokenAmount: BigNumber, tokenDecimal: number): BigNumber {
  return normalizeDecimals(tokenAmount, tokenDecimal, 18);
}
