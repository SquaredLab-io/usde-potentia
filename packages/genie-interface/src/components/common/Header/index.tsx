"use client";

import { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@lib/utils";
import { meta, navigation } from "@lib/constants";
import FeedbackModal from "./feedback-modal";
import ConnectWallet from "../ConnectWallet";
import FaucetModal from "@components/common/Header/faucet-modal";
import PointsNavigation from "./points-navigation";
import MobileNavigation from "./mobile-navigation";
import { useMediaQuery } from "usehooks-ts";

const Header = () => {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFaucetOpen, setIsFaucetOpen] = useState<boolean>(false);
  const isDesktop = useMediaQuery("(min-width: 640px)"); // tailwind `sm`

  return (
    <header className="flex flex-row flex-grow pt-3 pb-5 md:py-4 px-3 md:px-5 justify-between font-sans-ibm-plex max-w-full">
      <nav
        className="flex justify-between lg:justify-start items-center gap-12 max-w-fit"
        aria-label="Global"
      >
        {/* Brand Logo */}
        <Link href="/" className="-m-1.5 p-1.5 max-w-fit">
          <span className="sr-only">Genie DEX</span>
          <Image
            src="/images/logo-wide-color.svg"
            alt={`${meta.APP_NAME} logo`}
            width={116.37}
            height={42.46}
            priority
          />
        </Link>
        <div className="hidden lg:flex gap-x-6 lg:gap-x-8 xl:gap-x-11 font-medium text-[14px]/[22px] 2xl:text-[14px]/[22px] 3xl:text-[15.75px] uppercase">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              target={item.target}
              className={cn(
                pathname !== item.href && "opacity-35 hover:opacity-90 transition-opacity"
              )}
              aria-label={item.name}
            >
              {item.name}
            </Link>
          ))}
          <button
            className={cn(
              "max-w-fit uppercase",
              !isModalOpen && "opacity-35 hover:opacity-90 transition-opacity"
            )}
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Feedback & Support
          </button>
          <button
            className={cn(
              "max-w-fit uppercase",
              !isFaucetOpen && "opacity-35 hover:opacity-90 transition-opacity"
            )}
            onClick={() => {
              setIsFaucetOpen(true);
            }}
          >
            Faucet
          </button>
        </div>
      </nav>
      <div className="inline-flex gap-3 sm:gap-6 max-w-fit">
        {/* only show points in desktop */}
        {isDesktop && <PointsNavigation />}
        <ConnectWallet isBalance={isDesktop} />
        <div className="lg:hidden">
          <MobileNavigation
            items={navigation}
            setIsModalOpen={setIsModalOpen}
            setIsFaucetOpen={setIsFaucetOpen}
          />
        </div>
      </div>
      {isFaucetOpen && <FaucetModal open={isFaucetOpen} setOpen={setIsFaucetOpen} />}
      {isModalOpen && <FeedbackModal open={isModalOpen} setOpen={setIsModalOpen} />}
    </header>
  );
};

export default memo(Header);
