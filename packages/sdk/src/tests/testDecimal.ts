import { sdk, walletClient } from "./config";
import BN, { BigNumber } from "bignumber.js";

async function main() {
  await sdk.initialiseSDK(walletClient);

  const d = new BigNumber("1.97");
  console.log("number", d.toFixed());
  console.log("precision", precision(BigNumber(3000.445)));
}

function precision(price: BigNumber) {
  return Math.floor(Math.max(1, 5 - Math.log10(price.toNumber())));
}

main();
