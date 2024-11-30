import BigNumber from "bignumber.js";
import { sdk, walletClient } from "./config";

async function main() {
  await sdk.initialiseSDK(walletClient);
  const pools = await sdk.ponderClient.getMyPools(
    "0x94D34dD4CcE82012874884495A3C2704811d5618"
  );
  const val = await sdk.poolWrite.getPriceRefAdjusted(
    "0xd721EC3b6aF39a3FeEF5903957A25BA5CE82eBf4"
  );
  // console.log(pools);
  // console.log("PriceRefAdjusted: ", BigNumber(val).dividedBy(1e18).toNumber());
  const v = await sdk.getUserLiquidityHistory(
    "0x6b1f7cbee8e57da4640141FC75f8119A0EC9BbC2"
    // "0xd721EC3b6aF39a3FeEF5903957A25BA5CE82eBf4"
  );
  console.log(v);
}

main();

// Example response
/*
{
  user: '0x94D34dD4CcE82012874884495A3C2704811d5618',
  pools: [
    {
      amount: '353456428714201476',
      id: '0x94D34dD4CcE82012874884495A3C2704811d56180xd721EC3b6aF39a3FeEF5903957A25BA5CE82eBf4',
      pool: '0xd721EC3b6aF39a3FeEF5903957A25BA5CE82eBf4',
      user: '0x94D34dD4CcE82012874884495A3C2704811d5618',
      __typename: 'UserLiqPosition'
    },
    {
      amount: '277148368295900693184',
      id: '0x94D34dD4CcE82012874884495A3C2704811d56180xDa22aB6bD4A2960c0c97a2Cc4b98C29bbB1Ad66B',
      pool: '0xDa22aB6bD4A2960c0c97a2Cc4b98C29bbB1Ad66B',
      user: '0x94D34dD4CcE82012874884495A3C2704811d5618',
      __typename: 'UserLiqPosition'
    }
  ]
}
*/
