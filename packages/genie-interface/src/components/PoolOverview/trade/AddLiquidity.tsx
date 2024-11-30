"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { WethABi } from "@lib/abis";
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import toUnits, {
  formatNumber,
  formatOraclePrice,
  getCorrectFormattedValue,
  getDecimalAdjusted,
  getDecimalDeadjusted
} from "@lib/utils/formatting";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { isValidPositiveNumber } from "@lib/utils/checkVadility";
import ButtonCTA from "@components/common/button-cta";
import notification from "@components/common/notification";
import { CONFIRMATION } from "@lib/constants";
import { Address } from "viem";
import { PoolInfo } from "@squaredlab-io/sdk/src/interfaces/index.interface";
import { useCurrencyPrice } from "@lib/hooks/useCurrencyPrice";
import { cn } from "@lib/utils";
import InfoBox from "../info-box";
import useTokenBalance from "@lib/hooks/useTokenBalance";
import useLpTokenReceiveEstimate from "@lib/hooks/useLpTokenReceiveEstimate";
import { ReturnTxHistory } from "@lib/hooks/useCurrentLpPosition";
import { notificationId } from "@components/Trade/helper";
import { toast } from "sonner";
import useApproveToken from "@lib/hooks/useApproveToken";
import useIsApprovedToken from "@lib/hooks/useIsApprovedToken";

interface PropsType {
  overviewPool: PoolInfo;
  lpTokenBalance: ReturnTxHistory;
}

const AddLiquidity = ({ overviewPool, lpTokenBalance }: PropsType) => {
  const [amount, setAmount] = useState<string>("");
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const [txHash, setTxHash] = useState<Address | undefined>(undefined);

  const { addLiq_event } = notificationId;

  const { potentia } = usePotentiaSdk();
  const { openConnectModal } = useConnectModal();

  const { underlying, poolAddr, underlyingAddress, underlyingDecimals } = overviewPool;

  // Contract Hooks
  const { isConnected } = useAccount();
  const {
    data: userBalance,
    isFetching: isBalLoading,
    refetch: refetchBalance
  } = useTokenBalance({
    token: underlyingAddress! as Address,
    decimals: underlyingDecimals,
    symbol: underlying
  });

  // Check approved tokens amount
  const {
    // isApprovedData,
    isApprovedLoading,
    // isApprovedError,
    isApprovedSuccess
  } = useIsApprovedToken({
    tokenAddress: overviewPool.underlyingAddress as Address,
    poolAddress: overviewPool.poolAddr as Address,
    tokenBalance: userBalance,
    input: parseFloat(amount ?? "0")
  });

  const {
    isApproveLoading,
    isApprovePending,
    isApproveSuccess,
    // approveError,
    isApproveError,
    approvalError,
    writeApproveToken
  } = useApproveToken();

  // get estimate of LP tokens that will be received
  const { output: lpTokens, isFetching: isLpTokenFetching } = useLpTokenReceiveEstimate({
    poolAddress: poolAddr as Address,
    amount: getDecimalDeadjusted(amount, underlyingDecimals)
  });

  // getting underlying token's price from coingecko api
  const { price, isMarketDataLoading: isPriceFetching } = useCurrencyPrice(underlying);

  // get connected user's current LP Position
  const {
    data: lpPosition,
    isFetching: isLpPositionFetching,
    refetch: refetchLpPosition
  } = lpTokenBalance;

  // Connected user's LP Token balance
  const lpBalance = getDecimalAdjusted(lpPosition?.counterLpAmt, 18);

  // const oraclePrice = lpPosition ? formatOraclePrice(BigInt(lpPosition.oraclePrice)) : 0;

  // TODO: Change it back to oraclePrice after it's available in SDK
  const lpPriceInDollars = lpPosition
    ? price * parseFloat(lpPosition.lpTokenPriceUnderlying)
    : 0;
  // const lpPriceInDollars = lpPosition
  //   ? oraclePrice * parseFloat(lpPosition.lpTokenPriceUnderlying)
  //   : 0;

  /**
   * This handler method approves signers underlying tokens to be spent on Potentia Protocol
   */
  const approveHandler = async () => {
    const _amount = parseFloat(amount) * 10 ** overviewPool.underlyingDecimals;
    try {
      await writeApproveToken({
        abi: WethABi,
        address: overviewPool.underlyingAddress as Address,
        functionName: "approve",
        args: [
          overviewPool.poolAddr,
          BigInt(_amount).toString() // Approving as much as input amount only
        ]
      });
    } catch (error) {
      notification.error({
        id: addLiq_event.error,
        title: "Token Approval Unsuccessful",
        description: "Unable to initiate token approval."
      });
    }
  };

  /**
   * Handler for Addliquidity Function
   */
  async function addLiquidityHandlerSdk() {
    const _amount = parseFloat(amount) * 10 ** underlyingDecimals;
    try {
      const hash = await potentia?.poolWrite.addLiquidity(
        overviewPool.poolAddr,
        BigInt(_amount).toString()
      );
      if (hash) {
        setTxHash(hash as Address);
      }
    } catch (error) {
      console.error("Error while Adding liquidity", error);
      notification.error({
        id: addLiq_event.error,
        title: "Add Liquidity Failed",
        description: "Unable to initiate liquidity supply. Please try again."
      });
    }
  }

  // wait for add liquidity transaction
  const { isSuccess, isLoading, isPending, isError, error } =
    useWaitForTransactionReceipt({
      hash: txHash,
      confirmations: CONFIRMATION
    });

  const balanceExceedError = useMemo(
    () => !!userBalance?.value && parseFloat(amount) > parseFloat(userBalance?.formatted),
    [userBalance, amount]
  );

  // Approval Loading or Error Effects
  useEffect(() => {
    if (isApproveLoading) {
      notification.loading({
        id: addLiq_event.approve_loading,
        title: "Approving Token",
        description: "This may take ~20 seconds."
      });
    } else if (isApproveError) {
      toast.dismiss(addLiq_event.approve_loading);
      notification.error({
        id: addLiq_event.approve_error,
        title: "Token Approval Failed",
        description: "Approval transaction failed. Please try again."
      });
    }
  }, [isApproveLoading, isApproveError]);

  // Executes Add Liquidity handlers if Approval Txn is successful
  useEffect(() => {
    if (isApproveSuccess) {
      toast.dismiss(addLiq_event.approve_loading);
      notification.success({
        id: addLiq_event.approve_success,
        title: "Tokens Approved successfully",
        description: "You may now process to Add Liquidity"
      });
      addLiquidityHandlerSdk();
    }
  }, [isApproveSuccess]);

  // add liq. Tx Loading or Error Effects
  useEffect(() => {
    if (isLoading) {
      notification.loading({
        id: addLiq_event.loading,
        title: "Adding Liquidity",
        description: "This may take ~20 seconds."
      });
    } else if (isError) {
      toast.dismiss(addLiq_event.loading);
      notification.error({
        id: addLiq_event.error,
        title: "Add Liquidity Failed",
        description: "Unable to open position. Please try again."
      });
    }
  }, [isLoading, isError]);

  // add liq. Tx Successful Effects
  useEffect(() => {
    if (isSuccess) {
      refetchBalance();
      refetchLpPosition();
      toast.dismiss(addLiq_event.loading);
      setAmount("");
      notification.success({
        id: addLiq_event.success,
        title: "Liquidity Added Successfully",
        description: "You have added liquidity."
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
              {isPriceFetching && !price && !isValidPositiveNumber(amount)
                ? "..."
                : parseFloat(amount) > 0
                  ? "~" +
                    formatNumber(
                      price * parseFloat(amount !== "" ? amount : "0"),
                      true,
                      3
                    )
                  : "~$0.000"}
            </span>
          </p>
          <div className="inline-flex-between">
            <label
              className="max-w-fit inline-flex gap-2 items-center"
              htmlFor="add_liquidity_quantity"
            >
              <Image
                src={`/tokens/${overviewPool?.underlying.toLowerCase()}.svg`}
                alt="token"
                width={24}
                height={24}
              />
              <span className="font-medium text-base/5">{underlying}</span>
            </label>
            <input
              type="number"
              value={amount}
              placeholder="0"
              onChange={(event) => {
                setAmount(event.target.value);
              }}
              id="add_liquidity_quantity"
              className="text-xl/6 font-medium w-1/2 bg-primary-gray outline-none text-right"
            />
          </div>
          <div className="inline-flex items-end justify-between font-normal text-xs/3">
            <span
              className={cn(balanceExceedError ? "text-error-red" : "text-[#5F7183]")}
            >
              Your balance:{" "}
              {isBalLoading && !userBalance
                ? "loading..."
                : toUnits(parseFloat(userBalance?.formatted ?? "0"), 3)}
            </span>
            <div className="inline-flex gap-2">
              <button
                className="py-[5.5px] px-[6px] rounded-[4px] bg-[#212C42] hover:bg-[#283751] transition-colors disabled:opacity-50 disabled:pointer-events-none"
                onClick={() =>
                  setAmount((parseFloat(userBalance?.formatted ?? "0") * 0.5).toString())
                }
                disabled={!isConnected || !userBalance?.formatted}
              >
                Half
              </button>
              <button
                className="py-[5.5px] px-[6px] rounded-[4px] bg-[#212C42] hover:bg-[#283751] transition-colors disabled:opacity-50 disabled:pointer-events-none"
                onClick={() =>
                  setAmount(parseFloat(userBalance?.formatted ?? "0").toString())
                }
                disabled={!isConnected || !userBalance?.formatted}
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
              {isLpPositionFetching || isLpTokenFetching
                ? "..."
                : lpPriceInDollars && lpTokens && lpTokens !== "0"
                  ? "~" +
                    formatNumber(
                      lpPriceInDollars * getDecimalAdjusted(lpTokens, 18),
                      true,
                      3
                    )
                  : "~$0.000"}
            </span>
          </p>
          <div className="inline-flex-between">
            <h4 className="font-medium text-base/5">LP Tokens</h4>
            <span className="text-xl/6 font-medium w-fit bg-primary-gray outline-none text-right">
              {isLpTokenFetching
                ? "..."
                : !!lpTokens && lpTokens !== "0"
                  ? getCorrectFormattedValue(getDecimalAdjusted(lpTokens, 18))
                  : "-"}
            </span>
          </div>
          <div className="font-normal text-xs/3 mt-1">
            <span className="text-[#5F7183]">
              Your LP balance:{" "}
              {isLpPositionFetching && !lpPosition ? "loading..." : toUnits(lpBalance, 3)}
            </span>
          </div>
        </div>
        {showInfo && (
          <InfoBox
            isError={balanceExceedError}
            message={
              balanceExceedError
                ? "Insufficient funds. Please deposit more tokens to add the required liquidity."
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
            !lpTokens ||
            balanceExceedError ||
            isApprovedLoading ||
            isApproveLoading ||
            isApprovePending ||
            isLoading ||
            isLpTokenFetching ||
            (isApproveSuccess && isPending) ||
            !isValidPositiveNumber(amount)
          }
          isLoading={
            isApprovedLoading || isApproveLoading || isLoading || isLpTokenFetching
          }
          onClick={() => {
            if (isConnected) {
              if (!isApprovedSuccess) {
                approveHandler();
              } else {
                addLiquidityHandlerSdk();
              }
            } else {
              openConnectModal?.();
            }
          }}
        >
          {isConnected ? <span>Add Liquidity</span> : <span>Connect Wallet</span>}
        </ButtonCTA>
      </div>
    </div>
  );
};

export default AddLiquidity;
