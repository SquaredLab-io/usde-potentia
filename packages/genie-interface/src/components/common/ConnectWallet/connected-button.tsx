import Dropdown from "@components/icons/Dropdown";
import { getIconPath } from "@lib/utils";
import { shortenHash } from "@lib/utils/formatting";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useAccount } from "wagmi";
import ProfileDrawer from "../profile-drawer";

const ConnectedButton = () => {
  const { address, connector } = useAccount();

  if (!connector) return <ConnectButton label="Connect Wallet" showBalance={false} />;

  return (
    <ProfileDrawer userPoints={0}>
      <div className="max-w-fit flex flex-row items-center gap-x-1">
        <Image
          src={getIconPath(connector.id)}
          height={24}
          width={24}
          alt="connector icon"
          priority
        />
        <span className="font-normal text-[13px]/5">{shortenHash(address, 5, 4)}</span>
        <Dropdown />
      </div>
    </ProfileDrawer>
  );
};

export default ConnectedButton;
