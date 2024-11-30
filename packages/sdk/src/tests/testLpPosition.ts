import { sdk, walletClient } from "./config";

async function main() {
  await sdk.initialiseSDK(walletClient);
  const v = await sdk.ponderClient.getLPTokenPrice(
    "0x878642cfd3aDDE6954Bea080b00b38bcA97EFdD8"
  );
  console.log(v.toString());
}

main();
