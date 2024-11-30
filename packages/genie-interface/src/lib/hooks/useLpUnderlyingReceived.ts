import { useEffect, useState } from "react";
import _ from "lodash";
import { usePotentiaSdk } from "./usePotentiaSdk";

interface PropsType {
  poolAddress: `0x${string}` | undefined;
  amount: string | undefined;
  paused?: boolean;
}

interface ReturnType {
  output: string | undefined;
  isFetching: boolean;
}

const useLpUnderlyingReceived = ({ poolAddress, amount, paused = false }: PropsType) => {
  const [output, setOutput] = useState<string | undefined>(undefined);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const { potentia } = usePotentiaSdk();

  const estimatePositionUnderlyingOut = _.debounce(
    async (poolAddr: `0x${string}`, amt: string) => {
      const _amount = (parseFloat(amt) * 10 ** 18).toString();
      setIsFetching(true);

      try {
        const data = await potentia?.ponderClient.estimateLiqUnderlyingOut(
          poolAddr,
          _amount
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
      estimatePositionUnderlyingOut(poolAddress, amount);
    }

    return () => {
      estimatePositionUnderlyingOut.cancel();
    };
  }, [amount, paused, potentia, poolAddress]);

  return {
    output,
    isFetching
    // refetch:
  } satisfies ReturnType;
};

export default useLpUnderlyingReceived;
