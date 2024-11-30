import { FC, ReactNode } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import Modal from "@components/common/Modal";
import { useModalStore } from "@store/poolsStore";
import { shortenHash } from "@lib/utils/formatting";

interface PropsType {
  children?: ReactNode | undefined;
}

const ReferralModal: FC<PropsType> = ({ children }) => {
  const { openReferralModal, setOpenReferralModal } = useModalStore();
  const { address } = useAccount();

  return (
    <Modal
      open={openReferralModal}
      onOpenChange={setOpenReferralModal}
      trigger={children}
      closable={false}
      className="bg-primary-gray flex flex-col gap-y-8 w-fit min-w-[28rem] rounded-2xl py-12 px-9 border"
    >
      <div className="flex flex-row items-center gap-x-4 border">
        <Image
          src="/icons/metamask.svg"
          alt="Metamask Wallet"
          height={80}
          width={80}
          className="border"
          priority
        />
        <div className="flex flex-col items-start justify-center font-medium border">
          <h1 className="text-[#7C7C7C] text-[15px]/20">Metamask Wallet</h1>
          <span className="text-[26px]/20">{shortenHash(address)}</span>
        </div>
      </div>
    </Modal>
  );
};

export default ReferralModal;
