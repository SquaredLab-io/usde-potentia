"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-sans-ibm-plex font-medium text-sm/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 py-3 border-[0.5px]",
  {
    variants: {
      variant: {
        long: "text-[#07AD3B] bg-[#121F27] active:bg-[#01371299]/60 border-[#07AD3B]",
        short: "text-[#FF3318] bg-[#121F27] active:bg-[#2E050099]/60 border-[#FF3318]"
      }
    },
    defaultVariants: {
      variant: "long"
    }
  }
);

export interface TradeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const TradeButton = React.forwardRef<HTMLButtonElement, TradeButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, className }), "")}
        ref={ref}
        {...props}
      />
    );
  }
);
TradeButton.displayName = "TradeButton";

export default TradeButton;
