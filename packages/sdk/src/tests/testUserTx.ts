import { PotentiaSdk } from "../index";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount, toAccount } from "viem/accounts";
import {
  createPublicClient,
  http,
  type PublicClient,
  createWalletClient,
  type WalletClient,
  Account
} from "viem";
import dotenv from "dotenv";
import PonderClient from "../ponderClient";

dotenv.config();

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

async function main() {
  const sdk = new PotentiaSdk(
    publicClient as PublicClient,
    process.env.SUBGRAPH!,
    process.env.PONDER!
  );
  // const ponder = new PonderClient("http://127.0.0.1:42069/");
  console.log(
    await sdk.getTradeHistory("0x050Ac74c2Fe33D932ef30f7c481e8d9d029568D4")
  );
}

main();
