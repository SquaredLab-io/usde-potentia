import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { CONFIRMATION } from "@lib/constants";

/**
 * A combined that writes and awaits Token Approval Tx
 */
const useApproveToken = () => {
  const {
    data,
    isPending: isApprovePending,
    error: approveError,
    writeContractAsync
  } = useWriteContract();

  // wait for approval tx
  const {
    isSuccess: isApproveSuccess,
    isLoading: isApproveLoading,
    isError: isApproveError,
    error: approvalError
  } = useWaitForTransactionReceipt({
    hash: data,
    confirmations: CONFIRMATION
  });

  return {
    isApproveLoading,
    isApprovePending,
    isApproveSuccess,
    approveError,
    isApproveError,
    approvalError,
    writeApproveToken: writeContractAsync
  };
};

export default useApproveToken;
