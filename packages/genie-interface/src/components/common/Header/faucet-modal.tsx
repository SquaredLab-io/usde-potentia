"use client";

// Library Imports
import { memo, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Address } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
// Component Imports
import Modal from "@components/common/Modal";
import ButtonCTA from "@components/common/button-cta";
import SpinnerIcon from "@components/icons/SpinnerIcon";
import { DialogDescription, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { notificationId } from "@components/Trade/helper";
// Hook, Helper Imports
import { meta, SUPPORTED_NETWORKS, SUPPORTED_TOKENS } from "@lib/constants";
import notification from "../notification";
import { shortenHash } from "@lib/utils/formatting";
import useTokenBalance from "@lib/hooks/useTokenBalance";
import { usePoolsStore } from "@store/poolsStore";

interface PropsType {
  open: boolean;
  setOpen: (value: boolean) => void;
  trigger?: React.ReactNode;
}

// Define a type for transaction status
type TransactionStatus = "idle" | "loading" | "success" | "error";

const FaucetModal = ({ open, setOpen, trigger }: PropsType) => {
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const { faucet_event } = notificationId;

  // form states
  const [selectedNetwork, setSelectedNetwork] = useState(SUPPORTED_NETWORKS[0]);

  const { selectedPool } = usePoolsStore();

  // selecting selected pool's token as the deault token option in faucet
  const selectedToken = useMemo(() => {
    return (
      SUPPORTED_TOKENS.find((token) => {
        return token.address === selectedPool()?.underlyingAddress;
      }) ?? SUPPORTED_TOKENS[0]
    );
  }, [selectedPool()]);

  const { refetch: refetchBalance } = useTokenBalance({
    token: selectedPool()?.underlyingAddress as Address,
    decimals: selectedPool()?.underlyingDecimals,
    symbol: selectedPool()?.underlying
  });

  // tx states
  const [txStatus, setTxStatus] = useState<TransactionStatus>("idle");
  const [faucetStatus, setFaucetStatus] = useState<TransactionStatus>("idle");
  const [error, setError] = useState<string | undefined>();
  const [fError, setFError] = useState<string | undefined>();

  // addToken() adds token into the connected wallet
  async function addToken() {
    if (selectedToken.address === "0x0000000000000000000000000000000000000000") return;
    try {
      const success = await walletClient?.watchAsset({
        type: "ERC20",
        options: {
          address: selectedToken.address,
          decimals: selectedToken.decimals,
          symbol: selectedToken.token
        }
      });

      if (success) {
        notification.success({
          id: "faucet-add-success",
          title: `${selectedToken.token} token added in your Account`,
          description: "Please check in the wallet"
        });
      }
    } catch (error) {
      notification.error({
        id: "faucet-add-error",
        title: `Failed to add ${selectedToken.token} in the wallet`,
        description: `${error}`
      });
    }
  }

  async function checkFaucetAirdrop(id: string) {
    const checkAirdropUrl = "/api/checkAirdrop";

    // Request body for checking Faucet status
    const req = {
      id
    };

    setFaucetStatus("loading");
    setFError(undefined);

    try {
      const response = await axios.post(checkAirdropUrl, req);
      console.log("Airdrop status response", response);
      if (response.status === 200) {
        setFaucetStatus("success");
        toast.dismiss(faucet_event.status_loading);

        if ((response.data.status as boolean) === true) {
          notification.success({
            id: faucet_event.status_success,
            title: "Test tokens and ETH transferred successfully"
          });
          refetchBalance();
          addToken();
        } else {
          notification.info({
            id: faucet_event.status_success,
            title: `Faucet request is in Queue`,
            description: "Your Tokens will be added"
          });
          addToken();
        }
      } else {
        throw new Error(`Airdrop status check failed: ${response.status}`);
      }
    } catch (error) {
      console.error("Faucet Airdrop error:", error);
      if (error instanceof AxiosError) {
        setFError(error.response?.data?.error || error.message);
      } else {
        setFError(error instanceof Error ? error.message : String(error));
      }
      setFaucetStatus("error");
    }
  }

  async function callFaucetAirdrop(userAddr: Address) {
    const airdropUrl = "/api/airdrop";

    // Request body for all tokens
    const req = { userWallet: userAddr };

    setTxStatus("loading");
    setError(undefined);

    try {
      const response = await axios.post(airdropUrl, req);
      console.log("Airdrop response", response);
      if (response.status === 200) {
        setTxStatus("success");
        // refetchBalance();
        // addToken();
        const respId = response.data.id as string;
        await checkFaucetAirdrop(respId);
      } else {
        throw new Error(`Airdrop request failed: ${response.status}`);
      }
    } catch (error) {
      console.error("Faucet airdrop call error:", error);
      if (error instanceof AxiosError) {
        setError(error.response?.data?.error || error.message);
      } else {
        setError(error instanceof Error ? error.message : String(error));
      }
      setTxStatus("error");
    }
  }

  useEffect(() => {
    switch (txStatus) {
      case "loading":
        notification.loading({
          id: faucet_event.loading,
          title: "Requesting the faucet tokens..."
        });
        break;
      case "success":
        toast.dismiss(faucet_event.loading);
        // notification.success({
        //   id: "facuet-tx-success",
        //   title: "Faucet request sent successfully"
        // });
        break;
      case "error":
        toast.dismiss(faucet_event.loading);
        notification.error({
          id: faucet_event.error,
          title: "Faucet request failed",
          description: error || "An unknown error occurred"
        });
        break;
    }
  }, [txStatus, error]);

  useEffect(() => {
    switch (faucetStatus) {
      case "loading":
        notification.loading({
          id: faucet_event.status_loading,
          title: "Faucet tokens request in Queue..."
        });
        break;
      // case "success":
      //   toast.dismiss(faucet_event.loading);
      //   notification.success({
      //     id: "facuet-tx-success",
      //     title: "Test tokens and ETH transferred successfully"
      //   });
      //   break;
      case "error":
        toast.dismiss(faucet_event.status_error);
        notification.error({
          id: faucet_event.error,
          title: "Faucet transaction failed",
          description: error || "An unknown error occurred"
        });
        break;
    }
  }, [faucetStatus, fError]);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      className="p-5 w-full max-w-[337px] sm:rounded-lg"
    >
      <DialogHeader className="mb-[26px]">
        <DialogTitle className="text-[22px]/[27px] font-medium text-left">
          Get Test Tokens
        </DialogTitle>
        <DialogDescription className="text-sm/[19px] text-[#CACACC] text-left">
          Click the button below to receive your testnet tokens. Need more?{" "}
          <Link
            href={meta.DISCORD}
            className="text-primary-blue hover:underline underline-offset-2"
          >
            Join our Discord
          </Link>{" "}
          for exclusive access to additional tokens.
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-start text-left gap-y-5 font-medium text-base/[14px]">
        {/* NETWORK SELECTOR */}
        <div className="space-y-3 w-full">
          <label className="opacity-80">Select Network</label>
          {/* <Select
            value={selectedNetwork.NAME}
            onValueChange={(value) => {
              const network = SUPPORTED_NETWORKS.find((n) => n.NAME === value)!;
              setSelectedNetwork(network);
            }}
          > */}
          <div className="border border-secondary-gray uppercase rounded-[4px] px-4 py-4 lg:py-2 font-normal text-sm">
            <p className="inline-flex items-center justify-start gap-x-2 uppercase">
              <Image
                src={selectedNetwork.LOGO}
                alt={selectedNetwork.NAME}
                height="24"
                width="24"
              />
              <span>{selectedNetwork.NAME}</span>
            </p>
          </div>
          {/* <SelectTrigger className="border border-secondary-gray uppercase rounded-[4px] px-4 py-4 lg:pt-2 lg:pb-1">
            <SelectValue
              placeholder={
                <p className="inline-flex items-center justify-start gap-x-2 uppercase">
                  <Image
                    src={selectedNetwork.LOGO}
                    alt={selectedNetwork.NAME}
                    height="24"
                    width="24"
                  />
                  <span>{selectedNetwork.NAME}</span>
                </p>
              }
            />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_NETWORKS.map((network) => (
              <SelectItem
                value={network.NAME}
                key={network.NAME}
                className="pt-2 pb-1 pl-[9.5px] pr-[9.5px]"
              >
                <p className="inline-flex items-center justify-start gap-x-2 uppercase">
                  <Image src={network.LOGO} alt={network.NAME} height="24" width="24" />
                  {network.NAME}
                </p>
              </SelectItem>
            ))}
          </SelectContent> */}
          {/* </Select> */}
        </div>
        {/* TOKEN SELECTOR */}
        {/* <div className="space-y-3 w-full">
          <label>Select Token</label>
          <Select
            value={selectedToken.token}
            onValueChange={(value) => {
              const token = SUPPORTED_TOKENS.find((token) => token.token === value)!;
              setSelectedToken(token);
            }}
          >
            <SelectTrigger className="border border-secondary-gray uppercase rounded-[4px] pt-2 pb-1">
              <SelectValue
                placeholder={
                  <p className="inline-flex items-center justify-start gap-x-2 uppercase">
                    <Image
                      src={SUPPORTED_TOKENS[0].logo}
                      alt={SUPPORTED_TOKENS[0].token}
                      height="24"
                      width="24"
                    />
                    {SUPPORTED_TOKENS[0].token}
                  </p>
                }
              />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_TOKENS.map((token) => (
                <SelectItem
                  value={token.token}
                  key={token.logo}
                  className="data-[state=checked]:bg-[#293849] hover:bg-[#293849] pt-2 pb-1 pl-[9.5px] pr-[9.5px]"
                >
                  <p className="inline-flex items-center justify-start gap-x-2">
                    <Image src={token.logo} alt={token.token} height="24" width="24" />
                    {token.token.toUpperCase()}
                  </p>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
        {/* ADDRESS */}
        <div className="flex flex-col space-y-2 w-full mt-4 text-right">
          <label htmlFor="user-address">Wallet Address</label>
          <span
            id="user-address"
            className="font-normal text-sm text-[#6D6D6D] inline-flex items-center justify-end gap-x-2"
          >
            {isConnected ? shortenHash(address) : "Connect Wallet to recieve tokens"}
          </span>
        </div>
        {/* CTA */}
        <ButtonCTA
          disabled={txStatus === "loading" || !isConnected || !address}
          className="w-full rounded-[4px] font-sans-ibm-plex font-medium text-sm/[22px]"
          onClick={() => {
            callFaucetAirdrop(address!);
          }}
        >
          {/* {isTxLoading || isLoading ? ( */}
          {txStatus === "loading" ? (
            <SpinnerIcon className="size-[22px]" />
          ) : isConnected ? (
            <span>GET TOKENS</span>
          ) : (
            <span>Please Connect Wallet</span>
          )}
        </ButtonCTA>
      </div>
    </Modal>
  );
};

export default memo(FaucetModal);
