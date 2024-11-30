import { useEffect } from "react";
import { Address, formatUnits } from "viem";
import { useAccount } from "wagmi";
import { useQuery, QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { readContract } from "@wagmi/core";
import BigNumber from "bignumber.js";
import notification from "@components/common/notification";
import { WethABi } from "@lib/abis";
import { config } from "@lib/wagmi";
import { WagmiFetchBalanceResult } from "@lib/types/common";

interface PropsType {
  token: Address | undefined;
  decimals: number | undefined;
  symbol: string | undefined;
  paused?: boolean;
}

interface ReturnType {
  data: WagmiFetchBalanceResult | undefined;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<BigNumber | undefined, Error>>;
}

const useTokenBalance = ({
  token,
  decimals,
  symbol,
  paused = false
}: PropsType): ReturnType => {
  const { address, isConnected, chainId } = useAccount();

  async function getBalance() {
    try {
      const balance = await readContract(config, {
        address: token!,
        abi: WethABi,
        functionName: "balanceOf",
        args: [address]
      });
      return balance as BigNumber;
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }

  const {
    data: balance,
    isFetching,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["tokenBalance", chainId, address, token],
    queryFn: getBalance,
    enabled: isConnected && !!token && !paused,
    refetchInterval: 10000,
    staleTime: 5000,
    gcTime: 10000,
    refetchOnReconnect: true,
    refetchOnMount: true,
    retry: 4
  });

  useEffect(() => {
    if (isError) {
      notification.error({
        id: "balance-fetch-error",
        title: "Failed to fetch user balance",
        description: "Please try again"
      });
    }
  }, [isError]);

  return {
    data: balance
      ? {
          value: new BigNumber(balance.toString()),
          decimals: decimals!,
          symbol: symbol!,
          formatted: formatUnits(BigInt(balance.toString()), decimals!)
        }
      : undefined,
    isFetching,
    isError,
    error,
    refetch
  } satisfies ReturnType;
};

export default useTokenBalance;
