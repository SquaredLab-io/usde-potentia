import dotenv from "dotenv";
import {
  createPublicClient,
  http,
  type PublicClient,
  createWalletClient
} from "viem";
import { baseSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { PotentiaSdk } from "..";
import assert from "assert";
import "mocha";

describe("call getP function", () => {
  beforeEach(() => {
    dotenv.config();
  });

  it("should run", async () => {
    const account = privateKeyToAccount(`0x${process.env.PK}`);
    const rpc = `${process.env.RPC}`;
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(rpc)
    });

    const walletClient = createWalletClient({
      account: account,
      chain: baseSepolia,
      transport: http(rpc)
    });

    const sdk = new PotentiaSdk(
      publicClient as PublicClient,
      "https://api.studio.thegraph.com/query/80636/subgraph/v0.0.7",
      ""
    );
    console
      .log
      // await sdk.poolRead.getP("0x762c9b8fa27546c0ddc3e49883fc14bb71723eeb")
      ();
    assert(true);
  });
});