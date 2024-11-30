import { PoolStatusCurrent, PotentiaSdk } from "../index";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount, toAccount } from "viem/accounts";
import {
  createPublicClient,
  http,
  type PublicClient,
  createWalletClient,
  type WalletClient,
  Account,
  parseEther
} from "viem";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
dotenv.config({ path: "../../.env" });

const rpc = `${process.env.RPC}`;
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(rpc)
});

const account = privateKeyToAccount(`0x${process.env.PK}`);

const walletClient = createWalletClient({
  account: account,
  chain: baseSepolia,
  transport: http(rpc)
});

const pool = "0xDa22aB6bD4A2960c0c97a2Cc4b98C29bbB1Ad66B";

async function main() {
  const sdk = new PotentiaSdk(
    publicClient as PublicClient,
    // process.env.PONDER!,
    // "http://127.0.0.1:42069",
    "https://green.indexer.squaredlabs.io/",
    "http://100.26.54.195:3000"
  );

  await sdk.initialiseSDK(walletClient);

  // const res = await sdk.poolWrite.openPosition(
  //   "0xd721EC3b6aF39a3FeEF5903957A25BA5CE82eBf4",
  //   parseEther("1").toString(),
  //   true
  // );

  // const res = await sdk.ponderClient.getFundingStatus(
  //   "0x8275355818822eD57bee39d61bBB820607643A63"
  // );

  // const res = await sdk.fundingInfo(
  //   "0x8275355818822eD57bee39d61bBB820607643A63"
  // );

  // const res = await sdk.ponderClient.getUserPoints(
  //   "0xcF2029811E6950c68C1014465Ddae76500Cc3c34"
  // );

  const res = await sdk.ponderClient.getRanks();

  console.log(res);
}

main();
