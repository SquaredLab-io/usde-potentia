import AppDrawer from "@components/common/AppDrawer";
// Library Imports
import { ChangeEvent, memo, useCallback, useEffect, useMemo, useState } from "react";
import { Address } from "viem";
import { toast } from "sonner";
import BigNumber from "bignumber.js";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { OpenPositionInfo } from "@squaredlab-io/sdk";
// Component Imports
import { Separator } from "@components/ui/separator";
import DropDownIcon from "@components/icons/DropDownIcon";
import SliderBar from "@components/common/slider-bar";
import SpinnerIcon from "@components/icons/SpinnerIcon";
import notification from "@components/common/notification";
import { usePoolsStore } from "@store/poolsStore";
import { cn } from "@lib/utils";
// Hook and Util Imports
import { usePotentiaSdk } from "@lib/hooks/usePotentiaSdk";
import {
  _getDecimalAdjusted,
  formatNumber,
  getDecimalAdjusted,
  getDecimalDeadjusted
} from "@lib/utils/formatting";
import { CONFIRMATION } from "@lib/constants";
import { isValidPositiveNumber } from "@lib/utils/checkVadility";
import { notificationId } from "../../helper";
import { useOpenOrders } from "@lib/hooks/useOpenOrders";
import useUnderlyingEstimateOut from "@lib/hooks/useUnderlyingEstimateOut";
import { useTxHistory } from "@lib/hooks/useTxHistory";
import useTokenBalance from "@lib/hooks/useTokenBalance";
import { useTradeStore } from "@store/tradeStore";
import { useUserPoints } from "@lib/hooks/useUserPoints";
import { z } from "zod";
import { TransactionLoading, TransactionSuccess } from "@components/Trade/trade-drawer-section/transaction-interfaces";

interface PropsType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // children: React.ReactNode;
  position: OpenPositionInfo;
  isLong: boolean;
  className?: string;
}

const ClosePositionDrawer = ({ open, onOpenChange, position, isLong }: PropsType) => {
  const [quantity, setQuantity] = useState("");
  const [inputAmount, setInputAmount] = useState("");
  const [sliderValue, setSliderValue] = useState(0);

  const { address } = useAccount();

  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [isHandlerLoading, setIsHandlerLoading] = useState(false);

  const { potentia } = usePotentiaSdk();

  const { setClosePopoverDisabled } = useTradeStore();
  const { poolMap } = usePoolsStore();
  const { close_event } = notificationId;

  const balance = new BigNumber(position?.tokenSize ?? "0");

  const isValidQuantity = !isNaN(parseFloat(quantity));

  // Getting the speicifc pool data from Mapping
  const poolData = poolMap?.[position.pool]!;

  // All current positions
  const { refetch: refetchOpenOrders } = useOpenOrders({
    paused: true
  });
  // Closed orders History
  const { refetch: refetchTxHistory } = useTxHistory(true);
  // User Points
  const { refetch: refetchUserPoints } = useUserPoints({ address });

  // Get the Estimate Underlying Output
  const { output, isFetching: isOutputFetching } = useUnderlyingEstimateOut({
    poolAddress: poolData.poolAddr as Address,
    amount: quantity,
    isLong
  });

  const { refetch: refetchBalance } = useTokenBalance({
    token: poolData.underlyingAddress as Address,
    decimals: poolData.decimals,
    symbol: poolData.underlying
  });

  /**
   * Handler for closePosition from SDK
   */
  async function closePositionHandlerSdk() {
    const amount = getDecimalDeadjusted(quantity, poolData.decimals);
    // const amount = BigInt(quantity).toString();
    setIsHandlerLoading(true);
    // notification.loading({
    //   id: close_event.loading_init,
    //   title: "Close Position Initiated",
    //   description: "Please accept the transaction."
    // });
    try {
      const hash = await potentia?.poolWrite.closePosition(
        position?.pool!,
        amount,
        isLong
      );
      setTxHash(hash as Address);

      // dismissing loading status and toast
      toast.dismiss(close_event.loading_init);
      setIsHandlerLoading(false);
    } catch (error) {
      // dismiss loading toast onError
      toast.dismiss(close_event.loading_init);
      notification.error({
        id: close_event.default,
        title: "Close Position Failed",
        description: "Unable to initiate position closure. Try again"
      });
      setIsHandlerLoading(false);
      console.error("closePosition Error", error);
    } finally {
      toast.dismiss(close_event.loading_init);
      setIsHandlerLoading(false);
    }
  }

  // Memoized function to handle transaction status updates and notifications
  const handleTransactionStatus = useCallback(
    (status: "loading" | "success" | "error", errorMessage?: string) => {
      switch (status) {
        // case "loading":
        //   notification.loading({
        //     id: close_event.loading,
        //     title: "Closing Position",
        //     description: "This may take ~30 seconds."
        //   });
        //   break;
        case "success":
          // toast.dismiss(close_event.loading);
          // notification.success({
          //   id: close_event.success,
          //   title: "Position Closed Successfully",
          //   description: "Your position has been closed."
          // });
          refetchOpenOrders();
          refetchTxHistory();
          refetchBalance();
          refetchUserPoints();
          break;
        case "error":
          toast.dismiss(close_event.loading);
          notification.error({
            id: close_event.error,
            title: "Transaction Failed",
            description: "Closing position failed. Please try again."
          });
          break;
      }
    },
    [refetchOpenOrders, refetchTxHistory, refetchBalance]
  );

  // wait for closePosition transaction
  const { isSuccess, isLoading, isPending, isError, error, status } =
    useWaitForTransactionReceipt({
      hash: txHash,
      confirmations: CONFIRMATION
    });

  useEffect(() => {
    if (isLoading && isPending) {
      handleTransactionStatus("loading");
    } else if (status === "success") {
      handleTransactionStatus("success");
    } else if (status === "error") {
      handleTransactionStatus("error", error?.message);
    }
  }, [status, isLoading, isPending, error, handleTransactionStatus]);

  // condition to check if input is more than available balance
  const balanceExceedError = useMemo(() => {
    const balanceCheck = z
      .number()
      .gt(parseFloat(_getDecimalAdjusted(balance.toFixed(), poolData.decimals)))
      .safeParse(parseFloat(quantity)).success;
    return balanceCheck;
  }, [balance, quantity]);

  // Handler that updates Quantity and keep SliderValue in sync
  function inputHandler(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target.value;
    setQuantity(input);
    setInputAmount(input);
    if (balance) {
      const value = isValidQuantity
        ? (parseFloat(input) /
            getDecimalAdjusted(balance.toFixed(0), poolData.decimals)) *
          100
        : 0;
      setSliderValue(value);
    }
  }

  // Handler that updates SliderValue and keep Quantity in sync
  function sliderHandler(value: number) {
    setSliderValue(value);
    if (balance) {
      const amount = _getDecimalAdjusted(
        balance.multipliedBy(BigNumber(value)).dividedBy(BigNumber(100)).toFixed(0),
        poolData.decimals
      );
      setQuantity(amount);
      setInputAmount(parseFloat(amount).toFixed(2));
    }
  }

  const isPopoverClosingDisabled = isHandlerLoading || isLoading;
  useEffect(() => {
    if (isHandlerLoading || isLoading || open) {
      setClosePopoverDisabled(true);
    } else {
      setClosePopoverDisabled(false);
    }
  }, [isHandlerLoading, isLoading, open]);

  return (
    <AppDrawer open={open} onOpenChange={onOpenChange} className="pt-5 pb-8 text-left">
      {isLoading && isPending ? (
        <TransactionLoading title="Closing Position" />
      ) : isSuccess ? (
        <TransactionSuccess />
      ) : (
        <>
          {/* Title */}
          <h1 className="text-left font-sans-ibm-plex font-medium text-base/5 mb-[18px] px-3">
            {`Close ${isLong ? "Long" : "Short"} Position`}
          </h1>
          {/* Closing Amount Container - Input, Token */}
          <div className="flex flex-col gap-2 text-left text-xs/[14px] font-normal text-[#9299AA] pb-5 px-3">
            <label htmlFor="quantity">Quantity</label>
            <div
              className={cn(
                "flex flex-col items-start w-full border-spacing-0 border rounded-[4px] p-3 mb-1",
                balanceExceedError ? "border-error-red" : "border-secondary-gray"
              )}
            >
              <div className="inline-flex justify-between items-center w-full text-base/5 font-normal">
                <input
                  type="number"
                  value={inputAmount}
                  placeholder="0"
                  onChange={inputHandler}
                  id="quantity"
                  className="bg-transparent p-2 w-full placeholder:text-[#6D6D6D] text-white focus:outline-none"
                />
                <p className="inline-flex items-center gap-[2px]">
                  <span className="w-fit text-[#6D6D6D] items-center justify-between rounded-md">
                    {poolData.underlying}
                    <sup>{poolData.power}</sup>
                  </span>
                  <span className="opacity-60">{isLong ? "L" : "S"}</span>
                </p>
              </div>
              <span className={cn(balanceExceedError && "text-error-red")}>
                Balance:{" "}
                {formatNumber(getDecimalAdjusted(balance.toFixed(0), poolData.decimals))}
              </span>
            </div>
            <SliderBar
              value={sliderValue}
              setValue={sliderHandler}
              min={0}
              max={100}
              indices={[0, 25, 50, 75, 100]}
              isPerc={true}
            />
          </div>
          <Separator />
          <div className="flex flex-col gap-3 pt-2 px-3">
            <div className="w-full px-4 mt-1 inline-flex items-center justify-between font-medium text-xs/4">
              <span>Payout</span>
              <p className="inline-flex items-center gap-[2px]">
                <span>
                  {isOutputFetching
                    ? "..."
                    : isValidQuantity
                      ? formatNumber(getDecimalAdjusted(output, poolData.decimals))
                      : "N/A"}{" "}
                  {poolData.underlying}
                </span>
                <DropDownIcon className="w-3" />
              </p>
            </div>
            {/* CTA -- Close Position */}
            <button
              className={cn(
                "w-full py-2 uppercase text-[#CF1800] bg-[#39150F] hover:bg-[#491a12] font-sans-ibm-plex font-medium text-sm/6 transition-colors",
                "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed"
              )}
              onClick={closePositionHandlerSdk}
              disabled={
                !isValidPositiveNumber(quantity) ||
                balanceExceedError ||
                isPopoverClosingDisabled ||
                !balance ||
                !output ||
                // !selectedPool() ||
                isOutputFetching
              }
            >
              {(isPopoverClosingDisabled || isOutputFetching) && !isError ? (
                <SpinnerIcon className="size-5 mx-auto" />
              ) : (
                <span>CLOSE POSITION</span>
              )}
            </button>
          </div>
        </>
      )}
    </AppDrawer>
  );
};

export default memo(ClosePositionDrawer);
