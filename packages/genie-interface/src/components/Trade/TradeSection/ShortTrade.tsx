"use client";

// Library Imports
import { ChangeEvent, FC, memo, useEffect, useMemo, useState } from "react";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { Address } from "viem";
import { BiSolidDownArrow } from "react-icons/bi";
import { type PotentiaSdk } from "@squaredlab-io/sdk/src";
// Component, Util Imports
import {} from "../TradeChart/defaultWidgetProps";
import SliderBar from "@components/common/slider-bar";
import { getAccountBalance } from "@lib/utils/getAccountBalance";
import { WethABi } from "@lib/abis";
import { isValidPositiveNumber } from "@lib/utils/checkVadility";
import TokenSelectPopover from "@components/common/TokenSelectPopover";
import { cn } from "@lib/utils";
import ButtonCTA from "@components/common/button-cta";
import TradeInfo, { Marker } from "./TradeInfo";
// Notification
import { toast } from "sonner";
import notification from "@components/common/notification";
import { notificationId } from "../helper";
import {
  _getDecimalAdjusted,
  formatNumber,
  getDecimalAdjusted,
  getDecimalDeadjusted
} from "@lib/utils/formatting";
import { CONFIRMATION } from "@lib/constants";
import { usePoolsStore } from "@store/poolsStore";
import { useOpenOrders } from "@lib/hooks/useOpenOrders";
import { useCurrencyPrice } from "@lib/hooks/useCurrencyPrice";
import { useTradeHistory } from "@lib/hooks/useTradeHistory";
import { z } from "zod";
import useIsApprovedToken from "@lib/hooks/useIsApprovedToken";
import useApproveToken from "@lib/hooks/useApproveToken";
import useTokenBalance from "@lib/hooks/useTokenBalance";
import usePTokenEstimateOut from "@lib/hooks/usePTokenEstimateOut";
import BigNumber from "bignumber.js";
import { useUserPoints } from "@lib/hooks/useUserPoints";

interface PropsType {
  potentia?: PotentiaSdk;
}

const ShortTrade: FC<PropsType> = memo(({ potentia }) => {
  const { selectedPool } = usePoolsStore((state) => state);

  const { short_event } = notificationId;

  const [quantity, setQuantity] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [sliderValue, setSliderValue] = useState<number>(25);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  // Contract Hooks
  const { isConnected, address } = useAccount();

  const {
    data: userBalance,
    isFetching: isBalLoading,
    refetch: refetchBalance
  } = useTokenBalance({
    token: selectedPool()?.underlyingAddress as Address,
    decimals: selectedPool()?.underlyingDecimals!,
    symbol: selectedPool()?.underlying!
  });
  const balance = userBalance?.value;

  // Both hooks paused, Refetch method to be used on Successful tx
  const {
    openOrders: positionData,
    isFetching: isPositionFetching,
    refetch: refetchOpenOrders
  } = useOpenOrders({
    paused: true
  });
  // Current Short Position tokensize
  const shortPosition = positionData?.shortPositions.find(
    (pos) => pos.pool == selectedPool()?.poolAddr
  )?.tokenSize;

  // Get the Estimate Underlying Output
  const { output, isFetching: isOutputFetching } = usePTokenEstimateOut({
    poolAddress: selectedPool()?.poolAddr as Address,
    amount: getDecimalDeadjusted(quantity, selectedPool()?.underlyingDecimals), // in bignumber by adjusting decimals
    isLong: false
  });

  // getting underlying token's price
  const { price, isMarketDataLoading } = useCurrencyPrice(selectedPool()?.underlying);

  const { refetch: refetchTradeHistory } = useTradeHistory(true);

  const { refetch: refetchUserPoints } = useUserPoints({ address });

  // Check approved tokens amount
  const {
    isApprovedData,
    isApprovedLoading,
    isApprovedSuccess,
    refetch: refetchIsApproved
  } = useIsApprovedToken({
    tokenAddress: selectedPool()?.underlyingAddress as Address,
    poolAddress: selectedPool()?.poolAddr as Address,
    tokenBalance: userBalance,
    input: parseFloat(quantity ?? "0")
  });

  const {
    isApproveLoading,
    isApprovePending,
    isApproveSuccess,
    approveError,
    isApproveError,
    approvalError,
    writeApproveToken
  } = useApproveToken();

  /**
   * This handler method approves signers TOKEN_ADDR tokens to be spent on Potentia Protocol
   */
  const approveHandler = async () => {
    if (!selectedPool()) return;

    const _quantity = getDecimalDeadjusted(quantity, selectedPool()?.underlyingDecimals);
    // const _amount = BigNumber(_quantity)
    //   .minus(BigNumber(isApprovedData as BigNumber))
    //   .toFixed(0);

    // const _amount = parseFloat(quantity) * 10 ** 18;
    try {
      await writeApproveToken({
        abi: WethABi,
        address: selectedPool()?.underlyingAddress! as Address,
        functionName: "approve",
        args: [
          selectedPool()?.poolAddr! as Address,
          BigInt(_quantity).toString() // Approving as much as input amount only
        ]
      });
    } catch (error) {
      notification.error({
        id: short_event.default_approve,
        title: "Token Approval Unsuccessful",
        description: "Unable to initiate token approval."
      });
    }
  };

  // wait for open short position transaction
  const { isSuccess, isLoading, isPending, isError, error } =
    useWaitForTransactionReceipt({
      hash: txHash,
      confirmations: CONFIRMATION
    });

  /**
   * Handler for Opening Short Position
   */
  const openShortPositionHandler = async () => {
    refetchIsApproved();
    const _amount = getDecimalDeadjusted(quantity, selectedPool()?.underlyingDecimals);
    try {
      const hash = await potentia?.poolWrite.openPosition(
        selectedPool()?.poolAddr as Address, // poolAddress
        BigInt(_amount).toString(), // amt
        false // isLong
      );
      // set txHash in a state
      if (hash) {
        setTxHash(hash as `0x${string}`);
      }
    } catch (e) {
      notification.error({
        id: short_event.default,
        title: "Open Position Failed",
        description: "Unable to open position. Please try again."
      });
    } finally {
      // console.log("open_short_position amount", _amount);
    }
  };

  const balanceExceedError = useMemo(
    () =>
      !!userBalance &&
      z.number().gt(parseFloat(userBalance?.formatted)).safeParse(parseFloat(quantity))
        .success,
    [userBalance, quantity]
  );

  const minQuantityCheck = useMemo(() => {
    // Current min quantity: 0.001 Underlying Tokens
    return z.number().min(0.001).safeParse(parseFloat(quantity)).success;
  }, [quantity]);

  // Handler that updates Quantity and keep SliderValue in sync
  function inputHandler(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target.value;
    setQuantity(input);
    setInputAmount(input);
    if (userBalance) {
      const value = isValidPositiveNumber(input)
        ? (parseFloat(input) /
            getDecimalAdjusted(balance?.toFixed(0), userBalance.decimals)) *
          100
        : 0;
      setSliderValue(value);
    }
  }

  // Handler that updates SliderValue and keep Quantity in sync
  function sliderHandler(value: number) {
    setSliderValue(value);
    if (userBalance) {
      const amount = _getDecimalAdjusted(
        balance?.multipliedBy(BigNumber(value)).dividedBy(BigNumber(100)).toFixed(0),
        userBalance.decimals
      );
      setQuantity(amount);
      setInputAmount(parseFloat(amount).toFixed(2));
    }
  }

  function defaultInputs() {
    sliderHandler(0);
    setInputAmount("");
  }

  // setting intital quantity
  // useEffect(() => {
  //   if (userBalance) {
  //     setQuantity(((parseFloat(userBalance?.formatted) * sliderValue) / 100).toString());
  //   }
  // }, [userBalance]);

  // Approval Loading or Error Effects
  useEffect(() => {
    if (isApproveLoading) {
      notification.loading({
        id: short_event.approve_loading,
        title: "Approving Token",
        description: "This may take ~30 seconds."
      });
    } else if (isApproveError) {
      toast.dismiss(short_event.approve_loading);
      notification.error({
        id: short_event.approve_error,
        title: "Token Approval Failed",
        description: "Approval transaction failed. Please try again."
      });
    }
  }, [isApproveError, isApproveLoading]);

  // Approval Successful Effects
  useEffect(() => {
    if (isApproveSuccess) {
      openShortPositionHandler();

      toast.dismiss(short_event.approve_loading);
      notification.success({
        id: short_event.approve_success,
        title: "Token Approved",
        description: "Token approval successful. Please wait..."
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApproveSuccess]);

  // Tx Loading or Error Effects
  useEffect(() => {
    if (isLoading) {
      notification.loading({
        id: short_event.loading,
        title: "Opening Position",
        description: "This may take ~30 seconds."
      });
    }
    if (isError) {
      toast.dismiss(short_event.loading);
      notification.error({
        id: short_event.default,
        title: "Transaction Failed",
        description: "Opening position failed. Please try again."
      });
    }
  }, [isError, isLoading]);

  // Tx Successful Effects
  useEffect(() => {
    if (isSuccess) {
      refetchBalance();
      refetchOpenOrders();
      refetchTradeHistory();
      refetchIsApproved();
      refetchUserPoints();

      defaultInputs();

      toast.dismiss(short_event.loading);
      notification.success({
        id: short_event.success,
        title: "Position Opened Successfully",
        description: "Your position is now open."
      });
    }
  }, [isSuccess]);

  // Condition to disable Inputting values
  const disabledInput = !userBalance || userBalance?.formatted === "0" || !isConnected;
  const minimumCheck = !minQuantityCheck && parseFloat(quantity) !== 0 && quantity !== "";

  return (
    <div className="flex flex-col font-normal text-xs/[14px] gap-2 py-6 px-4 2xl:py-[24px] 2xl:px-[16px]">
      <p className="inline-flex items-start gap-1 w-full">
        <span className="text-[#757B80]">Balance:</span>
        <span className="font-medium">
          {getAccountBalance(userBalance, isBalLoading)}{" "}
        </span>
      </p>
      <p className="inline-flex items-start gap-1 w-full">
        <span className="text-[#757B80]">Current Position:</span>
        {!isConnected ? (
          <span>0</span>
        ) : isPositionFetching && !positionData ? (
          <span>...</span>
        ) : (
          <span className="font-medium">
            {formatNumber(
              getDecimalAdjusted(shortPosition, selectedPool()?.underlyingDecimals)
            )}
          </span>
        )}
      </p>
      <form
        className="flex flex-col w-full gap-2 mt-5"
        autoComplete="off"
        autoCapitalize="off"
        name="token-quantity"
      >
        <label className="text-[#757B80]">Size:</label>
        {/* Input Box: Token Input and Selection */}
        <div
          className={cn(
            "inline-flex w-full justify-between items-center ring-1 py-[8px] px-[12px] bg-transparent",
            balanceExceedError || minimumCheck ? "ring-[#FF615C]" : "ring-[#1F2D3F]"
          )}
        >
          <div className="flex flex-col gap-1 items-start w-full max-w-full">
            <input
              id="quantity"
              placeholder={`Qty (min) is 0.001 ${selectedPool()?.underlying}`}
              type="number"
              value={inputAmount}
              onChange={inputHandler}
              disabled={disabledInput}
              className="bg-transparent py-[8px] w-full placeholder:text-[#6D6D6D] text-white font-noemal text-sm/4 2xl:text-[14px]/[16px] focus:outline-none"
            />
            <span className="text-[#404950] 2xl:text-[14px]">
              {isMarketDataLoading && !price && !isValidPositiveNumber(quantity)
                ? "..."
                : `${formatNumber(price * parseFloat(quantity !== "" ? quantity : "0"), true)}`}
            </span>
          </div>
          <TokenSelectPopover size="compact">
            <button className="hover:bg-transparent px-0 flex h-10 items-center justify-between gap-0 font-normal text-sm/4 2xl:text-[16px]/[16px] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1">
              <span className="text-nowrap">{selectedPool()?.underlying}</span>
              <BiSolidDownArrow className="h-3 w-3 ml-4" color="#9D9D9D" />
            </button>
          </TokenSelectPopover>
        </div>
        {balanceExceedError && (
          <p className="font-normal text-xs/[14px] text-[#FF615C]">Insufficient Funds</p>
        )}
        {minimumCheck && (
          <p className="font-normal text-xs/[14px] text-[#FF615C]">
            Minimum 0.001 {selectedPool()?.underlying} required
          </p>
        )}
      </form>
      {/* Slider Component */}
      <div className="w-full my-4">
        <SliderBar
          value={sliderValue}
          setValue={sliderHandler}
          min={0}
          max={100}
          indices={[0, 25, 50, 75, 100]}
          disabled={disabledInput}
          isPerc={true}
        />
      </div>
      <ButtonCTA
        disabled={
          !isConnected ||
          !userBalance ||
          !output ||
          isApproveLoading ||
          isApproveLoading ||
          isApprovePending ||
          isLoading ||
          isOutputFetching ||
          !minQuantityCheck ||
          balanceExceedError ||
          isApprovedLoading
        } // conditions to Short Button
        onClick={() =>
          isApprovedSuccess ? openShortPositionHandler() : approveHandler()
        }
        isLoading={isApproveLoading || isApprovedLoading || isLoading || isOutputFetching}
      >
        <span>OPEN</span>
      </ButtonCTA>
      <Marker
        label="Estimated Payout"
        value={`${
          isOutputFetching
            ? "..."
            : !isNaN(parseFloat(quantity)) && isConnected
              ? formatNumber(getDecimalAdjusted(output, 18))
              : "N/A"
        } ${selectedPool()?.underlying}`}
      />
      {/* Iterate this data after calculating/fetching */}
      <TradeInfo />
    </div>
  );
});

ShortTrade.displayName = "ShortTrade";

export default ShortTrade;
