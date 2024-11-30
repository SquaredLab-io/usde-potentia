import * as dotenv from "dotenv";

import {
  createPublicClient,
  http,
  type PublicClient,
  createWalletClient,
  type WalletClient,
  Account
} from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount, toAccount } from "viem/accounts";
import PotentiaPoolABI from "../abis/PotentiaPool.json";
import { PotentiaSdk } from "..";

const rpc = `${process.env.RPC}`;

dotenv.config();

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
  const sdk = new PotentiaSdk(publicClient as PublicClient, "", "");
  console.log();
}
