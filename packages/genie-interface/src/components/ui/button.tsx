"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-sans-ibm-plex font-medium text-sm/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-slate-950 focus-visible:ring-slate-300",
  {
    variants: {
      variant: {
        default: "bg-[#00A0FC] text-white",
        destructive: "bg-red-900 text-slate-50 hover:bg-red-900/90",
        outline:
          "border border-[#B5B5B5] text-white bg-transparent hover:text-slate-50 hover:bg-white/5",
        "default-outline": "border border-primary-blue text-gradient-blue",
        secondary: "bg-[#212C42] text-white hover:bg-slate-800/80",
        ghost: "hover:bg-slate-800 hover:text-slate-50",
        link: "underline-offset-4 hover:underline text-slate-50"
      },
      size: {
        default: "h-12 px-10",
        sm: "px-3 py-2",
        lg: "h-9 px-7",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), "")}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
