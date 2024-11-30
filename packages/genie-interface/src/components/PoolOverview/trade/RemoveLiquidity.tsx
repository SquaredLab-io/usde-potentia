"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Address } from "viem";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { isValidPositiveNumber } from "@lib/utils/checkVadility";
import { cn } from "@lib/utils";
import ButtonCTA from "@components/common/button-cta";
import toUnits, {
  _getDecimalAdjusted,
  formatNumber,
  formatOraclePrice,
  getCorrectFormattedValue,
  getDecimalAdjusted,
  getDecimalDeadjusted
} from "@lib/utils/formatting";
import { CONFIRMATION } from "@lib/constants";
import notification from "@components/common/notification";
import InfoBox from "../info-box";
import useTokenBalance from "@lib/hooks/useTokenBalance";
import useLpUnderlyingReceived from "@lib/hooks/useLpUnderlyingReceived";
import { ReturnTxHistory } from "@lib/hooks/useCurrentLpPosition";
import { notificationId } from "@components/Trade/helper";
import { toast } from "sonner";

interface PropsType {
  overviewPool: PoolInfo;
  lpTokenBalance: ReturnTxHistory;
}

const RemoveLiquidity = ({ overviewPool, lpTokenBalance }: PropsType) => {
  // Amount to remove
  const [amount, setAmount] = useState<string>("");
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const [txHash, setTxHash] = useState<Address | undefined>(undefined);

  const { removeLiq_event } = notificationId;

  const { potentia } = usePotentiaSdk();
  const { openConnectModal } = useConnectModal();

  const { underlying, poolAddr, underlyingAddress, underlyingDecimals } = overviewPool;

  // Contract Hooks
  const { address, isConnected } = useAccount();
  const {
    data: userBalance,
    isFetching: isBalLoading,
    refetch: refetchBalance
  } = useTokenBalance({
    token: underlyingAddress! as Address,
    decimals: underlyingDecimals,
    symbol: underlying
  });

  // Get the Estimate LP Underlying Output
  const { output: lpUnderlying, isFetching: isLpUnderlyingFetching } =
    useLpUnderlyingReceived({
      poolAddress: poolAddr as Address,
      amount: amount || "0"
    });

  // get current position of LP
  const {
    data: lpPosition,
    isFetching: isLpPositionFetching,
    refetch: refetchLpPosition
  } = lpTokenBalance;

  const lpBalance = lpPosition ? getDecimalAdjusted(lpPosition.counterLpAmt, 18) : 0;

  const decimalAdjustedOraclePrice = lpPosition
    ? formatOraclePrice(BigInt(lpPosition?.oraclePrice))
    : 0;

  const lpPriceInDollars = lpPosition
    ? decimalAdjustedOraclePrice * parseFloat(lpPosition.lpTokenPriceUnderlying)
    : 0;

  const oraclePrice = lpPosition ? formatOraclePrice(BigInt(lpPosition.oraclePrice)) : 0;

  // getting underlying token's price
  // const { price, isMarketDataLoading: isPriceFetching } = useCurrencyPrice(underlying);

  /**
   * Handler for RemoveLiquidity Function
   */
  async function removeLiquidityHandlerSdk() {
    const shares = getDecimalDeadjusted(amount, 18);
    try {
      const hash = await potentia?.poolWrite.removeLiquidity(
        overviewPool.poolAddr as Address,
        BigInt(shares).toString()
      );
      if (hash) {
        setTxHash(hash as Address);
      }
    } catch (error) {
      notification.error({
        id: removeLiq_event.error,
        title: "Remove Liquidity Failed",
        description: "Unable to initiate liquidity withdrawal. Try again"
      });
    }
  }

  // wait for add liquidity transaction
  const { isSuccess, isLoading, isPending, isError, error } =
    useWaitForTransactionReceipt({
      hash: txHash,
      confirmations: CONFIRMATION
    });

  const balanceExceedError = useMemo(() => {
    return parseFloat(amount) > lpBalance;
  }, [lpBalance, amount]);

  // Notifications based on loading and error Transaction status
  useEffect(() => {
    if (isLoading) {
      notification.loading({
        id: removeLiq_event.loading,
        title: "Removing Liquidity",
        description: "This may take ~20 seconds."
      });
    } else if (isError) {
      toast.dismiss(removeLiq_event.loading);
      notification.error({
        id: removeLiq_event.error,
        title: "Transaction Failed",
        description: "Liquidity withdrawal failed. Please try again."
      });
    }
  }, [isLoading, isError]);

  // Notifications based on success Transaction status
  useEffect(() => {
    if (isSuccess) {
      refetchBalance();
      refetchLpPosition();
      toast.dismiss(removeLiq_event.loading);
      setAmount("");
      notification.success({
        id: removeLiq_event.success,
        title: "Withdrew Liquidity Successfully",
        description: "You have successfully removed liquidity."
      });
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col justify-between py-4 h-full">
      <div className="w-full space-y-3">
        {/* SUPPLY */}
        <div
          className={cn(
            "rounded-[4px] flex flex-col gap-y-2 border p-4",
            balanceExceedError ? "border-error-red" : "border-secondary-gray"
          )}
        >
          <p className="w-full inline-flex justify-between font-medium text-xs/3 text-[#5F7183] mb-1">
            <span>You Supply</span>
            <span>
              {isLpPositionFetching
                ? "..."
                : lpPriceInDollars && parseFloat(amount) > 0
                  ? "~" +
                    formatNumber(lpPriceInDollars * parseFloat(amount || "0"), true, 3)
                  : "~$0.000"}
            </span>
          </p>
          <div className="inline-flex-between">
            <h4 className="font-medium text-base/5">LP Tokens</h4>
            <input
              className="text-xl/6 font-medium w-fit bg-primary-gray outline-none text-right"
              placeholder="0"
              type="number"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
              }}
            />
          </div>
          <div className="inline-flex items-end justify-between font-normal text-xs/3">
            <span
              className={cn(balanceExceedError ? "text-error-red" : "text-[#5F7183]")}
            >
              Your LP balance:{" "}
              {isLpPositionFetching && !lpBalance ? "loading..." : toUnits(lpBalance, 3)}
            </span>
            <div className="inline-flex gap-2">
              <button
                className="py-[5.5px] px-[6px] rounded-[4px] bg-[#212C42] hover:bg-[#283751] transition-colors disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => setAmount((lpBalance * 0.5).toString())}
                disabled={!isConnected || !lpBalance}
              >
                Half
              </button>
              <button
                className="py-[5.5px] px-[6px] rounded-[4px] bg-[#212C42] hover:bg-[#283751] transition-colors disabled:opacity-50 disabled:pointer-events-none"
                onClick={() =>
                  setAmount(() => {
                    if (!lpPosition) return "0.00";
                    return _getDecimalAdjusted(lpPosition.counterLpAmt, 18);
                  })
                }
                disabled={!isConnected || !lpBalance}
              >
                Max
              </button>
            </div>
          </div>
        </div>
        {/* YOU RECEIVE */}
        <div className="rounded-[4px] border-x-secondary-gray flex flex-col gap-y-2 border border-secondary-gray p-4">
          <p className="w-full inline-flex justify-between font-medium text-xs/3 text-[#5F7183]">
            <span>You Receive</span>
            <span>
              {!oraclePrice && !isValidPositiveNumber(amount)
                ? "..."
                : parseFloat(amount) > 0
                  ? "~" +
                    formatNumber(
                      oraclePrice * getDecimalAdjusted(lpUnderlying, underlyingDecimals),
                      true,
                      3
                    )
                  : "~$0.000"}
            </span>
          </p>
          <div className="inline-flex-between">
            <div className="max-w-fit inline-flex gap-2 items-center">
              <Image
                src={`/tokens/${underlying.toLowerCase()}.svg`}
                alt="token"
                width={24}
                height={24}
              />
              <span className="font-medium text-base/5">{underlying}</span>
            </div>
            <span className="text-xl/6 font-medium w-fit bg-primary-gray outline-none text-right">
              {isLpUnderlyingFetching
                ? "..."
                : !!lpUnderlying && lpUnderlying !== "0"
                  ? getCorrectFormattedValue(
                      getDecimalAdjusted(lpUnderlying, underlyingDecimals)
                    )
                  : "-"}
            </span>
          </div>
          <div className="font-normal text-xs/3 mt-1">
            <span className="text-[#5F7183]">
              Your balance:{" "}
              {isBalLoading && !userBalance && !lpUnderlying
                ? "loading..."
                : toUnits(parseFloat(userBalance?.formatted ?? "0"), 3)}
            </span>
          </div>
        </div>
        {showInfo && (
          <InfoBox
            isError={balanceExceedError}
            message={
              balanceExceedError
                ? "It appears you are attempting to withdraw more Liquidity Pool (LP) Tokens than you currently hold in your account."
                : undefined
            }
          />
        )}
      </div>
      <div className="flex flex-col gap-4 mt-3">
        <ButtonCTA
          disabled={
            !isConnected ||
            !userBalance ||
            !lpUnderlying ||
            balanceExceedError ||
            !lpPosition ||
            isLoading ||
            isLpUnderlyingFetching ||
            !isValidPositiveNumber(amount)
          }
          onClick={() => {
            if (isConnected) {
              removeLiquidityHandlerSdk();
            } else {
              openConnectModal?.();
            }
          }}
          isLoading={isLoading || isLpUnderlyingFetching}
        >
          {isConnected ? <span>Remove Liquidity</span> : <span>Connect Wallet</span>}
        </ButtonCTA>
      </div>
    </div>
  );
};

export default RemoveLiquidity;
