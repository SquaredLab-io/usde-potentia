import { useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { PotentiaSdk } from "@squaredlab-io/sdk/src";
import { PONDER_URL, SQL_CHANNEL_URL } from "@lib/keys";

/**
 * Hook to creates a Potentia SDK instance after a user is connected
 * @returns Potentia SDK Instance
 */
export const usePotentiaSdk = () => {
  const [potentia, setPotentia] = useState<PotentiaSdk | undefined>(undefined);

  const { data: walletClient, status } = useWalletClient();

  const publicClient: any = createPublicClient({
    chain: baseSepolia,
    transport: http()
  });

  async function userConnected() {
    const potentia = new PotentiaSdk(publicClient, PONDER_URL, SQL_CHANNEL_URL);
    setPotentia(potentia);
  }

  useEffect(() => {
    userConnected();
  }, []);

  useEffect(() => {
    if (potentia !== undefined && status === "success") {
      potentia.initialiseSDK(walletClient);
    }
  }, [potentia, walletClient]);

  return {
    potentia
  };
};
