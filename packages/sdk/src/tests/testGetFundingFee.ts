import { sdk, walletClient } from "./config";

async function main() {
  await sdk.initialiseSDK(walletClient);
  // const v = await sdk.ponderClient.get30DFunding(
  //   "0x050Ac74c2Fe33D932ef30f7c481e8d9d029568D4"
  // );
  const v = await sdk.poolWrite.getPriceRefAdjusted(
    "0x9cdAA94733a682013Ff8AfD72BA59FB63619C98d"
  );
  // const v = await sdk.getTradeHistory(
  //   "0x050Ac74c2Fe33D932ef30f7c481e8d9d029568D4"
  // );
  // const v = await sdk.getUserLiquidityHistory(
  //   "0x0C11567Df813625A3eb7ED4EE753dece628DF629"
  // );
  console.log(v);
}

main();
