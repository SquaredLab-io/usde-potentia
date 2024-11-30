import { sdk, walletClient } from "./config";

async function main() {
  await sdk.initialiseSDK(walletClient);

  const v = await sdk.get30DFeeCumulativeSum(
    "0x9cdAA94733a682013Ff8AfD72BA59FB63619C98d"
  );
  console.log(v);
}

main();

/**
 * Example output
 * ```json
 * [
 *   { fee: 933060573232730531n, date: '1726185600000' },
 *   { fee: 2288480655852394818n, date: '1726272000000' },
 *   { fee: 3902122135087587029n, date: '1726358400000' },
 *   { fee: 4022122135087587029n, date: '1726444800000' }
 * ]
 * ```
 */
