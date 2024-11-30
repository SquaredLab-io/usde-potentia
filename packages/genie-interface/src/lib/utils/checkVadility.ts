import { z } from "zod";

export function isEmpty(input: string | number): boolean {
  if (input === "" || input === "0" || input === 0) {
    return true;
  }
  return false;
}

export function isValidPositive(num: string): boolean {
  // Regex for Whole Numbers. x => {x: [0, ]}
  const reg = /^(100|[1-9]?\d)$/;
  return reg.test(num);
}

export function isValidPositiveNumber(num: string | undefined): boolean {
  if (!num) return false;
  
  const isPositive = z.number().positive();
  return isPositive.safeParse(parseFloat(num)).success;
}

export function isValidAddress(addr: string): boolean {
  const reg = /^0x[0-9a-fA-F]+/;
  return reg.test(addr);
}
