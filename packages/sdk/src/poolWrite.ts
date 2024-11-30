import { publicActionReverseMirage } from "reverse-mirage";
import {
  Account,
  Address,
  WalletClient,
  encodeFunctionData,
  parseGwei
} from "viem";
import PotentiaPoolABI from "./abis/PotentiaPool.json";
import PotentiaFactoryABI from "./abis/PotentiaFactory.json";
import FaucetABI from "./abis/Faucet.json";
import { baseSepolia } from "viem/chains";
import { type PublicClient } from "viem";

export const CONFIG = {
  FACTORY: "0x531DdAf1f0A0eC86d4892e60Fe9c869d8f22F420"
};

export default class PoolWrite {
  public publicClient: PublicClient;
  public walletClient: WalletClient;

  constructor(publicClient: any, walletClient: WalletClient) {
    this.publicClient = publicClient.extend(publicActionReverseMirage);
    this.walletClient = walletClient;
  }

  public async addLiquidity(poolAddress: string, amt: string): Promise<string> {
    const poolAddr = poolAddress as `0x${string}`;
    const acc = this.walletClient.account;
    let hash;

    const encodedData = encodeFunctionData({
      abi: PotentiaPoolABI,
      functionName: "addLiquidity",
      args: [amt]
    });

    const gas = await this.publicClient.estimateGas({
      account: acc,
      to: poolAddr,
      data: encodedData
    });

    const { maxFeePerGas, maxPriorityFeePerGas } =
      await this.publicClient.estimateFeesPerGas();

    console.log("Gas", gas + 20000n);
    console.log("MaxFeePerGas", maxFeePerGas);
    console.log("MaxPriorityFeePerGas", maxPriorityFeePerGas);

    try {
      hash = await this.walletClient.writeContract({
        abi: PotentiaPoolABI,
        address: poolAddr,
        functionName: "addLiquidity",
        args: [amt],
        account: acc as Account,
        chain: baseSepolia,
        gas: gas + 20000n,
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas
      });

      return hash;
    } catch (e) {
      throw new Error("error: " + e);
    }
  }

  public async removeLiquidity(
    poolAddress: string,
    shares: string
  ): Promise<string> {
    const poolAddr = poolAddress as `0x${string}`;
    const acc = this.walletClient.account;
    let hash;

    const encodedData = encodeFunctionData({
      abi: PotentiaPoolABI,
      functionName: "removeLiquidity",
      args: [shares]
    });

    const gas = await this.publicClient.estimateGas({
      account: acc,
      to: poolAddr,
      data: encodedData
    });

    const { maxFeePerGas, maxPriorityFeePerGas } =
      await this.publicClient.estimateFeesPerGas();

    console.log("Gas", gas + 20000n);
    console.log("MaxFeePerGas", maxFeePerGas);
    console.log("MaxPriorityFeePerGas", maxPriorityFeePerGas);

    try {
      hash = await this.walletClient.writeContract({
        abi: PotentiaPoolABI,
        address: poolAddr,
        functionName: "removeLiquidity",
        args: [shares],
        account: acc as Account,
        chain: baseSepolia,
        gas: gas + 20000n,
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas
      });

      return hash;
    } catch (e) {
      throw new Error("error: " + e);
    }
  }

  public async openPosition(
    poolAddress: string,
    amt: string,
    isLong: boolean
  ): Promise<string> {
    const poolAddr = poolAddress as `0x${string}`;
    const acc = this.walletClient.account;
    let hash;

    const encodedData = encodeFunctionData({
      abi: PotentiaPoolABI,
      functionName: "openPosition",
      args: [amt, isLong]
    });

    const gas = await this.publicClient.estimateGas({
      account: acc,
      to: poolAddr,
      data: encodedData
    });

    const { maxFeePerGas, maxPriorityFeePerGas } =
      await this.publicClient.estimateFeesPerGas();

    console.log("Gas", gas + 20000n);
    console.log("MaxFeePerGas", maxFeePerGas);
    console.log("MaxPriorityFeePerGas", maxPriorityFeePerGas);

    try {
      hash = await this.walletClient.writeContract({
        abi: PotentiaPoolABI,
        address: poolAddr,
        functionName: "openPosition",
        args: [amt, isLong],
        account: acc as Account,
        chain: baseSepolia,
        gas: gas + 20000n,
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas
      });

      return hash;
    } catch (e) {
      throw new Error("error: " + e);
    }
  }

  public async closePosition(
    poolAddress: string,
    shares: string,
    isLong: boolean
  ): Promise<string> {
    const poolAddr = poolAddress as `0x${string}`;
    const acc = this.walletClient.account;
    let hash;

    const encodedData = encodeFunctionData({
      abi: PotentiaPoolABI,
      functionName: "closePosition",
      args: [shares, isLong]
    });

    const gas = await this.publicClient.estimateGas({
      account: acc,
      to: poolAddr,
      data: encodedData
    });

    const { maxFeePerGas, maxPriorityFeePerGas } =
      await this.publicClient.estimateFeesPerGas();

    console.log("Gas", gas + 20000n);
    console.log("MaxFeePerGas", maxFeePerGas);
    console.log("MaxPriorityFeePerGas", maxPriorityFeePerGas);

    try {
      hash = await this.walletClient.writeContract({
        abi: PotentiaPoolABI,
        address: poolAddr,
        functionName: "closePosition",
        args: [shares, isLong],
        account: acc as Account,
        chain: baseSepolia,
        gas: gas + 20000n,
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas
      });

      return hash;
    } catch (e) {
      throw new Error("error: " + e);
    }
  }

  public async callFaucet(asset: string, to: string): Promise<string> {
    const faucetAddress =
      "0xd041a260d1d505c75588afaf49bb0a1f3b8e0e0e" as `0x${string}`;
    const acc = this.walletClient.account;
    let hash;
    try {
      hash = await this.walletClient.writeContract({
        abi: FaucetABI,
        address: faucetAddress,
        functionName: "mintAsset",
        args: [asset, to],
        account: acc as Account,
        chain: baseSepolia
      });
      return hash;
    } catch (e) {
      throw new Error("error while calling callFaucet: " + e);
    }
  }

  public async createPool(
    underlying: `0x${string}`,
    power: number,
    adjustRate: number,
    operator: `0x${string}`,
    halftime: number,
    oracle: `0x${string}`
  ): Promise<string> {
    const acc = this.walletClient.account;
    let hash;
    try {
      hash = await this.walletClient.writeContract({
        abi: PotentiaFactoryABI,
        address: CONFIG.FACTORY as `0x${string}`,
        functionName: "createPool",
        args: [underlying, power, adjustRate, operator, halftime, oracle],
        account: acc as Account,
        chain: baseSepolia
      });

      return hash;
    } catch (e) {
      throw new Error("error: " + e);
    }
  }

  public async intializePool(pool: string, initLiq: string): Promise<string> {
    return "";
  }
}
