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

describe("get daily info function", () => {
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
      process.env.SUBGRAPH!,
      ""
    );

    console
      .log
      // await sdk.subgraph.getDailyData(
      //   "0xe6b3e196bdfa012b20b5eda6db9396a61963c117"
      // )
      ();
    assert(true);
  });
});
