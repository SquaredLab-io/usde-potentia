"use client";

import { Dispatch, FC, SetStateAction, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { meta } from "@lib/constants";

interface NavItem {
  name: string;
  href: string;
  target: string;
}

interface MobileNavigationProps {
  items: NavItem[];
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsFaucetOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
}

const MobileNavigation: FC<MobileNavigationProps> = ({
  items,
  setIsModalOpen,
  setIsFaucetOpen,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Image
            src="/icons/DoubleHamMenuIcon.svg"
            alt="Navigation Menu button"
            height={12}
            width={20}
          />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className={className}>
        <SheetHeader>
          <SheetTitle>
            {/* Brand Logo */}
            <Link href="/" className="max-w-fit float-right mt-1">
              <span className="sr-only">Genie DEX</span>
              <Image
                src="/images/logo-wide-color.svg"
                alt={`${meta.APP_NAME} logo`}
                width={116.37}
                height={42.46}
                priority
              />
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-7 mt-20 float-right">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.target}
              className="text-lg/6 font-semibold transition-colors hover:text-primary text-right"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              {item.name}
            </Link>
          ))}
          <button
            className={cn(
              "text-lg/6 font-semibold transition-colors hover:text-primary text-right"
            )}
            onClick={() => {
              setIsModalOpen(true);
              setIsOpen(false);
            }}
          >
            Feedback & Support
          </button>
          <button
            className={cn(
              "text-lg/6 font-semibold transition-colors hover:text-primary text-right"
            )}
            onClick={() => {
              setIsFaucetOpen(true);
              setIsOpen(false);
            }}
          >
            Faucet
          </button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
