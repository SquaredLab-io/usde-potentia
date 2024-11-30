export enum Sign {
  positive = "+",
  negative = "-",
  zero = ""
}

export function getChangeSign(value: number | undefined): Sign {
  if (!value) return Sign.zero;
  return value > 0 ? Sign.positive : value < 0 ? Sign.negative : Sign.zero;
}
