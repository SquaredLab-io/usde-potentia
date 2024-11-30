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

export const rpc = `${process.env.RPC}`;
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(rpc)
});

export const account = privateKeyToAccount(`0x${process.env.PK}`);

export const walletClient = createWalletClient({
  account: account,
  chain: baseSepolia,
  transport: http(rpc)
});

export const sdk = new PotentiaSdk(
  publicClient as PublicClient,
  process.env.PONDER!,
  process.env.CHANNEL!
);
