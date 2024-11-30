import { useEffect, useState } from "react";
import { usePotentiaSdk } from "./usePotentiaSdk";
import _ from "lodash";

interface PropsType {
  poolAddress: `0x${string}` | undefined;
  amount: string | undefined;
  paused?: boolean;
}

interface ReturnType {
  output: string | undefined;
  isFetching: boolean;
}

const useLpTokenReceiveEstimate = ({
  poolAddress,
  amount,
  paused = false
}: PropsType) => {
  const [output, setOutput] = useState<string | undefined>(undefined);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { potentia } = usePotentiaSdk();

  const estimateLPTokenOut = _.debounce(async (poolAddr: `0x${string}`, amt: string) => {
    setIsFetching(true);
    try {
      const data = await potentia?.ponderClient.estimateLiqLPOut(
        poolAddr, // pool address
        amt // underlying amount in bignumber
      );
      setOutput(data);
    } catch (error) {
      console.error("Failed to estimate LpToken output");
    } finally {
      setIsFetching(false);
    }
  }, 500);

  useEffect(() => {
    if (!paused && !!potentia && !!poolAddress && !!amount) {
      estimateLPTokenOut(poolAddress, amount);
    } else {
      console.log("Skipping estimate due to missing or paused data");
    }

    return () => {
      estimateLPTokenOut.cancel();
    };
  }, [amount]);

  return {
    output,
    isFetching
  } satisfies ReturnType;
};

export default useLpTokenReceiveEstimate;
