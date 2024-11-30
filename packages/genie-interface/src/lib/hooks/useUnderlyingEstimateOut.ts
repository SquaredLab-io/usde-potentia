import { useEffect, useState } from "react";
import { usePotentiaSdk } from "./usePotentiaSdk";
import _ from "lodash";

interface PropsType {
  poolAddress: `0x${string}` | undefined;
  amount: string | undefined;
  isLong: boolean;
  paused?: boolean;
}

interface ReturnType {
  output: string | undefined;
  isFetching: boolean;
}

const useUnderlyingEstimateOut = ({
  poolAddress,
  amount,
  isLong,
  paused = false
}: PropsType) => {
  const [output, setOutput] = useState<string | undefined>(undefined);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { potentia } = usePotentiaSdk();

  const estimatePositionUnderlyingOut = _.debounce(
    async (poolAddr: `0x${string}`, amt: string, long: boolean) => {
      console.log("estimatePositionUnderlyingOut args", {
        pool: poolAddress!,
        amount: amount!
      });

      const _amount = (parseFloat(amt) * 10 ** 18).toString();
      setIsFetching(true);

      try {
        const data = await potentia?.ponderClient.estimatePositionUnderlyingOut(
          poolAddr,
          _amount,
          long
        );
        setOutput(data);
      } catch (error) {
        console.error("Failed to estimate underlying output");
      } finally {
        setIsFetching(false);
      }
    },
    500
  );

  useEffect(() => {
    if (!paused && !!potentia && !!poolAddress && !!amount) {
      estimatePositionUnderlyingOut(poolAddress, amount, isLong);
    }

    return () => {
      estimatePositionUnderlyingOut.cancel();
    };
  }, [amount, poolAddress, isLong, paused, potentia]);

  return {
    output,
    isFetching
    // refetch:
  } satisfies ReturnType;
};

export default useUnderlyingEstimateOut;
